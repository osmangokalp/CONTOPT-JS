var INF = 1.0e99;
var EPS = 1.0e-14;
var E = 2.7182818284590452353602874713526625;
var PI = 3.1415926535897932384626433832795029;

function sphere(arr) {
    var arrLength = arr.length;
    var total = 0.0;
    for (i = 0; i < arrLength; i++) {
        total += arr[i] * arr[i];
    }

    return total;
}

function schwefel2_22(arr) {
    var total1 = 0.0, total2 = 1.0;
    for (var i = 0; i < arr.length; i++) {
        total1 += Math.abs(arr[i]);
        total2 *= Math.abs(arr[i]);
    }
    return total1 + total2;
}

function schwefel1_2(arr) {
    var total = 0.0;

    for (var i = 0; i < arr.length; i++) {
        var total2 = 0.0;
        for (var j = 0; j < i; j++) {
            total2 += arr[j];
        }
        total += Math.pow(total2, 2);
    }
    return total;
}

function schwefel2_21(arr) {
    var max = 0.0;

    for (var i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }

    return max;
}

function rosenbrock(arr) {
    var total = 0.0;

    for (var i = 0; i < arr.length - 1; i++) {
        total += 100.0 * Math.pow(arr[i + 1] - Math.pow(arr[i], 2), 2) + Math.pow(arr[i] - 1, 2);
    }

    return total;
}

function step(arr) {
    var total = 0.0;

    for (var i = 0; i < arr.length; i++) {
        total += Math.pow(Math.floor(arr[i] + 0.5), 2);
    }

    return total;
}

function quarticWithNoise(arr) {
    var total = 0.0;

    for (var i = 0; i < arr.length; i++) {
        total += (((i + 1)) * Math.pow(arr[i], 4));
    }

    total += Math.random();
    return total;
}

function schwefel2_26(arr) {
    var total = 0.0;

    for (var i = 0; i < arr.length; i++) {
        total += (arr[i] * Math.sin(Math.sqrt(Math.abs(arr[i]))));
    }

    return -total;
}

function rastrigin(arr) {
    var total = 0.0;

    for (var i = 0; i < arr.length; i++) {
        total += (Math.pow(arr[i], 2) - (10.0 * Math.cos(2.0 * PI * arr[i])) + 10.0);
    }

    return total;
}

function ackley(arr) {
    var total1 = 0.0;
    var total2 = 0.0;

    for (var i = 0; i < arr.length; i++) {
        total1 += Math.pow(arr[i], 2);
        total2 += (Math.cos(2.0 * PI * arr[i]));
    }

    return (-20.0 * Math.exp(-0.2 * Math.sqrt(total1 / (arr.length)))
            - Math.exp(total2 / (arr.length)) + 20.0 + E);
}

function griewank(arr) {
    var total1 = 0.0;
    var total2 = 1.0;

    for (var i = 0; i < arr.length; i++) {
        total1 += Math.pow(arr[i], 2);
        total2 *= Math.cos(arr[i] / Math.sqrt(i + 1));
    }

    return (1.0 / 4000.0) * total1 - total2 + 1;
}

function penalized(arr) {
    var total1 = 0.0;
    var total2 = 0.0;
    var y1 = 1.0 + (arr[0] + 1.0) / 4.0;
    var yn = 1.0 + (arr[arr.length - 1] + 1.0) / 4.0;
    for (var i = 0; i < arr.length - 1; i++) {
        var yi = 1.0 + (arr[i] + 1.0) / 4.0;
        var yi1 = 1.0 + (arr[i + 1] + 1.0) / 4.0;
        total1 += Math.pow(yi - 1, 2) * (1.0 + 10.0 * Math.pow(Math.sin(PI * yi1), 2));
        total2 += u(arr[i], 10, 100, 4);
    }

    total2 += u(arr[arr.length - 1], 10, 100, 4); //for the last i

    return (PI / 30.0) * (10 * Math.pow(Math.sin(PI * y1), 2) + total1 + Math.pow(yn - 1, 2)) + total2;
}

function u(xi, a, k, m) {
    if (xi > a) {
        return k * Math.pow(xi - a, m);
    }

    if (xi >= -a && xi <= a) {
        return 0;
    }

    if (xi < -a) {
        return k * Math.pow(-xi - a, m);
    }

    return null;
}
