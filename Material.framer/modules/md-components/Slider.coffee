# 	.d88888b  dP oo       dP
# 	88.    "' 88          88
# 	`Y88888b. 88 dP .d888b88 .d8888b. 88d888b.
# 	      `8b 88 88 88'  `88 88ooood8 88'  `88
# 	d8'   .8P 88 88 88.  .88 88.  ... 88
# 	 Y88888P  dP dP `88888P8 `88888P' dP

Type = require 'md-components/Type'
{ Ripple } = require 'md-components/Ripple'
{ Icon } = require 'md-components/Icon'
{ Theme } = require 'md-components/Theme'

exports.Slider = class Slider extends SliderComponent
	constructor: (options = {}) ->

		@_notched = options.notched ? false

		super _.defaults options,
			name: '.', height: 2
			backgroundColor: 'rgba(0,0,0,.26)'
			min: 1, max: 10
		
		@fill.backgroundColor = Theme.colors.primary.main
		@knobSize = 44

		@knob.props =
			name: 'Knob'
			backgroundColor: null
			shadowX: 0
			shadowY: 0
			shadowBlur: 0

		@thumb = new Layer
			name: 'Thumb', parent: @knob
			x: Align.center, y: Align.center
			height: 12, width: 12, borderRadius: 12
			backgroundColor: Theme.colors.primary.main
			animationOptions: {time: .15}

		if @_notched

			for i in [0...@max-@min]
				notch = new Layer
					name: '.', parent: @
					x: i * @width/(@max-@min)
					width: 2, height: 2, borderRadius: 2,
					backgroundColor: Theme.colors.primary.text

				notch.placeBehind(@knob)

			@tip = new Layer
				name: 'Tip', parent: @knob
				x: Align.center, y: -24
				width: 26, height: 32
				html: '<svg width="26px" height="32px" viewBox="0 0 26 32"><path d="M13,0.1 C20.2,0.1 26,6 26,13.3 C26,17 24,20.9 18.7,26.2 L13,32 L7.2,26.2 C2,20.8 0,16.9 0,13.3 C-3.55271368e-15,6 5.8,0.1 13,0.1 L13,0.1 Z" fill="' + Theme.colors.primary.main + '"></path></svg>'
				backgroundColor: null, opacity: 0
				animationOptions: {time: .15}

			@tipValue = new TextLayer
				name: 'Tip Value', parent: @tip
				y: 5, width: 26
				color: Theme.colors.primary.text
				fontSize: 12, fontFamily: 'Roboto', textAlign: 'center'
				text: "{value}"

			@tipValue.template =
				value: @value

			@knob.onTouchStart => 
				@thumb.animate {opacity: 0}
				@tip.animate {opacity: 1}

			@onTouchEnd ->
				@animateStop()
				@thumb.animate {opacity: 1}
				@tip.animate {opacity: 0}

			round = (number, nearest) ->
			    (Math.round(number / nearest) + 1) * nearest
			 
			@knob.draggable.updatePosition = (point) =>
			    point.x = round(point.x, @width / (@max-@min) ) - (@knob.width / 2)
			    return point

			@onValueChange -> 
				@tipValue.template = Math.round(@value)

		else 
			@knob.onTouchStart => 
				@thumb.animate {width: 18, height: 18, x: 13, y: 13}
				Ripple(@knob, event.point, @thumb, new Color(Theme.primary).alpha(.3))
			@knob.onTouchEnd => 
				@animateStop()
				@thumb.animate {width: 12, height: 12, x: 15, y: 15}
		