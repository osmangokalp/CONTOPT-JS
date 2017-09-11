"use strict";

importScripts('./ContinuousOptimizer.js', './GaussianRNG.js');

function SimulatedAnnealing(parameters) {
    ContinuousOptimizer.call(this, parameters);
    this.T = parameters.T;
    this.alpha = parameters.alpha;
    this.epsilon = parameters.epsilon;
    this.rng = new MarsagliaPolar();
}
;

SimulatedAnnealing.prototype = Object.create(ContinuousOptimizer.prototype);
SimulatedAnnealing.prototype.constructor = ContinuousOptimizer;

SimulatedAnnealing.prototype.solve = function () {
    var i, numOfFunctionEval = 0;
    var current, neighborPos, neighborFitness, j;
    
    var randomPos = this.createRandomPosition();
    current = new Solution(randomPos, this.calculateObjValue(randomPos));
    this.globalBest = new Solution(current.position.slice(), current.fitness); //set initial solution as the global best
    
    while (numOfFunctionEval < this.maxFEs && this.T > this.epsilon) {
        neighborPos = current.position.slice();
        
        for (var j = 0; j < this.dimension; j++) {
            neighborPos[j] = current.position[j] + this.rng.generateRandom(0, 1) * 6;
        } 
        neighborPos = this.fixBoundary(neighborPos);
        neighborFitness = this.calculateObjValue(neighborPos);
        
        if (neighborFitness <= current.fitness) { //update current
            current.position = neighborPos.slice();
            current.fitness = neighborFitness;
            if (current.fitness < this.globalBest.fitness) { //update globalbest
                this.globalBest = new Solution(current.position.slice(), current.fitness);
                postMessage([numOfFunctionEval, this.globalBest.fitness, this.globalBest.position]);
            }
        } else { 
            var prob = Math.random();
            var delta = neighborFitness - current.fitness;
            if (prob < Math.exp(-delta / this.T)) { //accept with metropolis criterion
                current.position = neighborPos.slice();
                current.fitness = neighborFitness;
            } 
        }
        
        this.T *= this.alpha; //decrease temperature
        
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