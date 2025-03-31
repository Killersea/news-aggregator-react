import newsAPILogo from "../assets/newsAPI.png";
import { ArticleData } from "../interfaces/articleInterface";
import ArticleModal from "./ArticleModal";
import {
  CardMedia,
  CardContent,
  Typography,
  Card,
  CardActionArea,
  CardActions,
  Button,
} from "@mui/material";
import { useState } from "react";

interface ArticlesSearchResultsProps {
  searchResults: ArticleData[];
}

export default function ArticlesSearchResults({
  searchResults,
}: ArticlesSearchResultsProps) {
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = (article: ArticleData) => {
    setSelectedArticle(article);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedArticle(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {searchResults.map((article, index) => (
          <Card
            key={index}
            className="shadow-lg"
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <CardActionArea onClick={() => handleOpenModal(article)}>
              <CardMedia
                component="img"
                image={article.urlToImage || newsAPILogo}
                alt={article.title}
                sx={{
                  height: 250,
                  width: "100%",
                  objectFit: "cover",
                }}
              />
              <CardContent>
                <Typography variant="h6" component="h2" className="font-bold">
                  {article.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {article.description}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  By {article?.author || "Unknown"} |
                  {article?.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString()
                    : "Unknown Date"}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions sx={{ mt: "auto" }}>
              <Button
                size="small"
                color="primary"
                onClick={() => window.open(article.url, "_blank")}
              >
                Go to Source
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
      <ArticleModal
        open={modalOpen}
        handleClose={handleCloseModal}
        article={selectedArticle}
      />
    </>
  );
}
