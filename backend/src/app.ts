import express from "express";
import cors from "cors";
import articleRoutes from "../routes/articleRoutes"; // Import your routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/articles", articleRoutes);

export default app;