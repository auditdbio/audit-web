import React, { useEffect, useRef } from 'react';
import { Typography } from '@mui/material';

const NotificationMessage = ({ sx, id, innerData }) => {
  const messageRef = useRef(null);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.innerHTML = innerData;
    }
  }, [messageRef, innerData]);

  return <Typography sx={sx} id={id} ref={messageRef}></Typography>;
};

export default NotificationMessage;
