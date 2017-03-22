
"use strict";

function Solution(position, fitness) {
    this.position = position;
    this.fitness = fitness;
}
;

function createRandomPosition(lowerBound, upperBound, dimension) {
    var randomPos = [];
    var scale = upperBound - lowerBound;
    var i;
    for (i = 0; i < dimension; i++) {
        randomPos[i] = lowerBound + Math.random() * scale;
    }
    return randomPos;
}