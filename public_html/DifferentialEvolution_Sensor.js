"use strict";

importScripts('./DifferentialEvolution.js', './SensorDeploymentProblem.js');

function DifferentialEvolution_Sensor(parameters) {
    DifferentialEvolution.call(this, parameters);
    this.sensorDeploymentProblem = new SensorDeploymentProblem(parameters.numOfSensors, parameters.numOfPoints,
            parameters.radius, parameters.width, parameters.height);
    this.sensorDeploymentProblem.setPointsArray(parameters.initialPointsArray);
}
;

DifferentialEvolution_Sensor.prototype = Object.create(DifferentialEvolution.prototype);
DifferentialEvolution_Sensor.prototype.constructor = DifferentialEvolution;

DifferentialEvolution_Sensor.prototype.calculateObjValue = function (array) {
    this.sensorDeploymentProblem.setSensorsArray(array);
    return -1 * this.sensorDeploymentProblem.getCoverage();
};

DifferentialEvolution_Sensor.prototype.createRandomPosition = function () {
    var randPos = this.sensorDeploymentProblem.generateRandomSensorsArray();
    return randPos;
};

DifferentialEvolution_Sensor.prototype.createInitialPopulation = function () {
    var i, min = Number.MAX_VALUE, minIndex = 0;
    ;
    //initialization step
    for (var i = 0; i < this.NP; i++) {
        var randPos = this.sensorDeploymentProblem.generateRandomSensorsArray();
        var randF = this.calculateObjValue(randPos);
        this.solutions[i] = new Solution(randPos, randF); //create random solution

        if (randF < min) {
            min = randF;
            minIndex = i;
        }
    }
    this.globalBest = new Solution(this.solutions[minIndex].position.slice(0), min);
};

DifferentialEvolution_Sensor.prototype.fixBoundary = function (array) {
    for (var i = 0; i < this.sensorDeploymentProblem.getNumOfSensors(); i++) {
        if (array[2 * i] > this.sensorDeploymentProblem.getAreaWidth()) {
            array[2 * i] = this.sensorDeploymentProblem.getAreaWidth();
        } else if (array[2 * i] < 0) {
            array[2 * i] = 0;
        }

        if (array[2 * i + 1] > this.sensorDeploymentProblem.getAreaHeight()) {
            array[2 * i + 1] = this.sensorDeploymentProblem.getAreaHeight();
        } else if (array[2 * i + 1] < 0) {
            array[2 * i + 1] = 0;
        }
    }

    return array;
};

onmessage = function (e) {

    var parameters = {
        "NP": e.data[0],
        "CR": e.data[1],
        "F": e.data[2],
        "maxFEs": e.data[3],
        "upperBound": e.data[4],
        "lowerBound": e.data[5],
        "dimension": e.data[6],
        "numOfSensors": e.data[7],
        "numOfPoints": e.data[8],
        "radius": e.data[9],
        "width": e.data[10],
        "height": e.data[11],
        "initialPointsArray": e.data[12]
    };

    var de_s = new DifferentialEvolution_Sensor(parameters);
    de_s.solve();
};