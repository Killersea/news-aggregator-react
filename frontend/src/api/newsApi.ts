export const fetchSearchResults = async (queryKey: string) => {
  if (!queryKey) return {};

  const response = await fetch(
    `${
      import.meta.env.VITE_APP_VERCEL_URL
    }/api/news?type=search&query=${queryKey}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch search results");
  }

  return response.json();
};

export const fetchArticleContent = async (url: string) => {
  if (!url) return {};

  const response = await fetch(
    `${import.meta.env.VITE_APP_VERCEL_URL}/api/articleContent?url=${url}`,
    {}
  );

  if (!response.ok) {
    throw new Error("Failed to fetch search results");
  }

  return response.json();
};

export const fetchHeadlineNews = async (
  country: string = "us",
  category: string = "general"
) => {
  if (!category) return {};

  const response = await fetch(
    `${
      import.meta.env.VITE_APP_VERCEL_URL
    }/api/news?type=headlines&country=${country}&category=${category}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch headlines");
  }

  return response.json();
};

export const uploadAndConvertFile = async (
  file: File,
  jobId: string,
  server: string
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("jobId", jobId);
  formData.append("server", server);

  const response = await fetch(
    `${import.meta.env.VITE_APP_VERCEL_URL}/api/convert/upload-file`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload file to backend");
  }

  return response.json();
};

export const createConversionJob = async (
  category: string,
  convertTo: string
) => {
  const body = {
    category,
    target: convertTo,
  };

  const response = await fetch(
    `${import.meta.env.VITE_APP_VERCEL_URL}/api/convert/create-job`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create job to backend");
  }

  return response.json();
};

export const checkJobStatus = async (jobId: string) => {
  const response = await fetch(
    `${
      import.meta.env.VITE_APP_VERCEL_URL
    }/api/convert/check-job-status/jobId=${jobId}`
  );

  if (!response.ok) {
    throw new Error("Failed to check job status");
  }

  return response.json();
};
