
"use strict";

importScripts('./BenchmarkFunctions.js', './Solution.js');

function SimulatedAnnealing() {
    this.alpha = null;
    this.temperature = null;
    this.epsilon = null;
    this.objFunc = null;
    this.upperBound = null;
    this.lowerBound = null;
    this.dimension = null;
    this.currentSolution = null;
    this.bestSolution = null;
}
;

SimulatedAnnealing.prototype.init = function (parameters) {
    this.alpha = parameters.alpha;
    this.temperature = parameters.temperature;
    this.epsilon = parameters.epsilon;
    this.objFunc = parameters.objFunc;
    this.upperBound = parameters.upperBound;
    this.lowerBound = parameters.lowerBound;
    this.dimension = parameters.dimension;
    var randomPos = createRandomPosition(this.lowerBound, this.upperBound, this.dimension);
    this.currentSolution = new Solution(randomPos, this.objFunc(randomPos));
    this.bestSolution = new Solution(randomPos, this.objFunc(randomPos));
};

SimulatedAnnealing.prototype.solve = function () {
    while (this.temperature > this.epsilon) {
        postMessage("Best: " + this.bestSolution.position + " Fitness: " + this.bestSolution.fitness);
        var candidateSolution = this.createNeighbor();
        var fCandidate = candidateSolution.fitness;

        var delta = fCandidate - this.currentSolution.fitness;

        if (delta < 0) {
            this.currentSolution = new Solution(candidateSolution.position.slice(0), candidateSolution.fitness);
            if (this.currentSolution.fitness <= this.bestSolution.fitness) {
                this.bestSolution = new Solution(this.currentSolution.position.slice(0), this.currentSolution.fitness);
                //postMessage("Best: " + this.bestSolution.position + " Fitness: " + this.bestSolution.fitness);
            }
        } else {
            var proba = Math.random();

            if (proba < Math.exp(-delta / this.temperature)) {
                this.currentSolution = new Solution(candidateSolution.position.slice(0), candidateSolution.fitness);
            }
        }

        this.temperature *= this.alpha;
    }
};

SimulatedAnnealing.prototype.createNeighbor = function () {
    var neighborPos = this.currentSolution.position.slice(0);
    var stepSize = 1;
    var i;

    for (i = 0; i < this.dimension; i++) {
        var move = (Math.random() - 0.5) * stepSize;
        neighborPos[i] += move;

        if (neighborPos[i] < this.lowerBound) {
            neighborPos[i] = this.lowerBound;
        } else if (neighborPos[i] > this.upperBound) {
            neighborPos[i] = this.upperBound;
        }
    }
    var neighborFitness = this.objFunc(neighborPos);
    var neighbor = new Solution(neighborPos, neighborFitness);

    return neighbor;
};

onmessage = function (e) {
    var func;
    switch (e.data[3]) {
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
        "alpha": e.data[0],
        "temperature": e.data[1],
        "epsilon": e.data[2],
        "objFunc": func,
        "upperBound": e.data[4],
        "lowerBound": e.data[5],
        "dimension": e.data[6]
    };

    var sa = new SimulatedAnnealing();
    sa.init(parameters);
    sa.solve();
};

