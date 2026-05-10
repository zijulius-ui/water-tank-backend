const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema({
    tankId: {
        type: String,
        required: true
    },
    waterLevel: {
        type: Number,
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    pressure: {
        type: Number,
        required: true
    },
    humidity: {
        type: Number,
        required: true
    },
    leakDetected: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("SensorData", sensorDataSchema);