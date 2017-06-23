"use strict";

importScripts('./BenchmarkFunctions.js', './Solution.js');

/**
 * Basic ABC algorithm.
 * Adapted from java code at http://mf.erciyes.edu.tr/abc/form.aspx
 */
function ArtificialBeeColony(parameters) {
    this.NP = parameters.NP; //the number of colony size (employed bees+onlooker bees)
    this.limit = parameters.limit;
    this.maxNumOfFunctionEval = parameters.maxNumOfFunctionEval;
    this.objFunc = parameters.objFunc;
    this.upperBound = parameters.upperBound;
    this.lowerBound = parameters.lowerBound;
    this.dimension = parameters.dimension;
    this.foodNumber = this.NP / 2;
    this.foods = [];
    this.trial = [];
    this.globalBest = null;
}
;

ArtificialBeeColony.prototype.solve = function () {
    var numOfFunctionEval = 0;
    var i, j, t, min = Number.MAX_VALUE, minIndex = 0;
    var param2change, neighborIndex, neighborPos, newPos, curPos, newF;

    this.createInitialPopulation();

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

            newPos = this.fixBoundary(newPos);

            newF = this.calculateObjValue(newPos);

            if (newF <= this.foods[i].fitness) { //if the mutant solution is better than the original
                this.trial[i] = 0; //rest trial number
                this.foods[i].position = newPos.slice(0);
                this.foods[i].fitness = newF;
            } else {
                this.trial[i]++; //increase the trial number of ith food source
            }
        }

        //calculate probabilities
        var transformedFitness = [];
        for (i = 0; i < this.foodNumber; i++) {
            if (this.foods[i].fitness >= 0) {
                transformedFitness[i] = 1 / (this.foods[i].fitness + 1);
            } else {
                transformedFitness[i] = 1 + Math.abs(this.foods[i].fitness);
            }
        }

        var maxfit = transformedFitness[0];
        for (i = 1; i < this.foodNumber; i++)
        {
            if (transformedFitness[i] > maxfit) {
                maxfit = transformedFitness[i];
            }
        }

        var prob = [];
        for (i = 0; i < this.foodNumber; i++)
        {
            prob[i] = (0.9 * (transformedFitness[i] / maxfit)) + 0.1;
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

                newPos = this.fixBoundary(newPos);

                newF = this.calculateObjValue(newPos);

                if (newF <= this.foods[i].fitness) { //if the mutant solution is better than the original
                    this.trial[i] = 0; //rest trial number
                    this.foods[i].position = newPos.slice(0);
                    this.foods[i].fitness = newF;
                } else {
                    this.trial[i]++; //increase the trial number of ith food source
                }
            }
            i++;
            if (i === this.foodNumber) {
                i = 0;
            }
        }

        //Memorize best
        min = this.foods[0].fitness;
        minIndex = 0;
        for (i = 1; i < this.foodNumber; i++) {
            if (this.foods[i].fitness < min) {
                min = this.foods[i].fitness;
                minIndex = i;
            }
        }
        if (min < this.globalBest.fitness) {
            this.globalBest.position = this.foods[minIndex].position.slice(0);
            this.globalBest.fitness = min;
            postMessage([this.globalBest.position, this.globalBest.fitness]);
        }

        numOfFunctionEval += this.NP;

        //send scout bees
        var maxtrialindex = 0;
        for (i = 1; i < this.foodNumber; i++) {
            if (this.trial[i] > this.trial[maxtrialindex]) {
                maxtrialindex = i;
            }
        }

        if (this.trial[maxtrialindex] >= this.limit)
        {
            var randPos = this.createRandomSolution(this.lowerBound, this.upperBound, this.dimension);
            var randF = this.calculateObjValue(randPos);
            numOfFunctionEval++;
            if (numOfFunctionEval >= this.maxNumOfFunctionEval) {
                break;
            }
            this.foods[maxtrialindex] = new Solution(randPos, randF); //create random solution
            this.trial[maxtrialindex] = 0; //init the trial number
        }
    }
};

ArtificialBeeColony.prototype.calculateObjValue = function (array) {
    return this.objFunc(array);
};

ArtificialBeeColony.prototype.createRandomSolution = function () {
    var randPos = createRandomPosition(this.lowerBound, this.upperBound, this.dimension);
    return randPos;
};

ArtificialBeeColony.prototype.createInitialPopulation = function () {
    var i, min = Number.MAX_VALUE, minIndex = 0;
    //initialization step
    for (i = 0; i < this.foodNumber; i++) {
        var randPos = createRandomPosition(this.lowerBound, this.upperBound, this.dimension);
        var randF = this.calculateObjValue(randPos);
        this.foods[i] = new Solution(randPos, randF); //create random solution
        this.trial[i] = 0; //init the trial number

        if (randF < min) {
            min = randF;
            minIndex = i;
        }
    }
    this.globalBest = new Solution(this.foods[minIndex].position.slice(0), min);
};

ArtificialBeeColony.prototype.fixBoundary = function (array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] > this.upperBound) {
            array[i] = this.upperBound;
        } else if (array[i] < this.lowerBound) {
            array[i] = this.lowerBound;
        }
    }

    return array;
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
        "NP": e.data[0],
        "limit": e.data[1],
        "maxNumOfFunctionEval": e.data[2],
        "objFunc": func,
        "upperBound": e.data[4],
        "lowerBound": e.data[5],
        "dimension": e.data[6]
    };

    var abc = new ArtificialBeeColony(parameters);
    abc.solve();
};