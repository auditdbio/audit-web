import { useRef } from 'react';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button, Box, useMediaQuery } from '@mui/material';
import 'swiper/css/bundle';
import FeedbackCard from './FeedbackCard';
import { addTestsLabel } from '../../../lib/helper.js';
import theme from '../../../styles/themes.js';

const Carousel = () => {
  const swiperRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  function handleNextClick() {
    swiperRef.current.slideNext();
  }

  function handlePrevClick() {
    swiperRef.current.slidePrev();
  }

  const nextBtnClass = 'swiper-button-next';
  const prevBtnClass = 'swiper-button-prev';

  return (
    <Box sx={wrapper} component="section">
      {/*here will be your opinion about auditDB*/}
      <Box sx={carouselTextStyle}>Who’s using AuditDB?</Box>
      <Box sx={desktopSx}>
        {!isMobile && (
          <Button
            className={prevBtnClass}
            onClick={handlePrevClick}
            disableRipple
            aria-label="previous slide"
            {...addTestsLabel('carousel_previous-slide')}
          />
        )}
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
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
            {...addTestsLabel('carousel_next-slide')}
          />
        )}
      </Box>

      {isMobile && (
        <Box className="mobile-buttons" sx={mobileSx}>
          <Button
            className={prevBtnClass}
            onClick={handlePrevClick}
            disableRipple
            aria-label="previous slide"
            {...addTestsLabel('carousel_previous-slide')}
          />
          <Button
            className={nextBtnClass}
            disableRipple
            onClick={handleNextClick}
            aria-label="next slide"
            {...addTestsLabel('carousel_next-slide')}
          />
        </Box>
      )}
    </Box>
  );
};

const wrapper = {
  paddingTop: '1.5rem',
  width: '100%',
  marginBottom: '1.5rem',
  maxWidth: '1512px',
};

const carouselTextStyle = theme => ({
  fontSize: '26px',
  fontWeight: '500',
  textAlign: 'center',
  marginBottom: '2rem',
  [theme.breakpoints.down('xs')]: {
    fontSize: '22px',
  },
});

const desktopSx = {
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
};

const mobileSx = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
};

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
  {
    id: 2,
    name: 'Your name',
    interests: 'Your company',
    description: 'Here will be your opinion about AuditDB',
  },
];
export default Carousel;
