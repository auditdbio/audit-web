import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined.js';
import { useField } from 'formik';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ASSET_URL } from '../../../services/urls.js';
import CustomSnackbar from '../../custom/CustomSnackbar.jsx';
import { addTestsLabel } from '../../../lib/helper.js';
import {
  AUDIT_PARENT_ENTITY,
  REPORT_ENTITY,
} from '../../../services/file_constants.js';

const AuditUpload = ({
  name,
  disabled,
  auditId,
  auditorId,
  auditReportName,
  customerId,
}) => {
  const [_, meta, fieldHelper] = useField(name);
  const [originalFileName, setOriginalFileName] = useState(
    auditReportName || '',
  );
  const formData = new FormData();
  const [error, setError] = useState(null);

  const handleUpdateAudit = e => {
    const file = e.target.files[0];
    const fileSize = file.size;
    if (fileSize > 10_000_000) {
      return setError('File size is too large');
    } else {
      formData.append('file', file);
      formData.append('private', 'true');
      formData.append('auditorId', auditorId);
      formData.append('customerId', customerId);
      formData.append('file_entity', REPORT_ENTITY);
      formData.append('parent_entity_id', auditId);
      formData.append('parent_entity_source', AUDIT_PARENT_ENTITY);
      axios
        .post(ASSET_URL, formData, {
          headers: { Authorization: 'Bearer ' + Cookies.get('token') },
        })
        .then(({ data }) => {
          setOriginalFileName(`${data.original_name}.${data.extension}`);
          fieldHelper.setValue(data.id);
        })
        .catch(err => {
          if (err?.code === 'ERR_NETWORK') {
            setError('File size is too big');
          } else {
            setError('Error while uploading file');
          }
        })
        .finally(() => {
          formData.delete('file');
          formData.delete('private');
          formData.delete('auditorId');
          formData.delete('customerId');
          formData.delete('file_entity');
          formData.delete('parent_entity_id');
          formData.delete('parent_entity_source');
        });
    }
  };
  return (
    <>
      <Box sx={[inputWrapper, meta.error ? { borderColor: '#f44336' } : {}]}>
        {originalFileName}
      </Box>
      <CustomSnackbar
        autoHideDuration={10000}
        open={!!error}
        onClose={() => setError(null)}
        severity="error"
        text={error}
      />

      <Button disabled={disabled} {...addTestsLabel('upload-audit-button')}>
        <label htmlFor="audit-upload">
          <CreateNewFolderOutlinedIcon fontSize="large" color="disabled" />
        </label>
      </Button>
      <input
        id="audit-upload"
        style={{ display: 'none' }}
        accept="application/pdf"
        onChange={handleUpdateAudit}
        type="file"
      />
    </>
  );
};

export default AuditUpload;

const inputWrapper = theme => ({
  border: '1.43062px solid #E5E5E5',
  width: '400px',
  padding: '15px',
  marginRight: '10px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  [theme.breakpoints.down('sm')]: {
    width: '250px',
    overflow: 'hidden',
    whiteSpace: 'noWrap',
  },
  [theme.breakpoints.down('xs')]: {
    width: '200px',
  },
});
