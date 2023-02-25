import "swiper/css/bundle";
import { Button, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRef } from "react";
import { Navigation, Pagination } from "swiper";
import FeedbackCard from "./FeedbackCard";
import useMediaQuery from "@mui/material/useMediaQuery";

const Carousel = () => {
  const swiperRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

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
        width: "100%",
        marginBottom: "2rem",
        maxWidth: "1512px",
      }}
    >
      <Box sx={carouselTextStyle}>Who’s using AuditDB?</Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 100,
          margin: "0 auto",
          gap: "10px",
          flexGrow: 0,
        }}
      >
        {!isMobile && (
          <Button
            className={prevBtnClass}
            onClick={handlePrevClick}
            disableRipple
          ></Button>
        )}
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Pagination, Navigation]}
          breakpoints={{
            920: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1512: {
              slidesPerView: 3,
              spaceBetween: 50,
            },
            1920: {
              slidesPerView: 4,
              spaceBetween: 50,
            },
          }}
          loop={true}
          style={{
            width: "80%",
          }}
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <FeedbackCard info={item} />
            </SwiperSlide>
          ))}
        </Swiper>
        {!isMobile && (
          <Button
            className={nextBtnClass}
            disableRipple
            onClick={handleNextClick}
          ></Button>
        )}
      </Box>
      {isMobile && (
        <Box
          className="mobile-buttons"
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <Button
            className={prevBtnClass}
            onClick={handlePrevClick}
            disableRipple
          ></Button>
          <Button
            className={nextBtnClass}
            disableRipple
            onClick={handleNextClick}
          ></Button>
        </Box>
      )}
    </Box>
  );
};

const carouselTextStyle = {
  fontSize: "32px",
  fontWeight: "500",
  textAlign: "center",
  marginBottom: "2rem",
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
  {
    id: 6,
    name: "Artem Molodneckiy",
    interests: "Criptography, Games",
    description:
      "“ As one of the first quadratic freelancers to go through the platform, my grant enabled me to leave my job and build open source tutorials and prototypes for the open internet. Super excited to see quadratic funding continue to help high leverage outliers find their place in our ecosystem.”",
  },
  {
    id: 7,
    name: "Artem Molodneckiy",
    interests: "Criptography, Games",
    description:
      "“ As one of the first quadratic freelancers to go through the platform, my grant enabled me to leave my job and build open source tutorials and prototypes for the open internet. Super excited to see quadratic funding continue to help high leverage outliers find their place in our ecosystem.”",
  },
  {
    id: 8,
    name: "Artem Molodneckiy",
    interests: "Criptography, Games",
    description:
      "“ As one of the first quadratic freelancers to go through the platform, my grant enabled me to leave my job and build open source tutorials and prototypes for the open internet. Super excited to see quadratic funding continue to help high leverage outliers find their place in our ecosystem.”",
  },
];
export default Carousel;
