"use strict";

var sensors = [];
var points = [];
var numOfSensors = 0;
var numOfPoints = 0;
var sensorRadius = 35;

var drawingArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.canvas.style = "border:1px solid #c3c3c3;background-color: #f1f1f1;";
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    rePaint: function () {
        this.clear();
        var i;
        for (i = 0; i < numOfSensors; i++) {
            sensors[i].draw();
        }
    },
    addSensor: function (sensor) {
        sensors[numOfSensors++] = sensor;
    },
    addPoint: function (point) {
        points[numOfPoints++] = point;
    },
    randomDeployment(num) {
        var i;
        for (i = 0; i < num; i++) {
            var posX = Math.random() * this.canvas.width;
            var posY = Math.random() * this.canvas.height;
            var sensor = new Sensor(new Coordinate(posX, posY), sensorRadius);
            this.addSensor(sensor);
        }
    }
};

function Sensor(coordinate, radius) {
    this.coordinate = coordinate;
    this.radius = radius;

    this.draw = function () {
        var ctx = drawingArea.context;
        ctx.beginPath();
        ctx.arc(this.coordinate.posX, this.coordinate.posY, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
        ctx.fill();
        //ctx.stroke();
        console.log(this.coordinate);

    };
}

function Coordinate(posX, posY) {
    this.posX = posX;
    this.posY = posY;
}

function Point(coordinate) {
    this.coordinate = coordinate;
}

