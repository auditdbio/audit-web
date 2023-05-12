import 'swiper/css/bundle';
import { Button, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useRef } from 'react';
import { Navigation, Pagination } from 'swiper';
import FeedbackCard from './FeedbackCard';
import useMediaQuery from '@mui/material/useMediaQuery';

const Carousel = () => {
  const swiperRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  function handleNextClick() {
    swiperRef.current.slideNext();
  }

  function handlePrevClick() {
    swiperRef.current.slidePrev();
  }

  const nextBtnClass = 'swiper-button-next';
  const prevBtnClass = 'swiper-button-prev';

  return (
    <Box
      sx={{
        paddingTop: '2rem',
        width: '100%',
        marginBottom: '2rem',
        maxWidth: '1512px',
      }}
      component="section"
    >
      {/*here will be your opinion about auditDB*/}
      <Box sx={carouselTextStyle}>Who’s using AuditDB?</Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 100,
          margin: '0 auto',
          gap: '10px',
          flexGrow: 0,
          '& .swiper-slide': {
            display: 'flex',
            justifyContent: 'center',
          },
        }}
      >
        {!isMobile && (
          <Button
            className={prevBtnClass}
            onClick={handlePrevClick}
            disableRipple
            aria-label="previous slide"
          />
        )}
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          onSlideChange={() => console.log('slide change')}
          onSwiper={swiper => {
            swiperRef.current = swiper;
          }}
          modules={[Pagination, Navigation]}
          loop={true}
        >
          {items.map(item => (
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
            aria-label="next slide"
          />
        )}
      </Box>
      {isMobile && (
        <Box
          className="mobile-buttons"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          <Button
            className={prevBtnClass}
            onClick={handlePrevClick}
            disableRipple
            aria-label="previous slide"
          />
          <Button
            className={nextBtnClass}
            disableRipple
            onClick={handleNextClick}
            aria-label="next slide"
          />
        </Box>
      )}
    </Box>
  );
};

const carouselTextStyle = theme => ({
  fontSize: '32px',
  fontWeight: '500',
  textAlign: 'center',
  marginBottom: '2rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '28px',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '24px',
  },
});

const items = [
  {
    id: 1,
    name: 'Your name',
    interests: 'Your company',
    description: 'Here will be your opinion about AuditDB',
  },
  {
    id: 2,
    name: 'Your name',
    interests: 'Your company',
    description: 'Here will be your opinion about AuditDB',
  },
];
export default Carousel;
