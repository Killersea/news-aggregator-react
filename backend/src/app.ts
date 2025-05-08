import express from "express";
import cors from "cors";
import articleRoutes from "../routes/articleRoutes"; // Import your routes
import conversionRoutes from "../routes/conversionRoutes";


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/articles", articleRoutes);
app.use("/api/convert", conversionRoutes);

export default app;