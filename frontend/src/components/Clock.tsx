import { useState, useEffect } from "react";

export default function Clock() {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	const formatTime = (date: Date) =>
		date.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});

	const formatDate = (date: Date) =>
		date.toLocaleDateString([], {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

	const formatDay = (date: Date) =>
		date.toLocaleDateString([], { weekday: "long" });

	return (
		<div className="text-right">
			<div>{formatTime(currentTime)}</div>
			<div>
				{formatDay(currentTime)}, {formatDate(currentTime)}
			</div>
		</div>
	);
}
