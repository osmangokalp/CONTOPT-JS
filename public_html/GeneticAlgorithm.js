"use strict";

importScripts('./ContinuousOptimizer.js');

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
    
    var popsize = this.NP; //population size
    var mutrate = this.mutrate; //mutation rate
    var selection = this.selection; //fraction of population kept
    var Nt = this.dimension; //#variables
    var keep = Math.floor(selection * this.NP); //#population members that survive
    var nmut = Math.ceil((popsize - 1) * Nt * mutrate); //total number of mutations
    var M = Math.ceil( (popsize - keep) / 2); //number of matings

    this.createInitialPopulation();
    this.quicksortSolutions(0, this.solutions.length - 1);
    
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

    while (numOfFunctionEval + this.NP <= this.maxFEs) {
        M = Math.ceil( (popsize - keep) / 2);
        
        //find pairs
        var ma = [], pa = [];
        var ic = 0;
        while (ic < M) {
            var pick1 = Math.random();
            var pick2 = Math.random();
            for (var id = 1; id < keep; id++) {
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
        
    }
};

//modified from: http://www.vogella.com/tutorials/JavaAlgorithmsQuicksort/article.html#quicksort
GeneticAlgorithm.prototype.quicksortSolutions = function (low, high) {

    var i = low, j = high;
    // Get the pivot element from the middle of the list
    var pivot = this.solutions[low + (high - low) / 2].fitness;

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