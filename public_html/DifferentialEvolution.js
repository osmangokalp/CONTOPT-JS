"use strict";

importScripts('./BenchmarkFunctions.js', './Solution.js');

/**
 * Basic DE algorithm (DE/rand/1)
 */
function DifferentialEvolution(parameters) {
    this.NP = parameters.NP;
    this.F = parameters.F;
    this.CR = parameters.CR;
    this.maxNumOfFunctionEval = parameters.maxNumOfFunctionEval;
    this.objFunc = parameters.objFunc;
    this.upperBound = parameters.upperBound;
    this.lowerBound = parameters.lowerBound;
    this.dimension = parameters.dimension;
    this.solutions = [];
    
    this.globalBest = null;
}
;

DifferentialEvolution.prototype.solve = function () {
    var numOfFunctionEval = 0;
    var i, rA, rB, rC, R, rI, min = Number.MAX_VALUE, minIndex = 0;
    var a = [], b = [], c = [], y = [], x = [];

    this.createInitialPopulation();

    while (numOfFunctionEval + this.NP <= this.maxNumOfFunctionEval) {
        for (i = 0; i < this.NP; i++) {
            //Pick three agents a, b and c from the population at random
            do {
                rA = Math.floor((Math.random() * this.NP));
            } while (rA === i);

            a = this.solutions[rA].position;

            do {
                rB = Math.floor((Math.random() * this.NP));
            } while (rB === i || rB === rA);

            b = this.solutions[rB].position;

            do {
                rC = Math.floor((Math.random() * this.NP));
            } while (rC === i || rC === rA || rC === rB);

            c = this.solutions[rC].position;

            R = Math.floor((Math.random() * this.dimension)); //Pick a random dimension index R 

            x = this.solutions[i].position; // current solution
            
            console.log("rA: " + rA + ", rB: " + rB + ", rC: " + rC + ", i: " + i);
            
            y = x.slice(0);
            for (var j = 0; j < this.dimension; j++) {
                rI = Math.random();
                if (rI < this.CR || j === R) {
                    y[j] = a[j] + this.F * (b[j] - c[j]);
                } else {
                    y[j] = x[j];
                }
            }

            y = this.fixBoundary(y);
            var fy = this.calculateObjValue(y);

            if (fy < this.solutions[i].fitness) {
                this.solutions[i].position = y.slice(0);
                this.solutions[i].fitness = fy;
               
                if (fy < this.globalBest.fitness) {
                    this.globalBest.solution = y.slice(0);
                    this.globalBest.fitness = fy;
                    postMessage("Best: " + this.globalBest.position + " Fitness: " + this.globalBest.fitness);
                }
            }
        }
        numOfFunctionEval += this.NP;
    }
};

DifferentialEvolution.prototype.calculateObjValue = function (array) {
    return this.objFunc(array);
};

DifferentialEvolution.prototype.createRandomSolution = function () {
    var randPos = createRandomPosition(this.lowerBound, this.upperBound, this.dimension);
    return randPos;
};

DifferentialEvolution.prototype.fixBoundary = function (array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] > this.upperBound) {
            array[i] = this.upperBound;
        } else if (array[i] < this.lowerBound) {
            array[i] = this.lowerBound;
        }
    }
    
    return array;
};

DifferentialEvolution.prototype.createInitialPopulation = function () {
    var i, min = Number.MAX_VALUE, minIndex = 0;;
    //initialization step
    for (var i = 0; i < this.NP; i++) {
        var randPos = createRandomPosition(this.lowerBound, this.upperBound, this.dimension);
        var randF = this.calculateObjValue(randPos);
        this.solutions[i] = new Solution(randPos, randF); //create random solution

        if (randF < min) {
            min = randF;
            minIndex = i;
        }
    }
    this.globalBest = new Solution(this.solutions[minIndex].position.slice(0), min);
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
        "NP": e.data[0],
        "CR": e.data[1],
        "F": e.data[2],
        "maxNumOfFunctionEval": e.data[3],
        "objFunc": func,
        "upperBound": e.data[5],
        "lowerBound": e.data[6],
        "dimension": e.data[7]
    };

    var de = new DifferentialEvolution(parameters);
    de.solve();
};
