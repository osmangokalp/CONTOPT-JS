
"use strict";

function Solution(position, fitness) {
    this.position = position;
    this.fitness = fitness;
}

function createRandomSolution(lowerBound, upperBound, dimension, func) {
    var randomPos = [];
    var scale = upperBound - lowerBound;
    var i;
    for (i = 0; i < dimension; i++) {
        randomPos[i] = (Math.random() - 0.5) * 2 * scale;
    }
    var fitness = func(randomPos);
    
    return new Solution(randomPos, fitness);
}