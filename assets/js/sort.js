var BAR_HEIGHT_RATIO = 4;
var BAR_WIDTH = 20;
var BAR_SPACE = BAR_WIDTH / 2;
var BAR_RADIUS = 4;
var CANVAS_WIDTH = 640, CANVAS_HEIGHT = 480;
var BOTTOM_OFFSET = 50;
var BAR_Q = 20;

// set animation delays
var HIGHLIGHT_DELAY = 200;
var ALTER_NEXT_DELAY = 200;
var MOVE_DELAY = 200;

// initiate Raphaël canvas
var paper = Raphael("algorithm-canvas", CANVAS_WIDTH, CANVAS_WIDTH);

var Bar = function (position, value, index) {
	this.value = value;
	this.position = position;
	this.height = value * BAR_HEIGHT_RATIO;
	this.width = BAR_WIDTH;
	this.index = index;
	this.init();
};

Bar.prototype = {

	init: function () {
		var barX = (this.position + 1) * BAR_SPACE + this.position * BAR_WIDTH;
		var barY = CANVAS_HEIGHT - BOTTOM_OFFSET - this.height;
		this.bar = paper.rect(barX, barY, BAR_WIDTH, this.height, BAR_RADIUS);
		this.bar.attr({fill: "#FFFFFF", stroke: "#000000"});
		this.label = paper.text(barX + BAR_WIDTH / 2, CANVAS_HEIGHT - BOTTOM_OFFSET + 7, this.value);
	},

	move: function (position, delay, callback) {

		// set default params
		var delay = delay || 0;
		var callback = callback || function () {};
		
		// re-calculate the coordinations
		var barX = (position + 1) * BAR_SPACE + position * BAR_WIDTH;
		var barY = CANVAS_HEIGHT - BOTTOM_OFFSET - this.height;
		
		// animation for bar
		var barAnim = Raphael.animation(
			{
				x: barX
			}, MOVE_DELAY * (Math.abs(position - this.position)), ">", callback);

		// animation for label
		var labelAnim = Raphael.animation(
			{
				x: barX + BAR_WIDTH / 2
			}, MOVE_DELAY * (Math.abs(position - this.position)), ">", callback);
		
		this.bar.animate(barAnim.delay(delay)).toFront();
		this.label.animate(labelAnim.delay(delay)).toFront();

		this.position = position;
	},

	highlight: function (delay, callback) {
		var callback = callback || function () {};
		var delay = delay || 0;
		var anim = Raphael.animation({fill: "#000000", stroke: "#000000"}, HIGHLIGHT_DELAY, ">", callback);
		this.bar.animate(anim.delay(delay));
	},

	reset: function (delay) {
		var delay = delay || 0;
		var anim = Raphael.animation({fill: "#FFFFFF", stroke: "#000000"}, 0, "linear");
		this.bar.animate(anim.delay(delay));
	},

	setPosition: function (position) {
		var barX = (position + 1) * BAR_SPACE + position * BAR_WIDTH;
		this.bar.attr({x: barX});
		this.label.attr({x: barX + BAR_WIDTH / 2});
	}

};

window.onload = function () {

	var barList = [];

	for (var i = 0; i < BAR_Q; i++) {
		var value = Math.round(Math.random() * 100) + 1;
		barList[i] = new Bar(i, value, i);
	}
	
	var timer = 0;

	for (var i = BAR_Q; i > 0; i--) {
		for (var j = 0; j < i - 1; j++) {

			barList[j].highlight(timer);
			barList[j + 1].highlight(timer);

			timer += HIGHLIGHT_DELAY;

			if (barList[j].value > barList[j + 1].value) {

				// trick: set the actural position in advance
				barList[j].setPosition(j);
				barList[j + 1].setPosition(j + 1);

				barList[j].move(j + 1, timer);
				barList[j + 1].move(j, timer);

				timer += 1 * MOVE_DELAY;

				var temp = barList[j];
				barList[j] = barList[j + 1];
				barList[j + 1] = temp;

			}

			barList[j].reset(timer);
			barList[j + 1].reset(timer);
		}
	}

	for (var i = 0; i < BAR_Q; i++) {
		// recover the original position at start
		barList[i].setPosition(barList[i].index);
	}

};