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
import {
  useFileConversion,
  useConversionCreateJob,
  useCheckJobStatus,
} from "../hooks/fileHooks";

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

  const maxFileSize = 100 * 1024 * 1024; // 1 GB
  const fileSizeBytes = file.length > 0 ? file[0].size : 0;
  const fileExtension = file.length > 0 ? file[0].name.split(".").pop() : "";
  const fileType = file.length > 0 ? file[0].type : "";
  const category = getFileCategory(fileType);
  const availableConversions = category ? conversionOptions[category] : [];
  const isFileTooLarge = fileSizeBytes > maxFileSize;

  const { mutate: createJob, status: jobStatus } = useConversionCreateJob();
  const { mutate: createConvert, status: convertStatus } = useFileConversion();
  const { data: jobFinishData } = useCheckJobStatus(
    conversionId || "",
    pollingEnabled
  );

  const handleCreateJob = () => {
    if (!file[0] || !convertTo || !category) return;

    createJob(
      { category: category as string, convertTo },
      {
        onSuccess: (data) => {
          createConvert(
            { file: file[0], jobId: data.id, server: data.server },
            {
              onSuccess: (data) => {
                setConversionId(data.id.job);
                setPollingEnabled(true);
              },
              onError: (error) => {
                console.error("Conversion failed:", error);
              },
            }
          );
        },
        onError: (error) => {
          console.error("Job creation failed:", error);
        },
      }
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(Array.from(event.target.files));
    }
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setConvertTo(event.target.value);
  };

  useEffect(() => {
    if (jobFinishData?.status?.code === "completed") {
      setPollingEnabled(false);
      const downloadUrl = jobFinishData?.output?.[0]?.uri;
      if (downloadUrl) {
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.click();
      } else {
        console.error("Download URL not found.");
      }
    } else if (jobFinishData?.status?.code === "failed") {
      setPollingEnabled(false);
      console.error("Conversion failed:", jobFinishData);
    }
  }, [jobFinishData]);

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
            onClick={handleCreateJob}
            disabled={
              !file.length ||
              !convertTo ||
              isFileTooLarge ||
              jobStatus === "pending" ||
              convertStatus === "pending" ||
              jobFinishData?.status?.code === "processing" ||
              pollingEnabled
            }
          >
            {jobStatus === "pending" ||
            convertStatus === "pending" ||
            jobFinishData?.status?.code === "processing" ||
            pollingEnabled
              ? "Converting..."
              : "Start Conversion"}
          </Button>
        </>
      )}
    </Box>
  );
}
