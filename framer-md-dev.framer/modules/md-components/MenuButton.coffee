# 	8888ba.88ba                              888888ba             dP     dP
# 	88  `8b  `8b                             88    `8b            88     88
# 	88   88   88 .d8888b. 88d888b. dP    dP a88aaaa8P' dP    dP d8888P d8888P .d8888b. 88d888b.
# 	88   88   88 88ooood8 88'  `88 88    88  88   `8b. 88    88   88     88   88'  `88 88'  `88
# 	88   88   88 88.  ... 88    88 88.  .88  88    .88 88.  .88   88     88   88.  .88 88    88
# 	dP   dP   dP `88888P' dP    dP `88888P'  88888888P `88888P'   dP     dP   `88888P' dP    dP

Type = require './Type.coffee'
{ Ripple } = require './Ripple.coffee'
{ Icon } = require './Icon.coffee'
{ Theme } = require './Theme.coffee'


exports.MenuButton = class MenuButton extends Layer
	constructor: (options = {}) ->

		{ app } = require './App.coffee'
		
		@_icon = options.icon ? 'home'
		@_text = options.text ? 'Default'
		@_action = options.action ? -> null
		@_view = options.view
		@_app = options.app
		@_i = options.i

		super _.defaults options,
			height: 48, width: 304
			backgroundColor: null

		@iconLayer = new Icon
			name: '.', parent: @
			y: Align.center
			icon: @_icon, color: Theme.menuOverlay.text
			action: -> null

		@labelLayer = new Type.Regular
			name: 'label', parent: @
			x: @iconLayer.maxX + 16
			y: Align.center()
			color: Theme.menuOverlay.text
			text: @_text

		@onTapEnd ->
			if @_view?
				if @_view.i > @_i
					app?.transition(@_view, app.showNextRight)
				else
					app?.transition(@_view, app.showNextLeft)
			Utils.delay .25, => @parent.hide()