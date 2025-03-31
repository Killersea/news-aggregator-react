import HeadlinesCarousel from "../components/HeadlinesCarousel";
import CategoryHeadlines from "../components/CategoryHeadlines";
import { Typography } from "@mui/material";
export default function HeadlinesPage() {
  const categories = [
    "Business",
    "Entertainment",
    "General",
    "Health",
    "Science",
    "Sports",
    "Technology",
  ];

  return (
    <>
      <Typography variant="h3" component="h2" fontWeight="bold" sx={{ mb: 1 }}>
        Top Headlines
      </Typography>
      <HeadlinesCarousel />
      <div className="w-full flex flex-col gap-5 mt-5 ">
        {categories.map((category) => (
          <CategoryHeadlines key={category} category={category} />
        ))}
      </div>
    </>
  );
}
