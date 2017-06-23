
"use strict";

importScripts('./BenchmarkFunctions.js', './Solution.js', './GaussianRNG.js');

/**
 * (1+lambda) strategy
 * Uncorrelated mutation with one sigma
 */
function EvolutionStrategies(parameters) {
    this.sigma = parameters.sigma;
    this.lambda = parameters.lambda;
    this.tau = parameters.tau;
    this.maxNumOfFunctionEval = parameters.maxNumOfFunctionEval;
    this.objFunc = parameters.objFunc;
    this.upperBound = parameters.upperBound;
    this.lowerBound = parameters.lowerBound;
    this.dimension = parameters.dimension;
    this.rng = new MarsagliaPolar();
    this.parent = null;
}
;

EvolutionStrategies.prototype.createRandomSolution = function(){
    return createRandomPosition(this.lowerBound, this.upperBound, this.dimension);
};

EvolutionStrategies.prototype.calculateObjValue = function (array) {
    return this.objFunc(array);
};

EvolutionStrategies.prototype.createParent = function () {
    var randomPos = this.createRandomSolution();
    return new ESUncorrelatedSolution(randomPos, this.calculateObjValue(randomPos), this.sigma);
};

EvolutionStrategies.prototype.solve = function () {
    var numOfFunctionEval = 0;
    var i, neighbor;
    var bestFitness, bestPosition = [], bestSigma;
    
    this.parent = this.createParent();
    
    while (numOfFunctionEval + this.lambda <= this.maxNumOfFunctionEval) {
        bestFitness = Number.MAX_VALUE;
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
        }
        
        if (numOfFunctionEval % 1000 === 0) {
            postMessage([this.parent.position, this.parent.fitness]);
        }
    }
    postMessage([this.parent.position, this.parent.fitness]);
};

EvolutionStrategies.prototype.createNeighbor = function () {
    var neighborPos, sigmaPrime, i;
    var step;
    neighborPos = this.parent.position.slice(0);
    sigmaPrime = this.parent.sigma * Math.exp(this.tau * this.rng.generateRandom(0, 1));
    for (i = 0; i < this.dimension; i++) { //mutate each dimension
        do {
            step = sigmaPrime * this.rng.generateRandom(0, 1);
        } while (this.checkBoundary(neighborPos[i] + step, i) === false); //ensure that new pos is in the limits
        neighborPos[i] += step;
    }
    
    return new ESUncorrelatedSolution(neighborPos, this.calculateObjValue(neighborPos), sigmaPrime);
};

EvolutionStrategies.prototype.checkBoundary = function (num, i) {
    if (num > this.upperBound || num < this.lowerBound) {
        return false;
    }
    return true;
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
        case "schwefel2_22":
            func = schwefel2_22;
            break;
        case "schwefel1_2":
            func = schwefel1_2;
            break;
        case "schwefel2_21":
            func = schwefel2_21;
            break;
        case "rosenbrock":
            func = rosenbrock;
            break;
        case "step":
            func = step;
            break;
        case "quarticWithNoise":
            func = quarticWithNoise;
            break;
        case "schwefel2_26":
            func = schwefel2_26;
            break;
        case "rastrigin":
            func = rastrigin;
            break;
        case "ackley":
            func = ackley;
            break;
        case "griewank":
            func = griewank;
            break;
        case "penalized":
            func = penalized;
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

    var es = new EvolutionStrategies(parameters);
    es.solve();
};
