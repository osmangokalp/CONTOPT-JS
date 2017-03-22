function sphere(arr) {
    var arrLength = arr.length;
    var total = 0.0;

    for (i = 0; i < arrLength; i++) {
        total += arr[i] * arr[i];
    }

    return total;
}