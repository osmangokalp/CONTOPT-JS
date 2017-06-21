"use strict";

importScripts('./BenchmarkFunctions.js', './Solution.js');

/**
 * Basic DE algorithm (DE/rand/1)
 */
function DiferentialEvolution() {
    this.NP = null; //the number of colony size
    this.CR = null;
    this.F = null;
    this.maxNumOfFunctionEval = null;
    this.objFunc = null;
    this.upperBound = null;
    this.lowerBound = null;
    this.dimension = null;
    this.solutions = null;
    this.globalBest = null;
}
;

DiferentialEvolution.prototype.init = function (parameters) {
    this.NP = parameters.NP;
    this.F = parameters.F;
    this.CR = parameters.CR;
    this.maxNumOfFunctionEval = parameters.maxNumOfFunctionEval;
    this.objFunc = parameters.objFunc;
    this.upperBound = parameters.upperBound;
    this.lowerBound = parameters.lowerBound;
    this.dimension = parameters.dimension;
    this.solutions = [];
};

DiferentialEvolution.prototype.solve = function () {
    var numOfFunctionEval = 0;
    var i, rA, rB, rC, R, rI, min = Number.MAX_VALUE, minIndex = 0;;
    var a = [], b = [], c = [], y = [], x = [];

    //initialization step
    for (i = 0; i < this.NP; i++) {
        var randPos = createRandomPosition(this.lowerBound, this.upperBound, this.dimension);
        var randF = this.objFunc(randPos);
        this.solutions[i] = new Solution(randPos, randF); //create random solution

        if (randF < min) {
            min = randF;
            minIndex = i;
        }
    }
    this.globalBest = new Solution(this.solutions[minIndex].position.slice(0), min);

    while (numOfFunctionEval + this.NP <= this.maxNumOfFunctionEval) {
        for (i = 0; i < this.NP; i++) {
            //Pick three agents a, b and c from the population at random
            do {
                rA = Math.floor((Math.random() * this.NP));
            } while (rA == i);

            a = this.solutions[rA].position;

            do {
                rB = Math.floor((Math.random() * this.NP));
            } while (rB == i || rB == rA);

            b = this.solutions[rB].position;

            do {
                rC = Math.floor((Math.random() * this.NP));
            } while (rC == i || rC == rA || rC == rB);

            c = this.solutions[rC].position;

            R = Math.floor((Math.random() * this.dimension)); //Pick a random dimension index R 

            x = this.solutions[i].position; // current solution

            y = x.slice(0);
            for (var j = 0; j < this.dimension; j++) {
                rI = Math.random();
                if (rI < this.CR || j == R) {
                    y[j] = a[j] + this.F * (b[j] - c[j]);
                    if (y[j] < this.lowerBound) {//fix boundary
                        y[j] = this.lowerBound;
                    } else if (y[j] > this.upperBound) {
                        y[j] = this.upperBound;
                    }
                } else {
                    y[j] = x[j];
                }
            }

            var fy = this.objFunc(y);
            if (fy < this.solutions[i].fitness) {
                this.solutions[i].position = y.slice(0);
                this.solutions[i].fitness = fy;

                if (fy < this.globalBest.fitness) {
                    this.globalBest.solution = y.slice(0);
                    this.globalBest.fitness = fy;
                    postMessage("Best: " + this.globalBest.position + " Fitness: " + this.globalBest.fitness);
                }
            }

            numOfFunctionEval += this.NP;
        }
    }
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

    var de = new DiferentialEvolution();
    de.init(parameters);
    de.solve();
};
