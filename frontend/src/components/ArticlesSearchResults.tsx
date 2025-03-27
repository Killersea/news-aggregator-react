import { ArticleData } from "../interfaces/articleInterface";
import { CardMedia, CardContent, Typography, Card } from "@mui/material";

interface ArticlesSearchResultsProps {
  searchResults: ArticleData[];
}

export default function ArticlesSearchResults({
  searchResults,
}: ArticlesSearchResultsProps) {
  console.log(searchResults);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {searchResults.map((article, index) => (
        <Card key={index} className="shadow-lg">
          {article.urlToImage && (
            <CardMedia
              component="img"
              height="200"
              image={article.urlToImage}
              alt={article.title}
            />
          )}
          <CardContent>
            <Typography variant="h6" component="h2" className="font-bold">
              {article.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {article.description}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {article.author && `By ${article.author}`} |{" "}
              {new Date(article.publishedAt).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
