"use strict";

importScripts('./EvolutionStrategies.js', './SensorDeploymentProblem.js');

function EvolutionStrategies_Sensor(parameters) {
    EvolutionStrategies.call(this, parameters);
    this.sensorDeploymentProblem = new SensorDeploymentProblem(parameters.numOfSensors, parameters.numOfPoints,
            parameters.radius, parameters.width, parameters.height);
    this.sensorDeploymentProblem.setPointsArray(parameters.initialPointsArray);
}
;

EvolutionStrategies_Sensor.prototype = Object.create(EvolutionStrategies.prototype);
EvolutionStrategies_Sensor.prototype.constructor = EvolutionStrategies;

EvolutionStrategies_Sensor.prototype.calculateObjValue = function (array) {
    this.sensorDeploymentProblem.setSensorsArray(array);
    return -1 * this.sensorDeploymentProblem.getCoverage();
};

EvolutionStrategies_Sensor.prototype.createRandomPosition = function(){
    return this.sensorDeploymentProblem.generateRandomSensorsArray();
};

EvolutionStrategies_Sensor.prototype.createParent = function () {
    var randomPos = this.sensorDeploymentProblem.generateRandomSensorsArray();
    return new ESUncorrelatedSolution(randomPos, this.calculateObjValue(randomPos), this.sigma);
};

EvolutionStrategies_Sensor.prototype.checkBoundary = function (num, i) {
    if (num < 0) {
        return false;
    }
    if (i % 2 === 0 && num > this.sensorDeploymentProblem.getAreaWidth()) {
        return false;
    }
    if (i % 2 === 1 && num > this.sensorDeploymentProblem.getAreaHeight()) {
        return false;
    }
    return true;
};

onmessage = function (e) {
   
    var parameters = {
        "sigma": e.data[0],
        "lambda": e.data[1],
        "tau": e.data[2],
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

    var es_s = new EvolutionStrategies_Sensor(parameters);
    es_s.solve();
};