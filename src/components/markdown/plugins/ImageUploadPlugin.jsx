import React, { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ASSET_URL } from '../../../services/urls.js';

const ImageUploadPlugin = ({ editor }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const formData = new FormData();

  const handleClickIcon = () => {
    setShowMenu(prev => !prev);
  };

  const handleUploadImage = file => {
    const token = Cookies.get('token');
    const path = +new Date() + file.name;

    if (file) {
      formData.append('file', file);
      formData.append('path', path);
      formData.append('original_name', file.name);
      formData.append('private', 'false');
    }

    axios
      .post(ASSET_URL, formData, {
        headers: { Authorization: 'Bearer ' + token },
      })
      .then(() => {
        editor.insertText(
          `![](${ASSET_URL}/${path.replace(/ /g, '%20')} "image")`,
        );
        setFile(null);
        setShowMenu(false);
        formData.delete('file');
        formData.delete('path');
        formData.delete('original_name');
        formData.delete('private');
      })
      .catch(() => {
        setFile(null);
        setError('Error while uploading file');
        formData.delete('file');
        formData.delete('path');
        formData.delete('original_name');
        formData.delete('private');
      });
  };

  const handleSelectImage = e => {
    setError(() => '');
    setFile(() => null);
    const currentFile = e.target.files[0];
    if (currentFile.size > 10_000_000) {
      setError(() => 'Image size is too large');
      return;
    } else if (!currentFile.type.includes('image')) {
      setError(() => 'Images only');
      return;
    }
    setFile(() => currentFile);

    handleUploadImage(currentFile);
  };

  const handleCancel = () => {
    setError(() => '');
    setFile(() => null);
    setShowMenu(() => false);
    formData.delete('file');
    formData.delete('path');
    formData.delete('original_name');
    formData.delete('private');
  };

  const handleDrop = e => {
    e.preventDefault();
    setError(() => '');
    setFile(() => null);
    const { files } = e.dataTransfer;
    if (!files[0]?.type.includes('image')) {
      setError(() => 'Images only');
      return;
    }
    if (files.length > 0) {
      setFile(() => files[0]);
    }
    handleUploadImage(files[0]);
  };

  const handleDragOver = e => {
    e.preventDefault();
  };

  return (
    <span
      className="button"
      onClick={handleClickIcon}
      style={{
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 298.73 298.73"
        width="16"
        height="16"
        fill="#757575"
        xmlSpace="preserve"
      >
        <g>
          <path
            fill="#757575"
            d="M264.959,9.35H33.787C15.153,9.35,0,24.498,0,43.154v212.461c0,18.634,15.153,33.766,33.787,33.766
		h231.171c18.634,0,33.771-15.132,33.771-33.766V43.154C298.73,24.498,283.593,9.35,264.959,9.35z M193.174,59.623
		c18.02,0,32.634,14.615,32.634,32.634s-14.615,32.634-32.634,32.634c-18.025,0-32.634-14.615-32.634-32.634
		S175.149,59.623,193.174,59.623z M254.363,258.149H149.362H49.039c-9.013,0-13.027-6.521-8.964-14.566l56.006-110.93
		c4.058-8.044,11.792-8.762,17.269-1.605l56.316,73.596c5.477,7.158,15.05,7.767,21.386,1.354l13.777-13.951
		c6.331-6.413,15.659-5.619,20.826,1.762l35.675,50.959C266.487,252.16,263.376,258.149,254.363,258.149z"
          />
        </g>
      </svg>

      {showMenu && (
        <div
          onClick={e => e.stopPropagation()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={uploadMenuStyle}
        >
          <input
            id="image-upload"
            style={{ display: 'none' }}
            accept="image/png, image/jpeg, image/bmp, image/gif, image/svg+xml"
            onChange={handleSelectImage}
            type="file"
          />
          <div style={filenameStyle}>
            {error ? (
              <span style={{ color: 'red' }}>{error}</span>
            ) : (
              <span>{file?.name || 'Select or drag an image'}</span>
            )}
          </div>
          <button style={uploadButtonStyle} type="button">
            <label style={{ cursor: 'pointer' }} htmlFor="image-upload">
              Select image
            </label>
          </button>
          <button
            type="button"
            style={uploadButtonStyle}
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      )}
    </span>
  );
};

const uploadMenuStyle = {
  position: 'absolute',
  top: 25,
  zIndex: 30,
  width: '300px',
  height: '115px',
  padding: '6px',
  border: '1px solid #e0e0e0',
  background: 'white',
  cursor: 'default',
};

const filenameStyle = {
  border: '1px solid #E5E5E5',
  width: '285px',
  height: '50px',
  padding: '8px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const uploadButtonStyle = {
  background: '#f5f5f5',
  border: '1px solid #E5E5E5',
  padding: '3px 10px',
  margin: '15px 10px 0 0',
  cursor: 'pointer',
};

ImageUploadPlugin.align = 'left';
ImageUploadPlugin.pluginName = 'image-upload';

export default ImageUploadPlugin;
