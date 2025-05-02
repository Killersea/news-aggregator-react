import { useHeadlineNews } from "../hooks/newsHooks";
import { ArticleData } from "../interfaces/articleInterface";
import { useMemo, useState } from "react";
import {
  Button,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  CardActions,
  Box,
  Divider,
} from "@mui/material";
import newsAPI from "../assets/newsAPI.png";
import ArticleModal from "./ArticleModal";
import ScrollContainer from "react-indiana-drag-scroll";

interface CategoryHeadlinesProps {
  category: string;
}

export default function CategoryHeadlines({
  category,
}: CategoryHeadlinesProps) {
  const { data, error, isLoading } = useHeadlineNews("us", category);
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const headlineCategoryNews = useMemo(() => {
    if (isLoading || error || !data || !data.articles) return [];

    const uniqueTitles = new Map();

    return data.articles
      .filter(
        ({ description, content, title }: ArticleData) =>
          description && content && title
      )
      .filter(({ title }: ArticleData) => {
        if (uniqueTitles.has(title)) return false;
        uniqueTitles.set(title, true);
        return true;
      })
      .map(
        ({
          author,
          title,
          description,
          url,
          urlToImage,
          publishedAt,
          content,
        }: ArticleData) => ({
          author,
          title,
          description,
          url,
          urlToImage,
          publishedAt,
          content,
        })
      );
  }, [data, isLoading, error]);

  const handlePrev = () => {
    const newIndex = currentIndex === 0 ? 0 : currentIndex - 1;

    setCurrentIndex(newIndex);
    setSelectedArticle(headlineCategoryNews[newIndex]);
  };

  const handleNext = () => {
    const newIndex =
      currentIndex === headlineCategoryNews.length - 1
        ? headlineCategoryNews.length - 1
        : currentIndex + 1;

    setCurrentIndex(newIndex);
    setSelectedArticle(headlineCategoryNews[newIndex]);
  };

  const handleOpenModal = (index: number) => {
    setCurrentIndex(index);
    setSelectedArticle(headlineCategoryNews[index]);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedArticle(null);
  };

  if (headlineCategoryNews.length === 0)
    return <Typography variant="h6">Articles Loading</Typography>;
  return (
    <>
      <div key={category} className="flex flex-col gap-5">
        <Typography variant="h4" component="h2" fontWeight="bold">
          {category}
        </Typography>
        <div className="overflow-x-auto pb-2">
          <ScrollContainer
            style={{
              paddingBlock: ".2rem",
              scrollSnapType: "x mandatory",
            }}
          >
            <div className="grid grid-flow-col gap-5 auto-cols-[minmax(100%,1fr)] md:auto-cols-[minmax(50%,1fr)] lg:auto-cols-[minmax(50%,1fr)] xl:auto-cols-[minmax(24%,1fr)]">
              {headlineCategoryNews.map(
                (article: ArticleData, index: number) => (
                  <Card
                    key={index}
                    className="shadow-lg"
                    sx={{ display: "flex", height: "250px" }}
                  >
                    <CardActionArea
                      onClick={() => handleOpenModal(index)}
                      sx={{ flex: 1 }}
                    >
                      <CardMedia
                        component="img"
                        image={article.urlToImage || newsAPI}
                        alt={article.title}
                        sx={{
                          height: 250,
                          width: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = newsAPI;
                        }}
                      />
                    </CardActionArea>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", flex: 1 }}
                    >
                      <CardContent>
                        <Typography
                          component="h2"
                          fontWeight="bold"
                          sx={{ fontSize: { xs: 12, md: 14 } }}
                        >
                          {article.title}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ mt: "auto" }}>
                        <Button
                          size="small"
                          color="primary"
                          variant="contained"
                          onClick={() => window.open(article.url, "_blank")}
                        >
                          Go to Source
                        </Button>
                      </CardActions>
                    </Box>
                  </Card>
                )
              )}
            </div>
          </ScrollContainer>
        </div>
        <Divider />
      </div>
      <ArticleModal
        open={modalOpen}
        handleClose={handleCloseModal}
        handlePrev={handlePrev}
        handleNext={handleNext}
        article={selectedArticle}
      />
    </>
  );
}
