export const fetchSearchResults = async (queryKey: string) => {
  if (!queryKey) return {};

  const response = await fetch(
    `https://newsapi.org/v2/everything?q="${queryKey}"&searchIn=title&languange=en`,
    {
      headers: {
        "X-Api-Key": import.meta.env.VITE_APP_API_KEY as string,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch search results");
  }

  return response.json();
};

export const fetchArticleContent = async (url: string) => {
  if (!url) return {};

  const response = await fetch(
    `http://localhost:5000/api/articles/fetch-article?url=${url}`,
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
    `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}`,
    {
      headers: {
        "X-Api-Key": import.meta.env.VITE_APP_API_KEY as string,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch search results");
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
    "http://localhost:5000/api/convert/upload-file",
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

  const response = await fetch("http://localhost:5000/api/convert/create-job", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to create job to backend");
  }

  return response.json();
};

export const checkJobStatus = async (jobId: string) => {
  const response = await fetch(
    `http://localhost:5000/api/convert/check-job-status/${jobId}`
  );

  if (!response.ok) {
    throw new Error("Failed to check job status");
  }

  return response.json();
};
