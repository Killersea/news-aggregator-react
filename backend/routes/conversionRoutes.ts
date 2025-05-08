// routes/conversionRoutes.ts
import express, { Request, Response } from "express";
import { upload } from "../middlewares/uploadMiddleware";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/create-job", async (req: Request, res: Response) => {
  try {
    const { category, target } = req.body;

    const response = await axios.post(
      "https://api.api2convert.com/v2/jobs",
      {
        conversion: [
          {
            category,
            target,
          },
        ],
      },
      {
        headers: {
          "x-oc-api-key": process.env.API2CONVERT_API_KEY || "",
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Create job error:", err);
    res.status(500).json({ error: "Failed to create conversion job" });
  }
});

router.post(
  "/upload-file",
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    const { server, jobId } = req.body;
    const file = req.file;

    if (!server || !jobId || !file) {
      res.status(400).json({ error: "Missing server, jobId, or file" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file.buffer, file.originalname);

    try {
      const uploadResponse = await axios.post(
        `${server}/upload-file/${jobId}`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            "x-oc-api-key": process.env.API2CONVERT_API_KEY || "",
          },
        }
      );

      res.json(uploadResponse.data);
    } catch (err) {
      console.error("File upload failed:", err);
      res
        .status(500)
        .json({ error: "Failed to upload file to conversion server" });
    }
  }
);

router.get(
  "/check-job-status/:jobId",
  async (req: Request, res: Response): Promise<void> => {
    const { jobId } = req.params;

    if (!jobId) {
      res.status(400).json({ error: "Job ID is required" });
      return;
    }

    try {
      const response = await axios.get(
        `https://api.api2convert.com/v2/jobs/${jobId}`,
        {
          headers: {
            "x-oc-api-key": process.env.API2CONVERT_API_KEY || "",
          },
        }
      );

      res.json(response.data);
    } catch (error) {
      console.error("Error checking job status:", error);
      res.status(500).json({ error: "Failed to check job status" });
    }
  }
);

export default router;
