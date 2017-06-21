"use strict";

function SensorProblem(sensors, points, radius, areaWidth, areaHeight) {
    this.sensors = sensors;
    this.points = points;
    this.radius = radius;
    this.areaWidth = areaWidth;
    this.areaHeight = areaHeight;
    this.coverage = 0;
    
    var calculateCoverage = function() {
        var i, j, numOfCoveredPoints = 0;
        for (i = 0; i < this.points.length; i++) {
            var covered = false;
            var x1 = this.points[i].coordinate.posX;
            var y1 = this.points[i].coordinate.posY;
            for(j = 0; j < this.sensors.length; j++) {
                var x2 = this.sensors[j].coordinate.posX;
                var y2 = this.sensors[j].coordinate.posY;
                var dist = Math.sqrt( (x2 - x1) * (x2 - x1) - (y2 - y1) * (y2 - y1));
                if (dist <= this.radius) {
                    numOfCoveredPoints++;
                    break;
                }
            }
        }
        this.coverage = 100 * numOfCoveredPoints / this.points.length;
    };
    
    calculateCoverage();
};

SensorProblem.prototype.setSensors = function(sensors) {
    this.sensors = sensors;
    calculateCoverage();
};

SensorProblem.prototype.getCoverage = function() {
    return this.coverage;
};


