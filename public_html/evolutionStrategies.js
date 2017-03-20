

"use strict";

importScripts('./benchmarkFunctions.js', './solution.js');

function EvolutionStrategies() {
    this.sigma = null;
    this.lambda = null;
    this.tau = null;
    this.maxNumOfFunctionEval = null;
    this.objFunc = null;
    this.upperBound = null;
    this.lowerBound = null;
    this.dimension = null;
    this.parent = null;
    this.child = null;
}
;

EvolutionStrategies.prototype.init = function (parameters) {
    this.sigma = parameters.sigma;
    this.lambda = parameters.lambda;
    this.tau = parameters.tau;
    this.maxNumOfFunctionEval = parameters.maxNumOfFunctionEval;
    this.objFunc = parameters.objFunc;
    this.upperBound = parameters.upperBound;
    this.lowerBound = parameters.lowerBound;
    this.dimension = parameters.dimension;
};

EvolutionStrategies.prototype.solve = function () {

};

EvolutionStrategies.prototype.createNeighbor = function () {

};

onmessage = function (e) {
    var func;
    switch (e.data[4]) {
        case "sphere":
            func = sphere;
            break;
        default:
            func = null;
    }

    var parameters = {
        "sigma": e.data[0],
        "lambda": e.data[1],
        "tau": e.data[2],
        "maxNumOfFunctionEval": e.data[3],
        "objFunc": func,
        "upperBound": e.data[5],
        "lowerBound": e.data[6],
        "dimension": e.data[7]
    };

    var es = new EvolutionStrategies();
    es.init(parameters);
    es.solve();
};
