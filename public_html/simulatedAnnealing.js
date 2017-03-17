
"use strict";

importScripts('./benchmarkFunctions.js', './solution.js');

function SimulatedAnnealing() {
    this.alpha = null;
    this.temperature = null;
    this.epsilon = null;
    this.func = null;
    this.upperBound = null;
    this.lowerBound = null;
    this.dimension = null;
    this.currentSolution = null;
    this.bestSolution = null;
}
;

SimulatedAnnealing.prototype.init = function (parameters) {
    this.alpha = parameters.alpha;
    console.log("alpha set to " + parameters.alpha + ", alpha: " + this.alpha);
    this.temperature = parameters.temperature;
    console.log("temperature set to " + parameters.temperature + ", temperature: " + this.temperature);
    this.epsilon = parameters.epsilon;
    console.log("epsilon set to " + parameters.epsilon + ", epsilon: " + this.epsilon);
    this.func = parameters.func;
    this.upperBound = parameters.upperBound;
    console.log("upperBound set to " + parameters.upperBound + ", upperBound: " + this.upperBound);
    this.lowerBound = parameters.lowerBound;
    console.log("lowerBound set to " + parameters.lowerBound + ", lowerBound: " + this.lowerBound);
    this.dimension = parameters.dimension;
    console.log("dimension set to " + parameters.dimension + ", dimension: " + this.dimension);
    this.currentSolution = createRandomSolution(this.lowerBound, this.upperBound, this.dimension, this.func);
};

SimulatedAnnealing.prototype.solve = function () {
    console.log("in solve method");
    while (this.temperature > this.epsilon) {
        var candidateSolution = this.createNeighbor();
        //console.log("current temperature: " + this.temperature);
        var fCandidate = this.func(candidateSolution);

        var delta = fCandidate - this.currentSolution.fitness;

        if (delta < 0) {
            this.currentSolution = candidateSolution;
            this.bestSolution = candidateSolution;
        } else {
            var proba = Math.random();
            
            if (proba < Math.exp(-delta / this.temperature)) {
                this.currentSolution = candidateSolution;
            }
        }
        
        this.temperature *= this.alpha;
        //console.log("Temp: " + this.temperature + " Current: " + this.currentSolution.position + " Fitness: " + this.currentSolution.fitness + " " + " Best: " + this.bestSolution.position + " Fitness: " + this.bestSolution.fitness);
    }
    postMessage("Best: " + this.bestSolution.position + " Fitness: " + this.bestSolution.fitness);
};

SimulatedAnnealing.prototype.createNeighbor = function () {
    var neighborPos = this.currentSolution.position.slice(0);
    var selectedIndex = Math.floor((Math.random() * this.dimension));
    var scale = this.upperBound - this.lowerBound;
    
    var move = (Math.random() - 0.5) * scale;
    console.log(move);
    neighborPos[selectedIndex] += move;
    
    //console.log("currentpos: " + this.currentSolution.position + ", newpos: " + neighborPos);

    if (neighborPos[selectedIndex] < this.lowerBound) {
        neighborPos[selectedIndex] = this.lowerBound;
    } else if (neighborPos[selectedIndex] > this.upperBound) {
        neighborPos[selectedIndex] = this.upperBound;
    }

    var neighborFitness = this.func(neighborPos);
    var neighbor = new Solution(neighborPos, neighborFitness);

    return neighbor;
};

onmessage = function (e) {
    var func;
    switch (e.data[3]) {
        case "sphere":
            func = sphere;
            break;
        default:
            func = null;
    }

    var parameters = {
        "alpha": e.data[0],
        "temperature": e.data[1],
        "epsilon": e.data[2],
        "func": func,
        "upperBound": e.data[4],
        "lowerBound": e.data[5],
        "dimension": e.data[6]
    };

    var sa = new SimulatedAnnealing();
    sa.init(parameters);
    sa.solve();
};

