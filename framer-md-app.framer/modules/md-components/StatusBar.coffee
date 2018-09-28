# .d88888b    dP              dP                      888888ba                   
# 88.    "'   88              88                      88    `8b                  
# `Y88888b. d8888P .d8888b. d8888P dP    dP .d8888b. a88aaaa8P' .d8888b. 88d888b.
#       `8b   88   88'  `88   88   88    88 Y8ooooo.  88   `8b. 88'  `88 88'  `88
# d8'   .8P   88   88.  .88   88   88.  .88       88  88    .88 88.  .88 88      
#  Y88888P    dP   `88888P8   dP   `88888P' `88888P'  88888888P `88888P8 dP  

Type = require './Type.coffee'
{ Ripple } = require './Ripple.coffee'
{ Icon } = require './Icon.coffee'
{ Theme } = require './Theme.coffee'

exports.StatusBar = class StatusBar extends Layer
	constructor: (options = {}) ->

		super _.defaults options,
			name: '.'
			width: Screen.width, height: 24
			backgroundColor: Theme.statusBar.backgroundColor

		@items = new Layer
			name: '.', parent: @
			width: 100
			height: 15
			x: Align.right(-8)
			y: 5
			backgroundColor: null
			style:
				lineHeight: 0

		@on "change:color", => @setSVG()
		@color = '#FFF'

	setSVG: ->
		@items.html = """
			<svg 
				width="100px" 
				height="15px" 
				viewBox="0 0 100 15" 
				version="1.1" 
				xmlns="http://www.w3.org/2000/svg" 
				xmlns:xlink="http://www.w3.org/1999/xlink"
				>
			    <defs>
			        <polygon id="path-1" points="1.70530257e-13 0 8 12 16 0"></polygon>
			        <polygon id="path-3" points="12 12 12 0 -1.13686838e-13 12"></polygon>
			        <path d="M7,1 L6,1 L6,0 L2,0 L2,1 L1,1 C0.4,1 -1.13686838e-13,1.4 -1.13686838e-13,2 L-1.13686838e-13,12 C-1.13686838e-13,12.6 0.4,13 1,13 L7,13 C7.6,13 8,12.6 8,12 L8,2 C8,1.4 7.6,1 7,1 L7,1 Z" id="path-5"></path>
			    </defs>
			    <g id="Group" transform="translate(-1.000000, 0.000000)">
		            <g id="wifi" transform="translate(0.000000, 1.000000)">
		                <mask id="mask-2" fill="white">
		                    <use xlink:href="#path-1"></use>
		                </mask>
		                <g id="wifi-mask"></g>
		                <path d="M8,0 C1.4,0 -4,5.4 -4,12 C-4,18.6 1.4,24 8,24 C14.6,24 20,18.6 20,12 C20,5.4 14.6,0 8,0 L8,0 Z M8,21 C3,21 -1,17 -1,12 C-1,7 3,3 8,3 C13,3 17,7 17,12 C17,17 13,21 8,21 L8,21 Z" id="Shape" fill-opacity="0.3" fill="#{@color}" mask="url(#mask-2)"></path>
		                <path d="M8,3 C3,3 -1,7 -1,12 C-1,17 3,21 8,21 C13,21 17,17 17,12 C17,7 13,3 8,3 L8,3 Z M8,18 C4.7,18 2,15.3 2,12 C2,8.7 4.7,6 8,6 C11.3,6 14,8.7 14,12 C14,15.3 11.3,18 8,18 L8,18 Z" id="Shape" fill-opacity="0.9" fill="#{@color}" mask="url(#mask-2)"></path>
		                <path d="M8,6 C4.7,6 2,8.7 2,12 C2,15.3 4.7,18 8,18 C11.3,18 14,15.3 14,12 C14,8.7 11.3,6 8,6 L8,6 Z M8,15 C6.3,15 5,13.7 5,12 C5,10.3 6.3,9 8,9 C9.7,9 11,10.3 11,12 C11,13.7 9.7,15 8,15 L8,15 Z" id="Shape" fill-opacity="0.9" fill="#{@color}" mask="url(#mask-2)"></path>
		                <circle id="Oval" fill-opacity="0.9" fill="#{@color}" mask="url(#mask-2)" cx="8" cy="12" r="3"></circle>
		            </g>
		            <g id="reception" transform="translate(26.000000, 1.000000)">
		                <mask id="mask-4" fill="white">
		                    <use xlink:href="#path-3"></use>
		                </mask>
		                <g id="reception-mask"></g>
		                <rect id="Rectangle-path" fill-opacity="0.3" fill="#{@color}" mask="url(#mask-4)" x="9" y="0" width="3" height="12"></rect>
		                <rect id="Rectangle-path" fill-opacity="0.3" fill="#{@color}" mask="url(#mask-4)" x="6" y="0" width="3" height="12"></rect>
		                <rect id="Rectangle-path" fill-opacity="0.9" fill="#{@color}" mask="url(#mask-4)" x="3" y="0" width="3" height="12"></rect>
		                <rect id="Rectangle-path" fill-opacity="0.9" fill="#{@color}" mask="url(#mask-4)" x="0" y="0" width="3" height="12"></rect>
		            </g>
		            <g id="battery" transform="translate(52.000000, 0.000000)">
		                <mask id="mask-6" fill="white">
		                    <use xlink:href="#path-5"></use>
		                </mask>
		                <g id="battery-mask"></g>
		                <rect id="Rectangle-path" fill-opacity="0.9" fill="#{@color}" mask="url(#mask-6)" x="0" y="10" width="8" height="3"></rect>
		                <rect id="Rectangle-path" fill-opacity="0.9" fill="#{@color}" mask="url(#mask-6)" x="0" y="7" width="8" height="3"></rect>
		                <rect id="Rectangle-path" fill-opacity="0.3" fill="#{@color}" mask="url(#mask-6)" x="0" y="4" width="8" height="3"></rect>
		                <rect id="Rectangle-path" fill-opacity="0.3" fill="#{@color}" mask="url(#mask-6)" x="0" y="1" width="8" height="3"></rect>
		                <rect id="Rectangle-path" fill-opacity="0.3" fill="#{@color}" mask="url(#mask-6)" x="2" y="0" width="4" height="1"></rect>
		            </g>
		            <g id="time" opacity="0.9" transform="translate(69.000000, 0.000000)" font-size="13" font-family="Roboto-Regular, Roboto" fill="#{@color}" font-weight="normal">
		                <text id="12:30">
		                    <tspan x="2.27373675e-13" y="14">12:30</tspan>
		                </text>
		            </g>
		        </g>
			</svg>
			"""