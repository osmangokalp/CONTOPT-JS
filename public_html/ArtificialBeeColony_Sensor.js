"use strict";

importScripts('./ArtificialBeeColony.js', './SensorDeploymentProblem.js', './Solution.js');

function ArtificialBeeColony_Sensor(parameters) {
    ArtificialBeeColony.call(this, parameters);
    this.sensorDeploymentProblem = new SensorDeploymentProblem(parameters.numOfSensors, parameters.numOfPoints,
            parameters.radius, parameters.width, parameters.height);
    this.sensorDeploymentProblem.setPointsArray(parameters.initialPointsArray);
}
;

ArtificialBeeColony_Sensor.prototype = Object.create(ArtificialBeeColony.prototype);
ArtificialBeeColony_Sensor.prototype.constructor = ArtificialBeeColony;

ArtificialBeeColony_Sensor.prototype.calculateObjValue = function (array) {
    this.sensorDeploymentProblem.setSensorsArray(array);
    return -1 * this.sensorDeploymentProblem.getCoverage();
};

ArtificialBeeColony_Sensor.prototype.createRandomSolution = function () {
    var randPos = this.sensorDeploymentProblem.generateRandomSensorsArray();
    return randPos;
};

ArtificialBeeColony_Sensor.prototype.createInitialPopulation = function () {
    var i, min = Number.MAX_VALUE, minIndex = 0;
    
    //initialization step
    for (i = 0; i < this.foodNumber; i++) {
        var randPos = this.sensorDeploymentProblem.generateRandomSensorsArray();
        var randF = this.calculateObjValue(randPos);
        this.foods[i] = new Solution(randPos, randF); //create random solution
        this.trial[i] = 0; //init the trial number

        if (randF < min) {
            min = randF;
            minIndex = i;
        }
    }
    this.globalBest = new Solution(this.foods[minIndex].position.slice(0), min);
};

ArtificialBeeColony_Sensor.prototype.fixBoundary = function (array) {
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
        "limit": e.data[1],
        "maxNumOfFunctionEval": e.data[2],
        "upperBound": e.data[3],
        "lowerBound": e.data[4],
        "dimension": e.data[5],
        "numOfSensors": e.data[6],
        "numOfPoints": e.data[7],
        "radius": e.data[8],
        "width": e.data[9],
        "height": e.data[10],
        "initialPointsArray": e.data[11]
    };

    var abc_s = new ArtificialBeeColony_Sensor(parameters);
    abc_s.solve();
};