# 	 888888ba             dP     dP
# 	 88    `8b            88     88
# 	a88aaaa8P' dP    dP d8888P d8888P .d8888b. 88d888b.
# 	 88   `8b. 88    88   88     88   88'  `88 88'  `88
# 	 88    .88 88.  .88   88     88   88.  .88 88    88
# 	 88888888P `88888P'   dP     dP   `88888P' dP    dP


Type = require './Type.coffee'
{ Ripple } = require './Ripple.coffee'
{ Icon } = require './Icon.coffee'
{ Theme } = require './Theme.coffee'

exports.Button = class Button extends Layer 
	constructor: (options = {}) ->
		@__constructor = true
		showLayers = options.showLayers

		# if an icon is passed in, return an icon class and bail
		if options.icon
			options.action ?= -> null
			options.color ?= Theme.colors.primary.main
			return new Icon(options)

		@_disabled
		@_action
		@_raised
		@_type
		@_base
		@_labelText

		@_explicitWidth = options.width
		@_startX = options.x

		@_type = options.type ? if options.raised then 'raised' else 'flat'

		# properties by type
		switch @_type
			when 'flat'
				@_base =
					name: 'Flat Button'
					height: 36
					width: options.width
					borderRadius: 2
					backgroundColor: null
					color: Theme.colors.secondary.main
					shadowY: 0
					shadowColor: 'rgba(0,0,0,.26)'
					shadowBlur: 0
					animationOptions: {time: .15}
			when 'raised'
				@_base =
					name: 'Raised Button'
					height: 36
					width: options.width
					borderRadius: 2
					backgroundColor: Theme.colors.secondary.main
					color: Theme.colors.secondary.text
					shadowY: 2
					shadowColor: 'rgba(0,0,0,.26)'
					shadowBlur: 4
					animationOptions: {time: .15}

		super _.defaults options, @_base

		# text label
		@labelLayer = new Type.Button
			name: if showLayers then 'Label' else '.'
			parent: @
			height: 36
			width: options.width
			text: '{labelText}'
			textTransform: 'uppercase'
			textAlign: 'center'
			color: @color
			animationOptions: {time: .15}
			padding:
				left: 16.5, right: 16.5
				top: 9, bottom: 11

		@setRipple()

		# events
		@onTapStart ->
			@showRaised()

		@onTapEnd ->
			return if @_disabled
			@_action()
			@refresh()

		@labelLayer.on "change:width", =>
			return if @_explicitWidth
			@width = @labelLayer.width
			@_base.width = @labelLayer.width
			@setRipple()

		@on "change:width", =>
			return if @width is @labelLayer.width
			@labelLayer.width = @width
			@setRipple()

		# set props
		@action = options.action
		@disabled = options.disabled ? false

		delete @__constructor

		@text = options.text ? 'button'
		
	showRaised: => 
		return if @disabled
		return if @type isnt 'raised'
		@animate {shadowY: 5, shadowBlur: 8}

	setRipple: ->
		@mask?.destroy()

		@mask = new Layer
			parent: @
			size: @size
			backgroundColor: null
			borderRadius: 2
			clip: true
			opacity: 1

		@mask.placeBehind @labelLayer

		switch @type
			when 'flat'
				@ripple = new Ripple( @mask, null, colorOverride = 'rgba(0,0,0,.05)' )
			when 'raised'  
				@ripple = new Ripple( @mask, null )

	refresh: =>
		@animateStop()
		if @disabled
			if @type is 'raised'
				@animate
					backgroundColor: 'rgba(0,0,0,.12)'
					shadowY: 0
					shadowBlur: 0
			@labelLayer.animate
				color: 'rgba(0,0,0,.26)'
		else
			@animate @_base
			@labelLayer.animate
				color: @_base.color

	@define "type",
		get: -> return @_type

	@define "disabled",
		get: -> return @_disabled
		set: (bool = false) ->
			return if bool is @_disabled
			@_disabled = bool

			@emit("change:disabled", @_disabled, @)

			return if @__constructor
			@refresh()

	@define "action",
		get: -> return @_action
		set: (func = -> null) ->
			return if func is @_action
			@_action = func

	@define "text",
		get: -> return @_labelText
		set: (text = '') ->
			return if @__constructor
			@_labelText = text

			@labelLayer.visible = text.length > 0
			@labelLayer.template = text

			@x = @_startX
			@refresh()