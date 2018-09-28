# 	 a88888b.                         dP
# 	d8'   `88                         88
# 	88        .d8888b. 88d888b. .d888b88
# 	88        88'  `88 88'  `88 88'  `88
# 	Y8.   .88 88.  .88 88       88.  .88
# 	 Y88888P' `88888P8 dP       `88888P8

Type = require './Type.coffee'
{ Ripple } = require './Ripple.coffee'
{ Icon } = require './Icon.coffee'
{ Theme } = require './Theme.coffee'
{ Divider } = require './Divider.coffee'
{ Button } = require './Button.coffee'
{ Elevation } = require './Elevation.coffee'

exports.Card = class Card extends Layer
	constructor: (options = {}) ->
		showLayers = options.showLayers ? true

		@_stack = []

		@padding = options.padding ? {
			top: 16, right: 16, 
			bottom: 16, left: 16
			stack: 16
			}

		@_elevation
		@_raised = undefined

		_initExpand = options.expanded
		options.expanded = undefined

		@_expanded = false
		@_expand = options.expand

		@_baseHeight = options.height ? 200
		@_baseFooterHeight = 0

		@_baseY = options.y ? 8
		@_expand = options.expand
		@_actions = options.actions ? [] # [{text: "", action: ->}]
		@_verticalActions = options.verticalActions ? false

		super _.defaults options,
			name: 'Card'
			y: 8
			width: Screen.width - 16
			borderRadius: 2
			backgroundColor: '#f9f9f9'
			shadowY: 2, shadowBlur: 3
			clip: true
			animationOptions: {time: .15}

		@footer = new Layer
			name: '.', parent: @
			height: 52, width: @width
			y: Align.bottom
			backgroundColor: @backgroundColor
			animationOptions: {time: .15}
	
		@divider = new Divider
			name: 'Divider', parent: @footer
			visible: false

		if @_expand?

			@divider.visible = true
			@footer.visible = true

			@expandIcon = new Icon
				name: 'Expand Icon', parent: @footer
				x: Align.right(-12), y: Align.bottom(-12)
				icon: 'chevron-down', color: '#000'
				animationOptions: {time: .15}
				action: => @expanded = !@expanded

		if @_actions.length > 0

			@divider.visible = true
			@footer.visible = true

			startX = 8; startY = 8

			for action in @_actions
				@actionButtons = []

				button = new Button
					name: "#{action.text} Button", parent: @footer
					x: startX, y: Align.bottom(-startY)
					action: _.bind(action.action, @)
					text: action.text

				if !@_verticalActions then startX = button.maxX + 4
				if @_verticalActions
					startY = @height - button.y + 4
					@footer.y = button.y - 8
					@footer.height += button.height + 8

				@actionButtons.push(button)

			@_baseFooterHeight = @footer.height

	# add a layer to the stack
	addToStack: (layers = [], position) =>
		if not _.isArray(layers) then layers = [layers]
		last = _.last(@stack)

		if last?
			startY = last.maxY + (@padding.stack ? 0)
		else
			startY = @padding.top ? 0

		for layer in layers

			if layer.constructor.name is 'Card' then position = 'full'

			layer.props = 
				parent: @
				x: _.clamp(
					@padding.left + layer.x, 
					@padding.left, 
					@width - @padding.right - layer.width
					)
				y: startY

			switch position
				when 'full'
					layer.width = @width - ( @padding.left + @padding.right )
				when 'left'
					layer.props =
						width: (@width / 2) - @padding.left
						x: @padding.left
				when 'right'
					layer.props =
						width: (@width / 2) - @padding.right
						x: Align.right(-@padding.right)
				when 'center'
					layer.x = Align.center

			@stack.push(layer)
			
			layer.on "change:height", => @moveStack(@)
			
		@_setHeight()
	
	# pull a layer from the stack
	removeFromStack: (layer) =>
		_.pull(@stack, layer)
		@refresh()
	
	# stack layers in stack, with optional padding and animation
	_stackView: (
		animate = false, 
		padding = @padding.stack, 
		top = @padding.top, 
		animationOptions = {time: .25}
	) =>
	
		for layer, i in @stack
			
			if animate is true
				if i is 0 then layer.animate
					y: top
					options: animationOptions
					
				else layer.animate
					y: @stack[i - 1].maxY + padding
					options: animationOptions
			else
				if i is 0 then layer.y = top
				else layer.y = @stack[i - 1].maxY + padding
				
		@_setHeight()
	
	# move stack when layer height changes
	_moveStack: (layer) =>
		index = _.indexOf(@stack, layer)
		for layer, i in @stack
			if i > 0 and i > index
				layer.y = @stack[i - 1].maxY + @padding.stack

		@_setHeight()
	
	_setHeight: ->
		@height = _.last(@stack).maxY + (@padding.bottom ? 16)		
	
	# build with page as bound object
	build: (func) -> do _.bind(func, @)

	# refresh page
	refresh: -> @_stackView()
	
	@define "stack",
		get: -> return @_stack
		set: (layers) ->
			layer.destroy() for layer in @stack
			@addToStack(layers)

	@define "expanded",
		get: -> return @_expanded
		set: (bool) ->
			return if bool is @_expanded
			@_expanded = bool

			if @_expanded 
				@bringToFront()
				@expandIcon.animate {rotation: 180}
				@animate {height: @height + @_expand}
				@footer.animate {height: @_expand}
			else 
				@expandIcon.animate {rotation: 0}
				@animate {height: @_baseHeight}
				@footer.animate {height: @_baseFooterHeight}

			@emit "change:expanded", @_expanded, @

	@define "raised",
		get: -> return @_raised
		set: (bool) ->
			return if bool is @_raised
			@_raised = bool

			if @_raised then @elevation = 8
			else @elevation = 2

	@define 'elevation',
		get: -> return @_elevation
		set: (number) ->
			Elevation(@, number)

			
	
	