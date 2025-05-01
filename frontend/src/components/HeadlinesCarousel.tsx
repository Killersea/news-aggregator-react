import { useHeadlineNews } from "../hooks/newsHooks";
import { ArticleData } from "../interfaces/articleInterface";
import { useState, useMemo } from "react";
import {
	Button,
	Typography,
	Card,
	CardMedia,
	CardContent,
	CardActionArea,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import newsAPI from "../assets/newsAPI.png";
import ArticleModal from "./ArticleModal";

export default function HeadlinesCarousel() {
	const { data, error, isLoading } = useHeadlineNews();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(
		null
	);
	const [modalOpen, setModalOpen] = useState(false);

	const headlineNews = useMemo(() => {
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
		setSelectedArticle(headlineNews[newIndex]);
	};

	const handleNext = () => {
		const newIndex =
			currentIndex === headlineNews.length - 1
				? headlineNews.length - 1
				: currentIndex + 1;

		setCurrentIndex(newIndex);
		setSelectedArticle(headlineNews[newIndex]);
	};

	const handleOpenModal = (index: number) => {
		setCurrentIndex(index);
		setSelectedArticle(headlineNews[index]);
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
		setSelectedArticle(null);
	};

	if (headlineNews.length === 0)
		return <Typography variant="h6">Articles Loading</Typography>;

	return (
		<>
			<Card
				sx={{
					position: "relative",
					width: { xs: "95%", md: "85%" },
					height: { xs: "30vh", md: "40vh" },
				}}
			>
				<CardActionArea onClick={() => handleOpenModal(currentIndex)}>
					<CardMedia
						component="img"
						image={headlineNews[currentIndex].urlToImage || newsAPI}
						alt={headlineNews[currentIndex].title}
						sx={{ width: "100%", height: "40vh", objectFit: "cover" }}
						onError={(e) => {
							(e.target as HTMLImageElement).src = newsAPI;
						}}
					/>
				</CardActionArea>
				<CardContent
					sx={{
						position: "absolute",
						bottom: 0,
						left: 0,
						width: "100%",
						background: "rgba(0, 0, 0, 0.6)",
						color: "white",
					}}
				>
					<Typography sx={{ fontSize: { xs: "10px", md: "20px" } }}>
						{headlineNews[currentIndex].title}
					</Typography>
				</CardContent>
				<Button
					onClick={handlePrev}
					sx={{
						position: "absolute",
						top: "50%",
						left: 10,
						color: "white",
						transform: "translateY(-50%)",
					}}
				>
					<ArrowBackIos />
				</Button>
				<Button
					onClick={handleNext}
					sx={{
						position: "absolute",
						top: "50%",
						right: 10,
						color: "white",
						transform: "translateY(-50%)",
					}}
				>
					<ArrowForwardIos />
				</Button>
			</Card>
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
