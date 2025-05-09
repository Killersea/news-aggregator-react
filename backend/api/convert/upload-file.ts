import { VercelRequest, VercelResponse } from "@vercel/node";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://news-aggregator-react-nine.vercel.app"
  ); // Change to your frontend URL
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body as HandleUploadBody;

    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: [
            "audio/*",
            "video/*",
            "image/*",
            "application/pdf",
            "text/plain",
          ],
          addRandomSuffix: false,
          tokenPayload: JSON.stringify({ uploadedAt: Date.now() }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("Upload complete:", blob.url, tokenPayload);
      },
    });

    return res.status(200).json(result);
  } catch (err: any) {
    console.error("Upload handler error:", err);
    return res.status(400).json({ error: err.message || "Upload failed" });
  }
}
