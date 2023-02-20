import { Paper, Button, Box, Typography, Card } from "@mui/material";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { useRef } from "react";
import { Navigation, Pagination } from "swiper";
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

	return (
		<Box
			sx={{
				paddingTop: "2rem",
				maxWidth: "1480px",
			}}
		>
			<Box sx={carouselTextStyle}>Who’s using AuditDB?</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					zIndex: 100,
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
					spaceBetween={20}
					slidesPerView={3}
					onSlideChange={() => console.log("slide change")}
					onSwiper={(swiper) => {
						swiperRef.current = swiper;
					}}
					loop
					centeredSlides={true}
					style={swiperStyles.wrapper}
				>
					{items.map((item) => (
						<SwiperSlide key={item.id} style={swiperStyles.slide}>
							<FeedbackCard info={item} />
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
		paddingX: "2rem",
		marginX: "2rem",
		boxShadow: "none",
	},
	slide: {
		boxShadow: "none",
	},
};

const items = [
	{
		id: 1,
		name: "Artem Molodneckiy",
		interests: "Criptography, Games",
		description:
			"“ As one of the first quadratic freelancers to go through the platform, my grant enabled me to leave my job and build open source tutorials and prototypes for the open internet. Super excited to see quadratic funding continue to help high leverage outliers find their place in our ecosystem.”",
	},
	{
		id: 2,
		name: "Artem Molodneckiy",
		interests: "Criptography, Games",
		description:
			"“ As one of the first quadratic freelancers to go through the platform, my grant enabled me to leave my job and build open source tutorials and prototypes for the open internet. Super excited to see quadratic funding continue to help high leverage outliers find their place in our ecosystem.”",
	},
	{
		id: 3,
		name: "Artem Molodneckiy",
		interests: "Criptography, Games",
		description:
			"“ As one of the first quadratic freelancers to go through the platform, my grant enabled me to leave my job and build open source tutorials and prototypes for the open internet. Super excited to see quadratic funding continue to help high leverage outliers find their place in our ecosystem.”",
	},
	{
		id: 4,
		name: "Artem Molodneckiy",
		interests: "Criptography, Games",
		description:
			"“ As one of the first quadratic freelancers to go through the platform, my grant enabled me to leave my job and build open source tutorials and prototypes for the open internet. Super excited to see quadratic funding continue to help high leverage outliers find their place in our ecosystem.”",
	},
	{
		id: 5,
		name: "Artem Molodneckiy",
		interests: "Criptography, Games",
		description:
			"“ As one of the first quadratic freelancers to go through the platform, my grant enabled me to leave my job and build open source tutorials and prototypes for the open internet. Super excited to see quadratic funding continue to help high leverage outliers find their place in our ecosystem.”",
	},
];
export default Carousel;
