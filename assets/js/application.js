var Node = function (paper, cx, cy, text) {
	this.cx = cx;
	this.cy = cy;
	this.text = text;
	this.rx = 40;
	this.ry = 40;

	var c = paper.circle(cx, cy, 40);
	var t = paper.text(cx, cy, text);
	t.attr({
		"font-family": "Times",
		"font-size": "14px"
	});
};

Node.prototype = {};

var Point = {
	toString: function (p) {
		return p.x + "," + p.y;
	}
	
	, center: function (p1, p2) {
		return {x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2};
	}
};

var NodeManager = function () {};

NodeManager.prototype = {

	setCanvas: function (paper) {
		this.paper = paper;
	},

	link: function (nodeFrom, nodeTo) {
		var point = {
			from: {
				top: {x: nodeFrom.cx, y: nodeFrom.cy - nodeFrom.ry},
				bottom: {x: nodeFrom.cx, y: nodeFrom.cy + nodeFrom.ry},
				left: {x: nodeFrom.cx - nodeFrom.rx, y: nodeFrom.cy},
				right: {x: nodeFrom.cx + nodeFrom.rx, y: nodeFrom.cy}
			},
			to: {
				top: {x: nodeTo.cx, y: nodeTo.cy - nodeTo.ry},
				bottom: {x: nodeTo.cx, y: nodeTo.cy + nodeTo.ry},
				left: {x: nodeTo.cx - nodeTo.rx, y: nodeTo.cy},
				right: {x: nodeTo.cx + nodeTo.rx, y: nodeTo.cy}
			}
		};

		var beginPoint, endPoint, x0, y0, xEnd, yEnd, xC1, yC1, xC2, yC2;

		var offset = 50;

		if (Math.abs(nodeFrom.cx - nodeTo.cx) >= Math.abs(nodeFrom.cy - nodeTo.cy)) {

			if (nodeTo.cx >= nodeFrom.cx) {
				beginPoint = point.from;
				endPoint = point.to;
			} else {
				beginPoint = point.to;
				endPoint = point.from;
			}

			x0 = beginPoint.right.x;
			y0 = beginPoint.right.y;
			xEnd = endPoint.left.x;
			yEnd = endPoint.left.y;
			xC1 = beginPoint.right.x + offset;
			yC1 = beginPoint.right.y;
			xC2 = endPoint.left.x - offset;
			yC2 = endPoint.left.y;

		} else {

			if (nodeTo.cy >= nodeFrom.cy) {
				beginPoint = point.from;
				endPoint = point.to;
			} else {
				beginPoint = point.to;
				endPoint = point.from;
			}

			x0 = beginPoint.bottom.x;
			y0 = beginPoint.bottom.y;
			xEnd = endPoint.top.x;
			yEnd = endPoint.top.y;
			xC1 = beginPoint.bottom.x;
			yC1 = beginPoint.bottom.y + offset;
			xC2 = endPoint.top.x;
			yC2 = endPoint.top.y - offset;

		}

		var linkPath = ["M", x0, y0, "C", xC1, yC1, xC2, yC2, xEnd, yEnd].join(",");

		return this.paper.path(linkPath).attr({"arrow-end": "block-wide-long"});

	}



};

window.onload = function () {

	var paper = Raphael("algorithm-canvas", 800, 600);
	
	var x = new Node(paper, 50, 50, "Element");
	var y = new Node(paper, 500, 100, "Node");
	var z = new Node(paper, 300, 400, "GNU");
	var w = new Node(paper, 700, 300, "Mac OS");

	var m = new NodeManager();
	m.setCanvas(paper);

	m.link(x, y);
	m.link(x, z);
	m.link(x, w);
	m.link(y, z);
	m.link(y, w);
	m.link(z, w);
	
};