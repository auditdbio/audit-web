import React, { useState } from 'react';
import { Box } from '@mui/material';
import ImageModal from '../modal/ImageModal.jsx';
import { ASSET_URL } from '../../services/urls.js';

const ImageMessage = ({ message }) => {
  const [imageModalIsOpen, setImageModalIsOpen] = useState(false);

  return (
    <>
      <Box sx={wrapper}>
        <Box
          component="img"
          src={`${ASSET_URL}/${message.text}`}
          alt="chat-img"
          sx={imageMessage}
          onClick={() => setImageModalIsOpen(true)}
        />
      </Box>

      <ImageModal
        image={`${ASSET_URL}/${message.text}`}
        isOpen={imageModalIsOpen}
        setIsOpen={setImageModalIsOpen}
      />
    </>
  );
};

export default ImageMessage;

const wrapper = {
  p: '12px',
  pb: '22px',
};

const imageMessage = {
  maxHeight: '350px',
  maxWidth: '100%',
  borderRadius: '15px',
  cursor: 'pointer',
  background: 'white',
};
