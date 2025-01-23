import React, { useState } from 'react';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { handleGetHash } from '../../redux/actions/auditAction.js';

const DragAndDropInput = ({
  auditId,
  customerId,
  auditReportName,
  auditorId,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const dispatch = useDispatch();
  const formData = new FormData();
  const user = useSelector(state => state.user.user);
  const [error, setError] = useState(null);

  const handleDrag = event => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true);
    } else if (event.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleUploadFile = file => {
    const fileSize = file.size;
    if (fileSize > 10000000) {
      return setError('File size is too large');
    } else {
      formData.append('file', file);
      formData.append('path', user.id + user.current_role + file.name);
      formData.append('original_name', file.name);
      formData.append('private', 'true');
      formData.append('audit', auditId);
      formData.append('auditorId', auditorId);
      formData.append('customerId', customerId);
      formData.append('report_name', file.name);
      dispatch(handleGetHash(auditId, formData));
    }
  };

  const handleDrop = event => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      handleUploadFile(file);
    }
  };

  const handleChange = event => {
    handleUploadFile(event.target.files[0]);
  };

  return (
    <Box
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      style={{
        backgroundColor: dragActive ? '#f0f8ff' : '#fafafa',
        border: dragActive ? '2px solid #3f51b5' : '2px dashed #ccc',
        borderRadius: '10px',
        height: '50px',
        width: '250px',
        position: 'relative',
        bottom: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: dragActive ? '0px 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
      }}
    >
      <input
        type="file"
        multiple
        onChange={handleChange}
        style={{
          opacity: 0,
          position: 'absolute',
          height: '100%',
          width: '100%',
          cursor: 'pointer',
        }}
      />
      <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>
        {dragActive ? 'Release to upload...' : 'Drag or click to verify report'}
      </p>
    </Box>
  );
};

export default DragAndDropInput;
