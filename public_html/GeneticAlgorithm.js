"use strict";

importScripts('./ContinuousOptimizer.js');

//Adapted from: "Haupt, R. L., & Haupt, S. E. (2004). Practical genetic algorithms. John Wiley & Sons."
function GeneticAlgorithm(parameters) {
    ContinuousOptimizer.call(this, parameters);
    this.mutrate = parameters.mutrate;
    this.selection = parameters.selection;
    this.solutions = [];
}
;

GeneticAlgorithm.prototype = Object.create(ContinuousOptimizer.prototype);
GeneticAlgorithm.prototype.constructor = ContinuousOptimizer;

GeneticAlgorithm.prototype.solve = function () {
    var numOfFunctionEval = 0;
    if(this.NP % 2 != 0) {
        this.NP ++;
    }
    var popsize = this.NP; //population size
    var mutrate = this.mutrate; //mutation rate
    var selection = this.selection; //fraction of population kept
    var Nt = this.dimension; //#variables
    var keep = Math.floor(selection * popsize); //#population members that survive
    if (keep % 2 != 0) {
        keep ++;
    }
    var nmut = Math.ceil((popsize - 1) * Nt * mutrate); //total number of mutations
    var M = Math.ceil( (popsize - keep) / 2); //number of matings

    this.createInitialPopulation();
    this.quicksortSolutions(0, popsize - 1);
    
    var sum = keep * (keep + 1) / 2; //sum of ranks
    var prob = [];
    for (var i = keep; i > 0; i--) {
        prob[keep - i] = i / sum;
    }
    
    var odds = [];
    odds[0] = 0;
    for (var i = 1; i <= keep; i++) {
        odds[i] = odds[i-1] + prob[i-1];
    }

    while (numOfFunctionEval < this.maxFEs) {
                
        //find pairs
        var ma = [], pa = [];
        var ic = 0;
        while (ic < M) {
            var pick1 = Math.random();
            var pick2 = Math.random();
            for (var id = 1; id <= keep; id++) {
                if (pick1 <= odds[id] && pick1 > odds[id - 1] ) {
                    ma[ic] = id-1;
                }
                if (pick2 <= odds[id] && pick2 > odds[id - 1] ) {
                    pa[ic] = id-1;
                }
            }

            ic++;
        }
        
        //mate using single point crossover
        var ix = []; //index of mate#1
        for (var i = 0; i < M; i++) {
            ix[i] = 2*i;
        }
        
        var xp = []; //crossover point
        for (var i = 0; i < M; i++) {
            xp[i] = Math.floor(Math.random() * Nt);
        }
        
        var r = []; //mixing parameter
        for (var i = 0; i < M; i++) {
            r[i] = Math.random();
        }
        
        for (ic = 0; ic < M; ic++) {
            var xy = this.solutions[ma[ic]].position[xp[ic]] - this.solutions[pa[ic]].position[xp[ic]]; //ma and pa mate
            this.solutions[keep + ix[ic]].position = this.solutions[ma[ic]].position.slice(); //1st offspring
            this.solutions[keep + ix[ic] + 1].position = this.solutions[pa[ic]].position.slice(); //2nd offspring
            this.solutions[keep + ix[ic]].position[xp[ic]] = this.solutions[pa[ic]].position[xp[ic]] - r[ic] * xy; //1st
            this.solutions[keep + ix[ic] + 1].position[xp[ic]] = this.solutions[pa[ic]].position[xp[ic]] + r[ic] * xy; //2nd
            
            if(xp[ic] < Nt - 1) { //crossover when last variable not selected
                for (var i = xp[ic] + 1; i < Nt; i++) {
                    this.solutions[keep + ix[ic]].position[i] = this.solutions[keep + ix[ic] + 1].position[i];
                    this.solutions[keep + ix[ic] + 1].position[i] = this.solutions[keep + ix[ic]].position[i];
                }
            }
        }
        
        //mutate the population
        for (var i = 0; i < nmut; i++) {
            this.solutions[Math.floor(Math.random() * popsize)].position[Math.floor(Math.random() * Nt)] = this.lowerBound + Math.random() * (this.upperBound - this.lowerBound);
        }
        
        // The new offspring and mutated chromosomes are evaluated
        for (var i = keep; i < popsize; i++) {
            this.solutions[i].fitness = this.calculateObjValue(this.solutions[i].position);
            numOfFunctionEval++;
        }
        
        //Sort the population
        this.quicksortSolutions(0, popsize - 1);
        if (this.solutions[0].fitness < this.globalBest.fitness) {
            this.globalBest.position = this.solutions[0].position.slice();
            this.globalBest.fitness = this.solutions[0].fitness;
            postMessage([numOfFunctionEval, this.globalBest.fitness, this.globalBest.position]);
        }
    }
    postMessage([numOfFunctionEval, this.globalBest.fitness, this.globalBest.position]);
};

GeneticAlgorithm.prototype.createInitialPopulation = function () {
    var i, min = Number.MAX_VALUE, minIndex = 0;;
    //initialization step
    for (var i = 0; i < this.NP; i++) {
        var randPos = this.createRandomPosition(this.lowerBound, this.upperBound, this.dimension);
        var randF = this.calculateObjValue(randPos);
        this.solutions[i] = new Solution(randPos, randF); //create random solution

        if (randF < min) {
            min = randF;
            minIndex = i;
        }
    }
    this.globalBest = new Solution(this.solutions[minIndex].position.slice(0), min);
};

//modified from: http://www.vogella.com/tutorials/JavaAlgorithmsQuicksort/article.html#quicksort
GeneticAlgorithm.prototype.quicksortSolutions = function (low, high) {
    var i = low, j = high;
    // Get the pivot element from the middle of the list
    var pivot = this.solutions[Math.floor(low + (high - low) / 2)].fitness;

    // Divide into two lists
    while (i <= j) {
        // If the current value from the left list is smaller than the pivot
        // element then get the next element from the left list
        while (this.solutions[i].fitness < pivot) {
            i++;
        }
        // If the current value from the right list is larger than the pivot
        // element then get the next element from the right list
        while (this.solutions[j].fitness > pivot) {
            j--;
        }

        // If we have found a value in the left list which is larger than
        // the pivot element and if we have found a value in the right list
        // which is smaller than the pivot element then we exchange the
        // values.
        // As we are done we can increase i and j
        if (i <= j) {
            this.quicksortExchange(i, j);
            i++;
            j--;
        }
    }
    // Recursion
    if (low < j) {
        this.quicksortSolutions(low, j);
    }
    if (i < high) {
        this.quicksortSolutions(i, high);
    }
};

GeneticAlgorithm.prototype.quicksortExchange = function (i, j) {
    var temp = this.solutions[i];
    this.solutions[i] = this.solutions[j];
    this.solutions[j] = temp;
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
        "NP": e.data[0],
        "mutrate": e.data[1],
        "selection": e.data[2],
        "maxFEs": e.data[3],
        "objFunc": func,
        "upperBound": e.data[5],
        "lowerBound": e.data[6],
        "dimension": e.data[7]
    };

    var ga = new GeneticAlgorithm(parameters);
    ga.solve();
};
