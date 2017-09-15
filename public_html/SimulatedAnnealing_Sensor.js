"use strict";

importScripts('./SimulatedAnnealing.js', './SensorDeploymentProblem.js');

function SimulatedAnnealing_Sensor(parameters) {
    SimulatedAnnealing.call(this, parameters);
    this.sensorDeploymentProblem = new SensorDeploymentProblem(parameters.numOfSensors, parameters.numOfPoints,
            parameters.radius, parameters.width, parameters.height);
    this.sensorDeploymentProblem.setPointsArray(parameters.initialPointsArray);
}
;

SimulatedAnnealing_Sensor.prototype = Object.create(SimulatedAnnealing.prototype);
SimulatedAnnealing_Sensor.prototype.constructor = SimulatedAnnealing;

SimulatedAnnealing_Sensor.prototype.calculateObjValue = function (array) {
    this.sensorDeploymentProblem.setSensorsArray(array);
    return -1 * this.sensorDeploymentProblem.getCoverage();
};

SimulatedAnnealing_Sensor.prototype.createRandomPosition = function () {
    var randPos = this.sensorDeploymentProblem.generateRandomSensorsArray();
    return randPos;
};

SimulatedAnnealing_Sensor.prototype.createInitialSolution = function () {
    var randPos = this.sensorDeploymentProblem.generateRandomSensorsArray();
    var randF = this.calculateObjValue(randPos);
    return new Solution(randPos, randF); //create random solution
};

SimulatedAnnealing_Sensor.prototype.fixBoundary = function (array) {
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
        "T": e.data[0],
        "alpha": e.data[1],
        "epsilon": e.data[2],
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

    var sa_s = new SimulatedAnnealing_Sensor(parameters);
    sa_s.solve();
};