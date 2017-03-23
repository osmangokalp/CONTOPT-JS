"use strict";

importScripts('./BenchmarkFunctions.js', './Solution.js');

/**
 * Basic ABC algorithm.
 * Adapted from java code at http://mf.erciyes.edu.tr/abc/form.aspx
 */
function ArtificialBeeColony() {
    this.NP = null; //the number of colony size (employed bees+onlooker bees)
    this.foodNumber = null; //The number of foods
    this.limit = null;
    this.maxNumOfFunctionEval = null;
    this.objFunc = null;
    this.upperBound = null;
    this.lowerBound = null;
    this.dimension = null;
    this.foods = null;
    this.trial = null;
    this.globalBest = null;
}
;

ArtificialBeeColony.prototype.init = function (parameters) {
    this.NP = parameters.NP;
    this.limit = parameters.limit;
    this.maxNumOfFunctionEval = parameters.maxNumOfFunctionEval;
    this.objFunc = parameters.objFunc;
    this.upperBound = parameters.upperBound;
    this.lowerBound = parameters.lowerBound;
    this.dimension = parameters.dimension;
    this.foodNumber = this.NP / 2;
    this.foods = [];
    this.trial = [];
};

ArtificialBeeColony.prototype.solve = function () {
    var numOfFunctionEval = 0;
    var i, j, t, min = Number.MAX_VALUE, minIndex = 0;
    var param2change, neighborIndex, neighborPos, newPos, curPos, newF;

    //initialization step
    for (i = 0; i < this.foodNumber; i++) {
        var randPos = createRandomPosition(this.lowerBound, this.upperBound, this.dimension);
        var randF = this.objFunc(randPos);
        this.foods[i] = new Solution(randPos, randF); //create random solution
        this.trial[i] = 0; //init the trial number

        if (randF < min) {
            min = randF;
            minIndex = i;
        }
    }
    this.globalBest = new Solution(this.foods[minIndex].position.slice(0), min);

    while (numOfFunctionEval + this.NP <= this.maxNumOfFunctionEval) {
        //send employee bees
        for (i = 0; i < this.foodNumber; i++) {
            param2change = Math.floor((Math.random() * this.dimension));
            do {
                neighborIndex = Math.floor((Math.random() * this.foodNumber));
            } while (neighborIndex === i); //neighborIndex must be different from i

            curPos = this.foods[i].position;
            neighborPos = this.foods[neighborIndex].position;
            newPos = curPos.slice(0);
            newPos[param2change] = curPos[param2change] + (curPos[param2change] - neighborPos[param2change]) * (Math.random() - 0.5) * 2;

            if (newPos[param2change] < this.lowerBound) { //ensure that new position is within limits 
                newPos[param2change] = this.lowerBound;
            } else if (newPos[param2change] > this.upperBound) {
                newPos[param2change] = this.upperBound;
            }

            newF = this.objFunc(newPos);

            if (newF <= this.foods[i].fitness) { //if the mutant solution is better than the original
                this.trial[i] = 0; //rest trial number
                this.foods[i].position = newPos.slice(0);
                this.foods[i].fitness = newF;

                if (newF <= this.globalBest.fitness) { //update if new global best found
                    this.globalBest.position = newPos.slice(0);
                    this.globalBest.fitness = newF;
                    postMessage("Best: " + this.globalBest.position + " Fitness: " + this.globalBest.fitness);
                }
            } else {
                this.trial[i]++; //increase the trial number of ith food source
            }
        }

        //calculate probabilities
        var totalFitness = 0, prob = [];
        for (i = 0; i < this.foodNumber; i++) {
            totalFitness += this.foods[i].fitness;
        }
        for (i = 0; i < this.foodNumber; i++) {
            prob[i] = this.foods[i].fitness / totalFitness; //normalized probabilities;
        }

        //send onlooker bees
        i = 0;
        t = 0;
        while (t < this.foodNumber) {
            var r = Math.random();

            if (r < prob[i]) {
                t++;

                param2change = Math.floor((Math.random() * this.dimension));

                do {
                    neighborIndex = Math.floor((Math.random() * this.foodNumber));
                } while (neighborIndex === i); //neighborIndex must be different from i

                curPos = this.foods[i].position;
                neighborPos = this.foods[neighborIndex].position;
                newPos = curPos.slice(0);
                newPos[param2change] = curPos[param2change] + (curPos[param2change] - neighborPos[param2change]) * (Math.random() - 0.5) * 2;

                if (newPos[param2change] < this.lowerBound) { //ensure that new position is within limits 
                    newPos[param2change] = this.lowerBound;
                } else if (newPos[param2change] > this.upperBound) {
                    newPos[param2change] = this.upperBound;
                }

                newF = this.objFunc(newPos);

                if (newF <= this.foods[i].fitness) { //if the mutant solution is better than the original
                    this.trial[i] = 0; //rest trial number
                    this.foods[i].position = newPos.slice(0);
                    this.foods[i].fitness = newF;

                    if (newF <= this.globalBest.fitness) { //update if new global best found
                        this.globalBest.position = newPos.slice(0);
                        this.globalBest.fitness = newF;
                        postMessage("Best: " + this.globalBest.position + " Fitness: " + this.globalBest.fitness);
                    }
                } else {
                    this.trial[i]++; //increase the trial number of ith food source
                }
            }
            i++;
            if (i === this.foodNumber) {
                i = 0;
            }
        }

        //send scout bees
        var maxtrialindex = 0;
        for (i = 1; i < this.foodNumber; i++) {
            if (this.trial[i] > this.trial[maxtrialindex]) {
                maxtrialindex = i;
            }
        }

        if (this.trial[maxtrialindex] >= this.limit)
        {
            var randPos = createRandomPosition(this.lowerBound, this.upperBound, this.dimension);
            var randF = this.objFunc(randPos);
            this.foods[maxtrialindex] = new Solution(randPos, randF); //create random solution
            this.trial[maxtrialindex] = 0; //init the trial number
        }

        numOfFunctionEval += this.NP;
    }
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
        "NP": e.data[0],
        "limit": e.data[1],
        "maxNumOfFunctionEval": e.data[2],
        "objFunc": func,
        "upperBound": e.data[4],
        "lowerBound": e.data[5],
        "dimension": e.data[6]
    };

    var abc = new ArtificialBeeColony();
    abc.init(parameters);
    abc.solve();
};