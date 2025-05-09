import { useMutation, useQuery } from "@tanstack/react-query";
import { createConversionJob } from "../api/newsApi";
import { checkJobStatus } from "../api/newsApi";

export const useConversionCreateJob = () => {
  return useMutation({
    mutationFn: ({
      uploadedUrl,
      category,
      convertTo,
    }: {
      uploadedUrl: string;
      category: string;
      convertTo: string;
    }) => createConversionJob(uploadedUrl, category, convertTo),
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
