import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema(
  {
    tankId: String,
    waterLevel: Number,
    temperature: Number,
    humidity: Number,
    leakDetected: Boolean
  },
  { timestamps: true }
);

const SensorData = mongoose.model("SensorData", sensorSchema);

export default SensorData;