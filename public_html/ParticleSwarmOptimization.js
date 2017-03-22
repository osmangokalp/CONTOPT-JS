"use strict";

importScripts('./BenchmarkFunctions.js', './Solution.js');

function ParticleSwarmOptimization() {
    this.omega = null;
    this.phi_p = null;
    this.phi_g = null;
    this.swarmSize = null;
    this.maxNumOfFunctionEval = null;
    this.objFunc = null;
    this.upperBound = null;
    this.lowerBound = null;
    this.dimension = null;
    this.swarm = null;
    this.globalBest = null;
}
;

ParticleSwarmOptimization.prototype.init = function (parameters) {
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

//    console.log("this.omega: " + this.omega);
//    console.log("this.phi_p: " + this.phi_p);
//    console.log("this.phi_g: " + this.phi_g);
//    console.log("this.populationSize: " + this.populationSize);
//    console.log("this.maxNumOfFunctionEval: " + this.maxNumOfFunctionEval);
//    console.log("this.objFunc: " + this.objFunc);
//    console.log("this.upperBound: " + this.upperBound);
//    console.log("this.lowerBound: " + this.lowerBound);
//    console.log("this.dimension: " + this.dimension);

    //create initial population
    var i, d, randomPos, randomVelocity = [], f_i;
    for (i = 0; i < this.swarmSize; i++) {
        randomPos = createRandomPosition(this.lowerBound, this.upperBound, this.dimension);
        for (d = 0; d < this.dimension; d++) {
            randomVelocity[d] = Math.random() * (this.upperBound - this.lowerBound);
            randomVelocity[d] *= Math.random() > 0.5 ? -1 : 1; //U(-|bup-blo|, |bup-blo|)
        }
        f_i = this.objFunc(randomPos);
        this.swarm[i] = new Particle(randomPos, f_i, randomVelocity.slice(0));

        //update globalBest if there is better fitness
        if (i == 0 || f_i < this.globalBest.fitness) {
            this.globalBest = new Solution(randomPos.slice(0), f_i);
        }
    }

};

ParticleSwarmOptimization.prototype.solve = function () {
    var numOfFunctionEval = 0, i, d, r_p, r_g, particle;

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
            //update the particle's fitness
            particle.fitness = this.objFunc(particle.position);
            
            if (particle.fitness < particle.bestFitness) {
                //update the particle's best known position
                particle.bestPosition = particle.position.slice(0);
                particle.bestFitness = particle.fitness;
                
                if (particle.bestFitness < this.globalBest.fitness) {
                    //update the swarm's best known position
                    this.globalBest.position = particle.bestPosition.slice(0);
                    this.globalBest.fitness = particle.bestFitness;
                    postMessage("Best: " + this.globalBest.position + " Fitness: " + this.globalBest.fitness);
                }
            }
        }
        numOfFunctionEval += this.swarmSize;
    }
};

onmessage = function (e) {
    var func;
    switch (e.data[5]) {
        case "sphere":
            func = sphere;
            break;
        default:
            func = null;
    }

    var parameters = {
        "omega": e.data[0],
        "phi_p": e.data[1],
        "phi_g": e.data[2],
        "swarmSize": e.data[3],
        "maxNumOfFunctionEval": e.data[4],
        "objFunc": func,
        "upperBound": e.data[6],
        "lowerBound": e.data[7],
        "dimension": e.data[8]
    };

    var pso = new ParticleSwarmOptimization();
    pso.init(parameters);
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