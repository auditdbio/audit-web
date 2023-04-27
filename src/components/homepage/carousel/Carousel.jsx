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
      <Box sx={carouselTextStyle}>here will be your opinion about auditDB</Box>
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
            800: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1450: {
              slidesPerView: 3,
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

const carouselTextStyle = (theme) => ({
  fontSize: "32px",
  fontWeight: "500",
  textAlign: "center",
  marginBottom: "2rem",
  [theme.breakpoints.down('sm')]: {
    fontSize: '28px'
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '24px'
  },
});

const items = [
  {
    id: 1,
    name: "Sarah Johnson",
    interests: "Crypto, Auditor",
    description:
      "“AuditDb is a secure blockchain-based platform that connects freelancers with clients. I highly recommend it for anyone looking for job opportunities. The added security of blockchain technology is a bonus.”",
  },
  {
    id: 2,
    name: "David Lee",
    interests: " Blockchain, Accounting",
    description:
      "“I was initially skeptical about blockchain-based job platforms, but AuditDb exceeded my expectations. It's easy to use, and I found my dream job within weeks. I highly recommend it to anyone looking for quality work.”",
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    interests: "Consulting, Accounting",
    description:
      "“As a freelancer, I found AuditDb to be the perfect platform to connect with clients. The user-friendly interface and added security of blockchain technology provide peace of mind. Highly recommended!”",
  },
  {
    id: 4,
    name: "John Smith",
    interests: "Crypto, Middle",
    description:
      "“AuditDb is an excellent platform for freelancers to showcase their skills and connect with clients. The consistent work I've found through this platform has been a game-changer. Highly recommend it to other freelancers.”",
  },
  {
    id: 5,
    name: "Emily Wong",
    interests: "Bigfour, Accounting",
    description:
      "“The job search process can be daunting, but AuditDb made it a breeze. Its blockchain-based platform ensures secure transactions, and I was able to find a great job in no time. I highly recommend it.”",
  },
  {
    id: 6,
    name: "Alex Patel",
    interests: "Audit, Crypto",
    description:
      "“I was impressed with the level of transparency AuditDb provides. As a client, I was able to see the progress of the project and ensure that my payments were secure. Highly recommend it for both clients and freelancers.”",
  },
  {
    id: 7,
    name: "Rachel Kim",
    interests: "Blockchain, Crypto",
    description:
      "“AuditDb has simplified the job search process for me. Its easy-to-use interface and secure transactions make it stand out from other job platforms. Highly recommended for anyone looking for quality work.”",
  },
  {
    id: 8,
    name: "Tom Jackson",
    interests: "Auditor, Bigfour",
    description:
      "“The freelance market can be competitive, but AuditDb makes it easier to connect with clients. Its blockchain technology ensures that both parties can trust the transaction. Highly recommend it for freelancers and clients alike.”",
  },
  {
    id: 9,
    name: "Samantha Chen",
    interests: "Audit, Blockchain",
    description:
      "“AuditDb is a reliable platform for both clients and freelancers. Its blockchain-based technology provides added security, and I've found quality work through this platform. Highly recommended.”",
  },
];
export default Carousel;
