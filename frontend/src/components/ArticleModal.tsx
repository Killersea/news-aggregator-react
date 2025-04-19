import newsAPI from "../assets/newsAPI.png";
import {
	Modal,
	Box,
	Slide,
	Typography,
	CardMedia,
	Button,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { ArticleData } from "../interfaces/articleInterface";
import { useEffect, useState, useMemo } from "react";
import { useArticleContent } from "../hooks/newsHooks";

interface ArticleModalProps {
	open: boolean;
	handleClose: () => void;
	handleNext: () => void;
	handlePrev: () => void;
	article: ArticleData | null;
}
export default function ArticleModal({
	open,
	handleClose,
	handleNext,
	handlePrev,
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
						paddingTop: 4,
						paddingBottom: 4,
						paddingLeft: 0,
						paddingRight: 0,
						borderRadius: 2,
						display: "flex",
					}}
				>
					<Button
						size="medium"
						sx={{
							alignSelf: "center",
							minWidth: "auto",
						}}
					>
						<ArrowBackIos
							fontSize="large"
							sx={{ transform: "translateX(5px)" }}
							onClick={handlePrev}
						/>
					</Button>
					<Box
						sx={{
							overflow: "hidden",
							flexDirection: "column",
							display: "flex",
						}}
					>
						<CardMedia
							component="img"
							image={article?.urlToImage || newsAPI}
							alt={article?.title || "No title available"}
							sx={{
								height: {
									xs: "30vh",
									md: "40vh",
								},
								width: "100%",
								objectFit: "cover",
								borderRadius: 2,
								mb: 2,
							}}
							onError={(e) => {
								(e.target as HTMLImageElement).src = newsAPI;
							}}
						/>
						<Box
							sx={{
								overflowY: "auto",
								flex: 1,
								"&::-webkit-scrollbar": { display: "none" },
							}}
						>
							<Typography
								sx={{
									fontWeight: "bold",
									mb: 1,
									fontSize: {
										xs: "1.5rem",
										md: "2.2rem",
									},
								}}
							>
								{article?.title}
							</Typography>

							<Typography
								sx={{
									color: "gray",
									mb: 2,
									fontSize: {
										xs: ".8rem",
										md: "1rem",
									},
								}}
							>
								By {article?.author || "Unknown"} |{" "}
								{article?.publishedAt
									? new Date(article.publishedAt).toLocaleDateString()
									: "Unknown Date"}
							</Typography>

							<Typography
								sx={{
									lineHeight: 1.6,
									fontSize: {
										xs: ".9rem", // ~16px
										md: "1.125rem", // ~18px
									},
								}}
							>
								{content || article?.content || "Loading content..."}
							</Typography>
						</Box>
					</Box>
					<Button
						sx={{
							alignSelf: "center",
							minWidth: "auto",
						}}
						onClick={handleNext}
					>
						<ArrowForwardIos fontSize="large" />
					</Button>
				</Box>
			</Slide>
		</Modal>
	);
}
