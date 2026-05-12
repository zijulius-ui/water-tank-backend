import { sendLeakEmail } from "../utils/sendEmail.js";

app.post("/api/sensors", async (req, res) => {
    try {
        const newReading = new SensorData(req.body);
        await newReading.save();

        res.status(201).json({
            message: "Sensor data saved successfully",
            data: newReading
        });

    } catch (error) {
        res.status(500).json({
            message: "Error saving sensor data",
            error: error.message
        });
    }
});


app.get("/api/sensors", async (req, res) => {
    try {
        const data = await SensorData.find().sort({ createdAt: -1 });

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching sensor data",
            error: error.message
        });
    }
});

app.get("/api/sensors/latest", async (req, res) => {
    try {
        const latest = await SensorData.findOne().sort({ createdAt: -1 });

        res.json(latest);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});