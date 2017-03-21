"use strict";

/**
 * 
 * https://en.wikipedia.org/wiki/Marsaglia_polar_method
 */
function MarsagliaPolar() {
    this.hasSpare = false;
    this.spare;
};

MarsagliaPolar.prototype.generateRandom = function(mean, stdDev) {
    if (this.hasSpare)
    {
        this.hasSpare = false;
        return mean + stdDev * this.spare;
    }

    this.hasSpare = true;
    var u, v, s;
    do {
        u = Math.random() * 2.0 - 1.0;
        v = Math.random() * 2.0 - 1.0;
        s = u * u + v * v;
    } while( (s >= 1.0) || (s == 0.0) );
    
    s = Math.sqrt(-2.0 * Math.log(s) / s);
    this.spare = v * s;
    return mean + stdDev * u * s;
};


