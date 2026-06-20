import express from "express";
import cors from "cors";
import imgRoutes from './routes/imgRoutes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/img", imgRoutes);

app.use("/", (req, res) => {
    res.status(200).json({ message: "Hello from Backend!" })
});

app.listen(3001, async () => console.log("Server has started on port 3001"))