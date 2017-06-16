(function () {
    SensorProblem = function (nSensors, radius, areaWidth, areaHeight, points) {
         this.nSensors = nSensors;
         this.radius = radius;
         this.areaWidth = areaWidth;
         this.areaHeight = areaHeight;
         this.points = points;
    };

    var privateMethod = function (x) {
        
    };

    SensorProblem.prototype.calculateCoverage = function (num) {
        var i, j;
        for (i = 0; i < this.points.length; i++) {
            var covered = false;
            for (j = 0; j < this.nSensors; j++) {
                if (points[i])
            }
        }
    };

}());
