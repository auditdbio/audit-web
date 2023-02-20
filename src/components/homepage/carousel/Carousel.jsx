import { Paper, Button, Box, Typography, Card } from "@mui/material";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { useRef } from "react";
import {
	Navigation,
	Pagination,
	Scrollbar,
	A11y,
	EffectCards,
	EffectFade,
} from "swiper";
import "swiper/css/bundle";
import "swiper/css";
import FeedbackCard from "./FeedbackCard";

const Carousel = () => {
	const swiperRef = useRef(null);

	function handleNextClick() {
		swiperRef.current.slideNext();
	}

	function handlePrevClick() {
		swiperRef.current.slidePrev();
	}

	const nextBtnClass = "swiper-button-next";
	const prevBtnClass = "swiper-button-prev";

	const items = [
		{ id: 1, name: "rus" },
		{ id: 2, name: "rus" },
		{ id: 3, name: "rus" },
		{ id: 5, name: "rus" },
		{ id: 4, name: "rus" },
	];

	return (
		<Box
			sx={{
				paddingTop: "2rem",
				maxWidth: "1450px",
			}}
		>
			<Box sx={carouselTextStyle}>Who’s using AuditDB?</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					gap: "2rem",
					zIndex: 100,
					marginBottom: "5rem",
				}}
			>
				<Button
					className={prevBtnClass}
					onClick={handlePrevClick}
					disableRipple
				></Button>
				<Swiper
					className="my-slider"
					modules={[Navigation, Pagination]}
					spaceBetween={50}
					slidesPerView={3}
					onSlideChange={() => console.log("slide change")}
					onSwiper={(swiper) => {
						swiperRef.current = swiper;
					}}
					loop
					centeredSlides
					style={swiperStyles.wrapper}
				>
					{items.map((item) => (
						<SwiperSlide key={item.id} style={swiperStyles.slide}>
							<FeedbackCard />
						</SwiperSlide>
					))}
				</Swiper>
				<Button
					className={nextBtnClass}
					onClick={handleNextClick}
					disableRipple
				></Button>
			</Box>
		</Box>
	);
};

const carouselTextStyle = {
	fontSize: "32px",
	fontWeight: "500",
	textAlign: "center",
	marginBottom: "2rem",
};

const swiperStyles = {
	wrapper: {
		boxShadow: "none",
		position: "relative",
		zIndex: "9999 !important",
		overflow: "inheit",
	},
	slide: {
		boxShadow: "none",
	},
};
export default Carousel;
