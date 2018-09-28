
# 	888888ba                                   dP
# 	88    `8b                                  88
# 	88     88 88d888b. .d8888b. 88d888b. .d888b88 .d8888b. dP  dP  dP 88d888b.
# 	88     88 88'  `88 88'  `88 88'  `88 88'  `88 88'  `88 88  88  88 88'  `88
# 	88    .8P 88       88.  .88 88.  .88 88.  .88 88.  .88 88.88b.88' 88    88
# 	8888888P  dP       `88888P' 88Y888P' `88888P8 `88888P' 8888P Y8P  dP    dP
# 	                            88
# 	                            dP

Type = require './Type.coffee'
{ Theme } = require './Theme.coffee'
{ Icon } = require './Icon.coffee'
{ Ripple } = require './Ripple.coffee'

class exports.Dropdown extends Layer
	constructor: (options = {}) ->
		
		@options = options.options ? [] # array of strings
		@_optionLayers = []
		@_selection = undefined
		@_rows = options.rows ? 4
		@_fullHeight = (_.clamp(@options.length, 1, @_rows) * 48) + 16
		@_isOpen = false
		
		super _.defaults options,
			height: 48
			backgroundColor: 'rgba(255,255,255,0)'
			animationOptions: { time: .15, model: 'hsb' }
			clip: false
					
		# Value Layer
		@_valueLayer = new TextLayer
			name: 'Value Layer', parent: @
			fontSize: 16
			color: Theme.colors.page.text
			padding: {top: 18, right: 16, bottom: 20, left: 16}
			animationOptions: @animationOptions
			text: '{value}' 
		
		@_valueLayer.template = @value ? @placeholder ? ''
		
		# Dropdown Menu
		@_dropdown = new ScrollComponent
			name: 'Dropdown Menu', parent: @,
			height: @_fullHeight
			backgroundColor: 'rgba(255,255,255,0)'
			animationOptions: { time: .15, model: 'hsb' }
			scrollVertical: @options.length > 6
			contentInset: {top: 0, bottom: 0}
			propagateEvents: false
			scrollHorizontal: false


		# Dropdown Menu Options
		for option, i in @options
			newOption = new TextLayer
				name: option, parent: @_dropdown.content
				y: 8 + (48 * i)
				fontSize: 16, color: Theme.colors.page.text
				padding: {top: 10, right: 16, bottom: 20, left: 16}
				backgroundColor: 'rgba(238, 238, 238, 0)'
				animationOptions: @animationOptions
				opacity: 0, text: option
				clip: true
			
			newOption.ripple = new Ripple(newOption, false, colorOverride = 'rgba(0,0,0,.05)' )

			newOption.onMouseOver -> @animate { backgroundColor: 'rgba(238, 238, 238, 1)' }
			newOption.onMouseOut ->  @animate { backgroundColor: 'rgba(238, 238, 238, 0)' }
			newOption.onTap (event, layer) =>
				@_selection = layer
				@value = layer.text
				@_element.blur()
			
			newOption.ignoreEvents = true
			
			@_optionLayers.push(newOption)
		
		# set widths using explicit width or widest option layer
		@width = options.width ? _.maxBy(@_optionLayers, 'width')?.width + 32
		for layer in _.concat(@_dropdown, @_valueLayer, @_optionLayers)
			layer.width = @width
		
		# fix positioning
		@x = options.x; @y = options.y
		@_dropdown.updateContent()
		
		@_scrollIndicator = new Layer
			name: 'Scroll Indicator', parent: @_dropdown
			x: Align.right, y: 56
			height: 48, width: 4
			backgroundColor: 'rgba(220, 220, 220, 1.000)'
			opacity: 0
			
		@_dropdown.onMove @_updateScrollIndicator
		
		# Input Line
		@_inputLine = new Layer
			name: 'Input Line', parent: @
			height: 1, width: @width - 32
			x: 16, y: Align.bottom(-1)
			backgroundColor: '#000'
			animationOptions: { time: .05 }
			
		# Menu Icon
		@_menuIcon = new Icon
			name: 'Menu Icon', parent: @
			icon: 'menu-down'
			color: '#000'
			x: Align.right(-16), y: Align.center(4)
			animationOptions: @animationOptions

		# Turn on focus / blur for element
		Utils.insertCSS( """
			*:focus { outline: 0; }
			::selection { background: #{@selectionColor}; } 
			""" )
			
		@_element.contentEditable = true
		
		# Events
		@onTapEnd => if not @isOpen then @_open()
		@_element.onblur = @_close
		
	_open: =>

		@_isOpen = true

		for layer in [@_menuIcon, @_valueLayer, @_inputLine]
			layer.animate { opacity: 0 }
		
		@_scrollIndicator.animate { opacity: 1 }

			
		Utils.delay .15, =>
			@_dropdown.bringToFront()

			# Figure out how far to move the dropdown box

			selectionIndex = @_selection?.index
			lastIndex = @_optionLayers.length - 1
			optionsBelow = lastIndex - selectionIndex
			rows = @_rows

			shift = 0

			if selectionIndex <= 1 or not @_selection?
				shift = 0
			else if selectionIndex > lastIndex - (rows - 2)
				shift = (lastIndex - selectionIndex) - (rows - 2)
			else
				shift = -1

			offset = if shift < -1 then (shift * 48) - 4 else (shift * 48)


			@_scrollToSelection(shift)
			
			@_updateScrollIndicator()

			@_dropdown.animate
				y: offset
				height: @_fullHeight, 
				backgroundColor: 'rgba(255, 255, 255, 1)'
				shadowY: 1, shadowSpread: 1, shadowBlur: 3
		
		Utils.delay .2, =>
			for option in @_optionLayers
				option.ignoreEvents = false
				option.animate { opacity: 1 }
	

	_close: =>
		for option in @_optionLayers
			option.ignoreEvents = true
			option.animate { opacity: 0 }

		Utils.delay .05, =>  
			@_dropdown.animate
				y: 0
				height: 48, backgroundColor: 'rgba(255, 255, 255, 0)'
				shadowY: 0, shadowSpread: 0, shadowBlur: 0
						
			@_scrollIndicator.animate { opacity: 0 }
		
		Utils.delay .15, =>  
			@_dropdown.sendToBack()
			for layer in [@_menuIcon, @_valueLayer, @_inputLine]
				layer.animate { opacity: 1 }

			@_isOpen = false
	

	_scrollToSelection: (shift) =>
		yPos = @_selection?.y ? 0

		@_dropdown.scrollToPoint(
			{x: 0, y: -8 + yPos + (shift * 48)}
			false
			)

	_updateScrollIndicator: =>
		scrollY = @_dropdown.scrollY
		max = -(@_fullHeight - @_dropdown.content.height)
		
		@_scrollIndicator.y = Utils.modulate(
			scrollY, 
			[0, max], 
			[8, @_fullHeight - 64],
			true
			)
	
	@define 'value',
		get: -> return @_value
		set: (value) ->
			return if @_value is value
			@_value = value
			
			@_valueLayer.template = @_value
			@emit "change:selected", @value, @
			
	@define 'isOpen',
		get: -> return @_isOpen
		