"use strict";

function SensorDeploymentProblem(numOfSensors, numOfPoints, radius, areaWidth, areaHeight) {
    this.numOfSensors = numOfSensors;
    this.numOfPoints = numOfPoints;
    this.sensorsArray = null;
    this.pointsArray = null;
    this.radius = radius;
    this.areaWidth = areaWidth;
    this.areaHeight = areaHeight;
    this.coverage = 0;
}
;

SensorDeploymentProblem.prototype.calculateCoverage = function () {
    var i, j, numOfCoveredPoints = 0;
    for (i = 0; i < this.numOfPoints; i++) {
        var x1 = this.pointsArray[2 * i];
        var y1 = this.pointsArray[2 * i + 1];

        for (j = 0; j < this.numOfSensors; j++) {
            var x2 = this.sensorsArray[2 * j];
            var y2 = this.sensorsArray[2 * j + 1];
            var dist = Math.sqrt(((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)));
            if (dist <= this.radius) {
                numOfCoveredPoints++;
                break;
            }
        }
    }
    this.coverage = 100 * numOfCoveredPoints / this.numOfPoints;
};

SensorDeploymentProblem.prototype.generateRandomSensorsArray = function () {
    var randomRensorsArray = [];
    for (var i = 0; i < this.numOfSensors; i++) {
        var posX = Math.random() * this.areaWidth;
        var posY = Math.random() * this.areaHeight;
        randomRensorsArray[2 * i] = posX;
        randomRensorsArray[2 * i + 1] = posY;
    }
    return randomRensorsArray;
};

SensorDeploymentProblem.prototype.generateRandomPointsArray = function () {
    var randomPointsArray = [];
    var b1 = 2, b2 = 3;
    for (var i = 0; i < this.numOfPoints; i++) {
        var posX = this.haltonSequence(i, b1) * this.areaWidth;
        var posY = this.haltonSequence(i, b2) * this.areaHeight;
        randomPointsArray[2 * i] = posX;
        randomPointsArray[2 * i + 1] = posY;
    }

    return randomPointsArray;
};

SensorDeploymentProblem.prototype.haltonSequence = function (i, b) {
    var r = 0;
    var f = 1;
    var i = i;
    while (i > 0) {
        f = f / b;
        r = r + f * (i % b);
        i = Math.floor(i / b);
    }
    return r;
};

SensorDeploymentProblem.prototype.getSensorsArray = function () {
    return this.sensorsArray;
};

SensorDeploymentProblem.prototype.getPointsArray = function () {
    return this.pointsArray;
};

SensorDeploymentProblem.prototype.setSensorsArray = function (sensorsArray) {
    this.sensorsArray = sensorsArray;
};

SensorDeploymentProblem.prototype.setPointsArray = function (pointsArray) {
    this.pointsArray = pointsArray;
};

SensorDeploymentProblem.prototype.getCoverage = function () {
    this.calculateCoverage();
    return this.coverage;
};

SensorDeploymentProblem.prototype.getAreaWidth = function () {
    return this.areaWidth;
};

SensorDeploymentProblem.prototype.getAreaHeight = function () {
    return this.areaHeight;
};

SensorDeploymentProblem.prototype.getRadius = function () {
    return this.radius;
};

SensorDeploymentProblem.prototype.getNumOfSensors = function () {
    return this.numOfSensors;
};

SensorDeploymentProblem.prototype.getNumOfPoints = function () {
    return this.numOfPoints;
};