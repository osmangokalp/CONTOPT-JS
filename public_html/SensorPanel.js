"use strict";

function SensorPanel(sensorDeploymentProblem) {
    this.sensorDeploymentProblem = sensorDeploymentProblem;
    this.canvas = document.createElement("canvas");
    this.context = null;
}
;

SensorPanel.prototype.start = function () {
    this.canvas.width = this.sensorDeploymentProblem.getAreaWidth();
    this.canvas.height = this.sensorDeploymentProblem.getAreaHeight();
    this.canvas.style = "border:1px solid #c3c3c3;background-color: #f1f1f1;";
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.repaint();
};

SensorPanel.prototype.clear = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

SensorPanel.prototype.repaint = function () {
    this.clear();
    
    var sensorsArray = this.sensorDeploymentProblem.getSensorsArray();
    var radius = this.sensorDeploymentProblem.getRadius();
    var numOfSensors = this.sensorDeploymentProblem.getNumOfSensors();
    var numOfPoints =  this.sensorDeploymentProblem.getNumOfPoints();
    
    for (var i = 0; i < numOfSensors; i++) {
        var posX = sensorsArray[2*i];
        var posY = sensorsArray[2*i + 1];
        
        this.context.beginPath();
        this.context.arc(posX, posY, radius, 0, 2 * Math.PI);
        this.context.fillStyle = 'rgba(0, 0, 255, 0.3)';
        this.context.fill();
    }
    
    var pointsArray = this.sensorDeploymentProblem.getPointsArray();
    
    for (var i = 0; i < numOfPoints; i++) {
        var posX = pointsArray[2*i];
        var posY = pointsArray[2*i+1];
        
        this.context.beginPath();
        this.context.arc(posX, posY, radius / 28, 0, 2 * Math.PI);
        this.context.fillStyle = 'rgba(255, 0, 0, 0.3)';
        this.context.fill();
    }
};

SensorPanel.prototype.setSensorDeploymentProblem = function(prob) {
    this.sensorDeploymentProblem = prob;
    this.repaint();
};