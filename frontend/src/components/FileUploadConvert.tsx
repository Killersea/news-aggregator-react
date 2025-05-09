import {
  Box,
  Button,
  Select,
  MenuItem,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { conversionOptions } from "../constants/conversionOptions";
import { useConversionCreateJob, useCheckJobStatus } from "../hooks/fileHooks";
import { upload } from "@vercel/blob/client";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const getFileCategory = (
  mimeType: string
): keyof typeof conversionOptions | null => {
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("image/")) return "image";
  if (
    mimeType === "application/pdf" ||
    mimeType.includes("wordprocessingml") ||
    mimeType.includes("spreadsheetml") ||
    mimeType.includes("presentationml") ||
    mimeType.includes("msword") ||
    mimeType.includes("spreadsheet") ||
    mimeType.includes("presentation") ||
    mimeType.includes("text")
  )
    return "document";
  return null;
};

export default function FileUploadConvert() {
  const [file, setFile] = useState<File[]>([]);
  const [convertTo, setConvertTo] = useState("");
  const [pollingEnabled, setPollingEnabled] = useState(false);
  const [conversionId, setConversionId] = useState<string | null>(null);
  const [doneConverting, setDoneConverting] = useState(true);

  const maxFileSize = 100 * 1024 * 1024; // 1 GB
  const fileSizeBytes = file.length > 0 ? file[0].size : 0;
  const fileExtension = file.length > 0 ? file[0].name.split(".").pop() : "";
  const fileType = file.length > 0 ? file[0].type : "";
  const category = getFileCategory(fileType);
  const availableConversions = category ? conversionOptions[category] : [];
  const isFileTooLarge = fileSizeBytes > maxFileSize;

  const { mutate: createJob } = useConversionCreateJob();
  const { data: jobFinishData } = useCheckJobStatus(
    conversionId || "",
    pollingEnabled
  );

  const handleFileUpload = async () => {
    if (!file[0] || !convertTo || !category) return;
    console.log("url", import.meta.env.VITE_APP_VERCEL_URL);
    try {
      setDoneConverting(false);
      const { url } = await upload(file[0].name, file[0], {
        access: "public",
        handleUploadUrl:
          "https://news-aggregator-react-zeta.vercel.app/api/convert/upload-file",
      });
      handleCreateJob(url);
      console.log("File uploaded successfully:", url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleCreateJob = (uploadedUrl: string) => {
    if (!file[0] || !convertTo || !category || !uploadedUrl) return;
    console.log("Creating job with URL:", uploadedUrl);

    createJob(
      {
        uploadedUrl: uploadedUrl,
        category: category as string,
        convertTo,
      },
      {
        onSuccess: (data) => {
          setConversionId(data.id);
          setPollingEnabled(true);
        },
        onError: (error) => {
          console.error("Job creation failed:", error);
        },
      }
    );
  };

  useEffect(() => {
    const handleJobCompletion = async () => {
      if (jobFinishData?.status?.code === "completed") {
        setPollingEnabled(false);
        const downloadUrl = jobFinishData?.output?.[0]?.uri;
        if (downloadUrl) {
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.click();
          setDoneConverting(true);
        } else {
          console.error("Download URL not found.");
        }
      } else if (jobFinishData?.status?.code === "failed") {
        setPollingEnabled(false);
        console.error("Conversion failed:", jobFinishData);
      }
    };

    handleJobCompletion();
  }, [jobFinishData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(Array.from(event.target.files));
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setConvertTo(event.target.value);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 2,
      }}
    >
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        sx={{ width: "100%", height: "56px", fontWeight: "bold" }}
      >
        Upload files
        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
      </Button>

      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: file.length > 0 ? "text.primary" : "text.disabled",
            textOverflow: "ellipsis",
            width: "100%",
            overflow: "hidden",
            display: "block",
            whiteSpace: "nowrap",
          }}
        >
          {file.length > 0 ? file[0].name : "No file selected"}
        </Typography>

        {file.length > 0 && (
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            File type: <strong>{fileType}</strong> ({fileExtension})
          </Typography>
        )}
      </Box>

      {file.length > 0 && (
        <>
          {isFileTooLarge && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              ⚠ File size exceeds 100 MB. Conversion is disabled.
            </Typography>
          )}

          <Select
            fullWidth
            value={convertTo}
            onChange={handleSelectChange}
            displayEmpty
            disabled={isFileTooLarge}
            sx={{
              mt: 1,
              fontWeight: 500,
              backgroundColor: "#fafafa",
              "& .MuiSelect-select": {
                paddingY: 1.5,
              },
            }}
          >
            <MenuItem value="" disabled>
              Select format to convert
            </MenuItem>
            {availableConversions.map((type) => (
              <MenuItem key={type} value={type}>
                Convert to {type}
              </MenuItem>
            ))}
          </Select>

          <Button
            variant="contained"
            onClick={handleFileUpload}
            disabled={
              !file.length || !convertTo || isFileTooLarge || !doneConverting
            }
          >
            {!doneConverting ? "Converting..." : "Start Conversion"}
          </Button>
        </>
      )}
    </Box>
  );
}
