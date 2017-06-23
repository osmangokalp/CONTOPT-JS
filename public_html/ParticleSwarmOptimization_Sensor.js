"use strict";

importScripts('./ParticleSwarmOptimization.js', './SensorDeploymentProblem.js', './Solution.js');

function ParticleSwarmOptimization_Sensor(parameters) {
    ParticleSwarmOptimization.call(this, parameters);
    this.sensorDeploymentProblem = new SensorDeploymentProblem(parameters.numOfSensors, parameters.numOfPoints,
            parameters.radius, parameters.width, parameters.height);
    this.sensorDeploymentProblem.setPointsArray(parameters.initialPointsArray);
}
;

ParticleSwarmOptimization_Sensor.prototype = Object.create(ParticleSwarmOptimization.prototype);
ParticleSwarmOptimization_Sensor.prototype.constructor = ParticleSwarmOptimization;

ParticleSwarmOptimization_Sensor.prototype.calculateObjValue = function (array) {
    this.sensorDeploymentProblem.setSensorsArray(array);
    return -1 * this.sensorDeploymentProblem.getCoverage();
};

ParticleSwarmOptimization_Sensor.prototype.createInitialPopulation = function () {
    //create initial population
    var i, d, randomPos, randomVelocity = [], f_i;
    for (i = 0; i < this.swarmSize; i++) {
        randomPos = this.sensorDeploymentProblem.generateRandomSensorsArray();
        for (d = 0; d < this.dimension; d++) {
            if (d % 2 === 0) {
                randomVelocity[d] = Math.random() * (this.sensorDeploymentProblem.getAreaWidth());
                randomVelocity[d] *= Math.random() > 0.5 ? -1 : 1; //U(-|bup-blo|, |bup-blo|)
            }
            if (d % 2 === 1) {
                randomVelocity[d] = Math.random() * this.sensorDeploymentProblem.getAreaHeight();
                randomVelocity[d] *= Math.random() > 0.5 ? -1 : 1; //U(-|bup-blo|, |bup-blo|)
            }
        }
        f_i = this.calculateObjValue(randomPos);
        this.swarm[i] = new Particle(randomPos, f_i, randomVelocity.slice(0));

        //update globalBest if there is better fitness
        if (i == 0 || f_i < this.globalBest.fitness) {
            this.globalBest = new Solution(randomPos.slice(0), f_i);
        }
    }
};

ParticleSwarmOptimization_Sensor.prototype.fixBoundary = function (array) {
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
        "swarmSize": e.data[0],
        "omega": e.data[1],
        "phi_p": e.data[2],
        "phi_g": e.data[3],
        "maxNumOfFunctionEval": e.data[4],
        "upperBound": e.data[5],
        "lowerBound": e.data[6],
        "dimension": e.data[7],
        "numOfSensors": e.data[8],
        "numOfPoints": e.data[9],
        "radius": e.data[10],
        "width": e.data[11],
        "height": e.data[12],
        "initialPointsArray": e.data[13]
    };

    var pso = new ParticleSwarmOptimization_Sensor(parameters);
    pso.solve();
};