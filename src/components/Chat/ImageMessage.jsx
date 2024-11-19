import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Buffer } from 'buffer';
import { Box, Link } from '@mui/material';
import ImageModal from '../modal/ImageModal.jsx';
import { ASSET_URL } from '../../services/urls.js';

const ImageMessage = ({ message }) => {
  const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [imgName, setImgName] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');
    axios
      .get(`${ASSET_URL}/id/${message.text}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'arraybuffer',
      })
      .then(({ data, headers }) => {
        const contentDisposition = headers['content-disposition'];
        if (contentDisposition) {
          const fileName = contentDisposition.match(/filename="(.+)"/)?.[1];
          if (fileName) {
            setImgName(fileName);
          }
        }

        const img = `data:${headers['content-type']};base64,${Buffer.from(
          data,
          'binary',
        ).toString('base64')}`;
        setImgSrc(img);
      });
  }, []);

  return (
    <>
      <Box sx={wrapper}>
        {imgSrc && (
          <Link href={imgSrc} download={imgName}>
            <Box
              component="img"
              src={imgSrc}
              alt="chat-img"
              sx={imageMessage}
              onClick={() => setImageModalIsOpen(true)}
            />
          </Link>
        )}
      </Box>

      <ImageModal
        image={imgSrc}
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
