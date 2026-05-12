import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema(
  {
    waterLevel: Number,
    temperature: Number,
    humidity: Number,
    turbidity: Number,   
    leakDetected: Boolean,
  },
  { timestamps: true }
);

const SensorData = mongoose.model("SensorData", sensorSchema);

export default SensorData;