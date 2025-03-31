import newsAPILogo from "../assets/newsAPI.png";
import { Modal, Box, Slide, Typography, CardMedia } from "@mui/material";
import { ArticleData } from "../interfaces/articleInterface";
import { useEffect, useState, useMemo } from "react";
import { useArticleContent } from "../hooks/newsHooks";

interface ArticleModalProps {
  open: boolean;
  handleClose: () => void;
  article: ArticleData | null;
}
export default function ArticleModal({
  open,
  handleClose,
  article,
}: ArticleModalProps) {
  const [content, setContent] = useState<string | null>(null);

  const { data, error, isLoading } = useArticleContent(article?.url || "");

  const newsContent = useMemo(() => {
    if (isLoading || error || !data) return [];

    return data;
  }, [data, isLoading, error]);

  useEffect(() => {
    if (newsContent) {
      setContent(newsContent.content);
      const handler = setTimeout(() => {}, 1000);
      return () => clearTimeout(handler);
    } else {
      const handler = setTimeout(() => {
        setContent(null);
      }, 1000);
      return () => clearTimeout(handler);
    }
  }, [newsContent]);
  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      closeAfterTransition
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Slide in={open} direction="up">
        <Box
          sx={{
            width: "75%",
            height: "95%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            overflow: "hidden",
            flexDirection: "column",
            display: "flex",
          }}
        >
          <CardMedia
            component="img"
            image={article?.urlToImage || newsAPILogo}
            alt={article?.title || "No title available"}
            sx={{
              height: 400,
              width: "100%",
              objectFit: "cover",
              borderRadius: 2,
              mb: 2,
            }}
          />

          <Box
            sx={{
              overflowY: "auto",
              flex: 1,
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              {article?.title}
            </Typography>

            <Typography variant="subtitle1" sx={{ color: "gray", mb: 2 }}>
              By {article?.author || "Unknown"} |
              {article?.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString()
                : "Unknown Date"}
            </Typography>

            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              {content || "Loading content..."}
            </Typography>
          </Box>
        </Box>
      </Slide>
    </Modal>
  );
}
