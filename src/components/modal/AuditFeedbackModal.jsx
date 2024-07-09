import React from 'react';
import { Form, Formik } from 'formik';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Typography,
  Rating,
} from '@mui/material';
import { addTestsLabel } from '../../lib/helper.js';

const AuditFeedbackModal = ({
  isOpen,
  handleSend = () => {},
  handleClose,
  feedback,
  readOnly = false,
}) => {
  const initialValues = feedback
    ? { ...feedback.rating }
    : {
        quality_of_work: null,
        time_management: null,
        collaboration: null,
      };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Formik initialValues={initialValues} onSubmit={handleSend}>
        {({ handleSubmit, values, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <DialogTitle sx={{ padding: '16px 70px', textAlign: 'center' }}>
              {readOnly ? 'Feedback' : 'Leave feedback'}
            </DialogTitle>
            <DialogContent sx={{ width: '400px' }}>
              <Box>
                <Box sx={ratingField}>
                  <Typography component="legend" sx={ratingTitle}>
                    Quality of work
                  </Typography>
                  <Rating
                    name="quality_of_work"
                    value={values.quality_of_work}
                    readOnly={readOnly}
                    onChange={(e, v) => {
                      setFieldValue('quality_of_work', v);
                    }}
                  />
                </Box>
                <Box sx={ratingField}>
                  <Typography component="legend" sx={ratingTitle}>
                    Time management
                  </Typography>
                  <Rating
                    name="time_management"
                    value={values.time_management}
                    readOnly={readOnly}
                    onChange={(e, v) => setFieldValue('time_management', v)}
                  />
                </Box>
                <Box sx={ratingField}>
                  <Typography component="legend" sx={ratingTitle}>
                    Collaboration
                  </Typography>
                  <Rating
                    name="collaboration"
                    value={values.collaboration}
                    readOnly={readOnly}
                    onChange={(e, v) => setFieldValue('collaboration', v)}
                  />
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'flex-end', padding: '15px' }}>
              <Button
                onClick={handleClose}
                variant="contained"
                color="primary"
                {...addTestsLabel('close-button')}
              >
                Close
              </Button>
              {!readOnly && (
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  autoFocus
                  {...addTestsLabel('send-button')}
                >
                  Send
                </Button>
              )}
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AuditFeedbackModal;

const ratingField = theme => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: '8px',
  '& > .MuiRating-root': {
    color: theme.palette.primary.main,
  },
});

const ratingTitle = {
  fontSize: '16px',
};
