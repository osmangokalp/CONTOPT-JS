
"use strict";

importScripts('./BenchmarkFunctions.js', './Solution.js', './GaussianRNG.js');

/**
 * (1+lambda) strategy
 * Uncorrelated mutation with one sigma
 */
function EvolutionStrategies() {
    this.lambda = null;
    this.tau = null;
    this.maxNumOfFunctionEval = null;
    this.objFunc = null;
    this.upperBound = null;
    this.lowerBound = null;
    this.dimension = null;
    this.rng = null;
    this.parent = null;
}
;

EvolutionStrategies.prototype.init = function (parameters) {
    this.lambda = parameters.lambda;
    this.tau = parameters.tau;
    this.maxNumOfFunctionEval = parameters.maxNumOfFunctionEval;
    this.objFunc = parameters.objFunc;
    this.upperBound = parameters.upperBound;
    this.lowerBound = parameters.lowerBound;
    this.dimension = parameters.dimension;
    this.rng = new MarsagliaPolar();
    var randomPos = createRandomPosition(this.lowerBound, this.upperBound, this.dimension);
    this.parent = new ESUncorrelatedSolution(randomPos, this.objFunc(randomPos), parameters.sigma);
};

EvolutionStrategies.prototype.solve = function () {
    var numOfFunctionEval = 0;
    var i, neighbor;
    var bestFitness = Number.MAX_VALUE, bestPosition = [], bestSigma;
    
    while (numOfFunctionEval + this.lambda <= this.maxNumOfFunctionEval) {
        for (i = 0; i < this.lambda; i++) {
            neighbor = this.createNeighbor();
            if(neighbor.fitness <= bestFitness) { //store the properties of the best child
                bestFitness = neighbor.fitness;
                bestPosition = neighbor.position.slice(0);
                bestSigma = neighbor.sigma;
            }
        }
        numOfFunctionEval += this.lambda;
        
        if (bestFitness <= this.parent.fitness) { //update the parent
            this.parent = new ESUncorrelatedSolution(bestPosition, bestFitness, bestSigma);
            postMessage("Best: " + this.parent.position + " Fitness: " + this.parent.fitness);
        }
    }
    
};

EvolutionStrategies.prototype.createNeighbor = function () {
    var neighborPos, sigmaPrime, i;
    var sigma = this.parent.sigma;
    var step;
    neighborPos = this.parent.position.slice(0);
    sigmaPrime = sigma * Math.exp(this.tau * this.rng.generateRandom(0, 1));
    for (i = 0; i < this.dimension; i++) { //mutate each dimension
        do {
            step = sigmaPrime * this.rng.generateRandom(0, 1);
        } while (neighborPos[i] + step > this.upperBound || neighborPos[i] + step < this.lowerBound); //ensure that new pos is in the limits
        neighborPos[i] += step;
    }
    
    return new ESUncorrelatedSolution(neighborPos, this.objFunc(neighborPos), sigmaPrime);
};

function ESUncorrelatedSolution(position, fitness, sigma) {
    Solution.call(this, position, fitness);
    this.sigma = sigma;
}
;
ESUncorrelatedSolution.prototype = Object.create(Solution.prototype);
ESUncorrelatedSolution.prototype.constructor = ESUncorrelatedSolution;

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
