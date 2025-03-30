import HeadlinesCarousel from "../components/HeadlinesCarousel";
import CategoryHeadlines from "../components/CategoryHeadlines";
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
			<HeadlinesCarousel />
			<div className="w-full flex flex-col gap-5 mt-5 ">
				{categories.map((category) => (
					<CategoryHeadlines key={category} category={category} />
				))}
			</div>
		</>
	);
}
