"use strict";

importScripts('./GeneticAlgorithm.js', './SensorDeploymentProblem.js');

function GeneticAlgorithm_Sensor(parameters) {
    GeneticAlgorithm.call(this, parameters);
    this.sensorDeploymentProblem = new SensorDeploymentProblem(parameters.numOfSensors, parameters.numOfPoints,
            parameters.radius, parameters.width, parameters.height);
    this.sensorDeploymentProblem.setPointsArray(parameters.initialPointsArray);
}
;

GeneticAlgorithm_Sensor.prototype = Object.create(GeneticAlgorithm.prototype);
GeneticAlgorithm_Sensor.prototype.constructor = GeneticAlgorithm;

GeneticAlgorithm_Sensor.prototype.calculateObjValue = function (array) {
    this.sensorDeploymentProblem.setSensorsArray(array);
    return -1 * this.sensorDeploymentProblem.getCoverage();
};

GeneticAlgorithm_Sensor.prototype.createRandomPosition = function () {
    var randPos = this.sensorDeploymentProblem.generateRandomSensorsArray();
    return randPos;
};

GeneticAlgorithm_Sensor.prototype.createInitialPopulation = function () {
    var i, min = Number.MAX_VALUE, minIndex = 0;

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

GeneticAlgorithm_Sensor.prototype.fixBoundary = function (array) {
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
        "mutrate": e.data[1],
        "selection": e.data[2],
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

    var ga_s = new GeneticAlgorithm_Sensor(parameters);
    ga_s.solve();
};