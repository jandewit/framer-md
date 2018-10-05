#  888888ba                      dP   dP
#  88    `8b                     88   88
# a88aaaa8P' .d8888b. dP  dP  dP 88 d8888P .d8888b. 88d8b.d8b.
#  88   `8b. 88'  `88 88  88  88 88   88   88ooood8 88'`88'`88
#  88     88 88.  .88 88.88b.88' 88   88   88.  ... 88  88  88
#  dP     dP `88888P' 8888P Y8P  dP   dP   `88888P' dP  dP  dP

Type = require './Type.coffee'
{ Icon } = require './Icon.coffee'
{ Theme } = require './Theme.coffee'
{ Divider } = require './Divider.coffee'


exports.RowItem = class RowItem extends Layer
	constructor: (options = {}) ->

		@_icon = options.icon
		@_image = options.image
		@_iconBackgroundColor = options.iconBackgroundColor ? '#777'
		@_iconColor = options.iconColor ? "rgb(240, 240, 240)"
		@_iconText = options.iconText
		@_text = options.text ? 'Row item'
		@_row = options.row ? 0
		@_y = 32 + (@_row * 48)

		super _.defaults options,
			width: Screen.width
			y: @_y
			height: 48
			backgroundColor: null

		if @_image? or not @_icon? and not @_iconText?
			@icon = new Layer
				name: '.', parent: @
				x: 16, y: Align.center
				height: 32, width: 32, borderRadius: 16
				backgroundColor: @_iconBackgroundColor
				image: @_image

		else if @_icon?
			@icon = new Icon
				name: '.', parent: @
				x: 16, y: Align.center
				height: 32, width: 32, borderRadius: 16
				backgroundColor: @_iconBackgroundColor
				icon: @_icon
				color: @_iconColor

		else if @_iconText?
			@icon = new Type.Subhead
				name: '.', parent: @
				x: 16, y: Align.center
				height: 32, width: 32, borderRadius: 16
				padding: {
					top: 4
				}
				backgroundColor: @_iconBackgroundColor
				text: @_iconText
				textAlign: "center"
				color: @_iconColor

		@labelLayer = new Type.Regular
			name: '.', parent: @
			x: @icon.maxX + 16, y: Align.center, width: @_text.length * 8
			color: Theme.text.text
			text: @_text

		@.image = ''
