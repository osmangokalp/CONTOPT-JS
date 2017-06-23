"use strict";

importScripts('./BenchmarkFunctions.js', './Solution.js');

function ParticleSwarmOptimization(parameters) {
    this.omega = parameters.omega;
    this.phi_p = parameters.phi_p;
    this.phi_g = parameters.phi_g;
    this.swarmSize = parameters.swarmSize;
    this.maxNumOfFunctionEval = parameters.maxNumOfFunctionEval;
    this.objFunc = parameters.objFunc;
    this.upperBound = parameters.upperBound;
    this.lowerBound = parameters.lowerBound;
    this.dimension = parameters.dimension;
    this.swarm = [];
    
    this.globalBest = null;
}
;

ParticleSwarmOptimization.prototype.createInitialPopulation = function () {
    //create initial population
    var i, d, randomPos, randomVelocity = [], f_i;
    for (i = 0; i < this.swarmSize; i++) {
        randomPos = createRandomPosition(this.lowerBound, this.upperBound, this.dimension);
        for (d = 0; d < this.dimension; d++) {
            randomVelocity[d] = Math.random() * (this.upperBound - this.lowerBound);
            randomVelocity[d] *= Math.random() > 0.5 ? -1 : 1; //U(-|bup-blo|, |bup-blo|)
        }
        f_i = this.calculateObjValue(randomPos);
        this.swarm[i] = new Particle(randomPos, f_i, randomVelocity.slice(0));

        //update globalBest if there is better fitness
        if (i == 0 || f_i < this.globalBest.fitness) {
            this.globalBest = new Solution(randomPos.slice(0), f_i);
        }
    }

};

ParticleSwarmOptimization.prototype.calculateObjValue = function (array) {
    return this.objFunc(array);
};

ParticleSwarmOptimization.prototype.solve = function () {
    var numOfFunctionEval = 0, i, d, r_p, r_g, particle;

    this.createInitialPopulation();

    while (numOfFunctionEval + this.swarmSize <= this.maxNumOfFunctionEval) {
        for (i = 0; i < this.swarmSize; i++) {
            particle = this.swarm[i]; //get the next particle
            for (d = 0; d < this.dimension; d++) {
                //pick random numbers
                r_p = Math.random();
                r_g = Math.random();

                //update the particle's velocity
                particle.velocity[d] = this.omega * particle.velocity[d]
                        + this.phi_p * r_p * (particle.bestPosition[d] - particle.position[d])
                        + this.phi_g * r_g * (this.globalBest.position[d] - particle.position[d]);
            }
            //update the particle's position
            for (d = 0; d < this.dimension; d++) {
                particle.position[d] += particle.velocity[d];
            }
            
            particle.position = this.fixBoundary(particle.position);
            
            //update the particle's fitness
            particle.fitness = this.calculateObjValue(particle.position);
            
            if (particle.fitness < particle.bestFitness) {
                //update the particle's best known position
                particle.bestPosition = particle.position.slice(0);
                particle.bestFitness = particle.fitness;
                
                if (particle.bestFitness < this.globalBest.fitness) {
                    //update the swarm's best known position
                    this.globalBest.position = particle.bestPosition.slice(0);
                    this.globalBest.fitness = particle.bestFitness;
                    postMessage([numOfFunctionEval, this.globalBest.fitness, this.globalBest.position]);
                }
            }
        }
        numOfFunctionEval += this.swarmSize;
    }
    postMessage([numOfFunctionEval, this.globalBest.fitness, this.globalBest.position]);
};

ParticleSwarmOptimization.prototype.fixBoundary = function (array) {
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
    switch (e.data[5]) {
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
        "swarmSize": e.data[0],
        "omega": e.data[1],
        "phi_p": e.data[2],
        "phi_g": e.data[3],
        "maxNumOfFunctionEval": e.data[4],
        "objFunc": func,
        "upperBound": e.data[6],
        "lowerBound": e.data[7],
        "dimension": e.data[8]
    };

    var pso = new ParticleSwarmOptimization(parameters);
    pso.solve();
};


function Particle(position, fitness, velocity) {
    Solution.call(this, position, fitness);
    this.velocity = velocity;

    //set particle's best known position to its initial position
    this.bestPosition = position.slice(0);
    this.bestFitness = fitness;
}
;
Particle.prototype = Object.create(Solution.prototype);
Particle.prototype.constructor = Particle;