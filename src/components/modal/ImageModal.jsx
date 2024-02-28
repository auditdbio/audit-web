import React from 'react';
import { Box, Modal } from '@mui/material';

const ImageModal = ({ isOpen, setIsOpen, image }) => {
  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      <Box
        component="img"
        sx={style}
        src={image}
        alt="img"
        onClick={() => setIsOpen(false)}
      />
    </Modal>
  );
};

export default ImageModal;

const style = theme => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '80%',
  background: 'white',
  [theme.breakpoints.down('xs')]: {
    maxWidth: '90%',
  },
});
