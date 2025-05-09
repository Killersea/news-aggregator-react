// routes/conversionRoutes.ts
import express, { Request, Response } from "express";
import { upload } from "../middlewares/uploadMiddleware";
import { IncomingForm } from "formidable-serverless";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
import fs from "fs";

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
  async (req: Request, res: Response): Promise<void> => {
    const form = new IncomingForm();

    form.parse(
      req,
      async (
        err: any,
        fields: { server: string; jobId: string },
        files: { file: any }
      ) => {
        if (err) {
          console.error("Form parse error:", err);
          res.status(400).json({ error: "Invalid form data" });
          return;
        }

        const server = fields.server as string;
        const jobId = fields.jobId as string;
        const file = files.file;

        if (!server || !jobId || !file || Array.isArray(file)) {
          res
            .status(400)
            .json({ error: "Missing or invalid server, jobId, or file" });
          return;
        }

        try {
          const formData = new FormData();
          formData.append(
            "file",
            fs.createReadStream(file.path),
            file.originalFilename || file.name
          );

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

          await fs.promises.unlink(file.path);
          res.json(uploadResponse.data);
        } catch (err) {
          console.error("File upload failed:", err);
          res
            .status(500)
            .json({ error: "Failed to upload file to conversion server" });
        }
      }
    );
  }
);

router.get(
  "/check-job-status/",
  async (req: Request, res: Response): Promise<void> => {
    const { jobId } = req.query;

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
