import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { IncomingForm } from "formidable-serverless";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const form = new IncomingForm();
  const API_KEY = process.env.API2CONVERT_API_KEY;

  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://news-aggregator-react-nine.vercel.app"
  ); // Change to your frontend URL
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: "Missing API key" });
  }

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

        const response = await axios.post(
          `${server}/upload-file/${jobId}`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
              "x-oc-api-key": process.env.API2CONVERT_API_KEY,
            },
          }
        );
        await fs.promises.unlink(file.path);
        res.json(response.data);
      } catch (err) {
        console.error("File upload failed:", err);
        res
          .status(500)
          .json({ error: "Failed to upload file to conversion server" });
      }
    }
  );
}
