"use strict";

importScripts('./BenchmarkFunctions.js', './Solution.js');

function ContinuousOptimizer(parameters) {
    this.NP = parameters.NP;
    this.globalBest = null;
    this.upperBound = parameters.upperBound;
    this.lowerBound = parameters.lowerBound;
    this.dimension = parameters.dimension;
    this.maxFEs = parameters.maxFEs;
    this.objFunc = parameters.objFunc;
}
;

ContinuousOptimizer.prototype.solve = function () {};

ContinuousOptimizer.prototype.calculateObjValue = function (array) {
    return this.objFunc(array);
};

ContinuousOptimizer.prototype.fixBoundary = function (array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] > this.upperBound) {
            array[i] = this.upperBound;
        } else if (array[i] < this.lowerBound) {
            array[i] = this.lowerBound;
        }
    }
    
    return array;
};

ContinuousOptimizer.prototype.createInitialPopulation = function () {};

ContinuousOptimizer.prototype.createRandomPosition = function () {
    var randPos = createRandomPosition(this.lowerBound, this.upperBound, this.dimension);
    return randPos;
};