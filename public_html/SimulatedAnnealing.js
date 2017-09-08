"use strict";

importScripts('./ContinuousOptimizer.js');

function SimulatedAnnealing(parameters) {
    SimulatedAnnealing.call(this, parameters);
    this.T = parameters.T;
    this.alpha = parameters.alpha;
    this.epsilon = parameters.epsilon;
}
;

SimulatedAnnealing.prototype = Object.create(ContinuousOptimizer.prototype);
SimulatedAnnealing.prototype.constructor = ContinuousOptimizer;

SimulatedAnnealing.prototype.createParent = function () {
    var randomPos = this.createRandomPosition();
    return new Solution(randomPos, this.calculateObjValue(randomPos));
};

SimulatedAnnealing.prototype.solve = function () {
    var numOfFunctionEval = 0;
    var current, neighbor, neighborPos;
    
    current = this.createParent();
    this.globalBest = new Solution(this.current.position.slice(), this.current.fitness); //set initial solution as the global best
    
    while (numOfFunctionEval <= this.maxFEs && T > epsilon) {
        neighborPos = 
        if (this.current.fitness <= this.globalBest.fitness) { //update the globalBest
            this.globalBest = new ESUncorrelatedSolution(bestPosition, bestFitness, bestSigma);
            postMessage([numOfFunctionEval, this.globalBest.fitness, this.globalBest.position]);
        } else { //accept with metropolis criterion
            
        }
        
        numOfFunctionEval ++;
        
    }
    postMessage([numOfFunctionEval, this.globalBest.fitness, this.globalBest.position]);
};

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
        "T": e.data[0],
        "alpha": e.data[1],
        "epsilon": e.data[2],
        "maxFEs": e.data[3],
        "objFunc": func,
        "upperBound": e.data[5],
        "lowerBound": e.data[6],
        "dimension": e.data[7]
    };

    var sa = new SimulatedAnnealing(parameters);
    sa.solve();
};