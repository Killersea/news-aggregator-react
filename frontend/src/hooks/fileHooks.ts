import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadAndConvertFile } from "../api/newsApi";
import { createConversionJob } from "../api/newsApi";
import { checkJobStatus } from "../api/newsApi";

export const useConversionCreateJob = () => {
  return useMutation({
    mutationFn: ({
      category,
      convertTo,
    }: {
      category: string;
      convertTo: string;
    }) => createConversionJob(category, convertTo),
  });
};

export const useFileConversion = () => {
  return useMutation({
    mutationFn: ({
      file,
      jobId,
      server,
    }: {
      file: File;
      jobId: string;
      server: string;
    }) => uploadAndConvertFile(file, jobId, server),
  });
};

export const useCheckJobStatus = (jobId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["jobStatus", jobId],
    queryFn: () => checkJobStatus(jobId),
    enabled,
    refetchInterval: 1000, // Refetch every 1 seconds
  });
};
