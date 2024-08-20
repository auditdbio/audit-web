import React, { useEffect, useState } from 'react';
import { FastField, Form, Formik, useField } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  InputAdornment,
  Modal,
  Slider,
  Switch,
  Typography,
} from '@mui/material';
import { TextField } from 'formik-mui';
import { CUSTOMER, RESOLVED } from '../../redux/actions/types.js';
import EditIcon from '@mui/icons-material/Edit.js';
import {
  editAuditCustomer,
  editAuditRequestCustomer,
} from '../../redux/actions/auditAction.js';
import { useDispatch } from 'react-redux';
import SaveIcon from '@mui/icons-material/Save.js';
import { addTestsLabel } from '../../lib/helper.js';

const EditPrice = ({ role, audit, user, request, hideIcon, hideChange }) => {
  const [isTotalPrice, setIsTotalPrice] = useState(false);
  const [editPrice, setEditPrice] = useState(false);
  const [showComment, setShowComment] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (audit?.total_cost) {
      setIsTotalPrice(true);
    } else {
      setIsTotalPrice(false);
    }
  }, [audit]);

  return (
    <Formik
      initialValues={{
        id: audit?.id,
        price: audit?.price || audit?.total_cost,
        // total_cost: audit?.total_cost,
      }}
      onSubmit={values => {
        const newValue = {
          ...values,
          [!isTotalPrice ? 'price' : 'total_cost']: parseInt(values.price),
        };
        if (!isTotalPrice) {
          delete newValue.total_cost;
        } else {
          delete newValue.price;
        }
        if (!request) {
          dispatch(editAuditCustomer(newValue));
        } else {
          dispatch(editAuditRequestCustomer(newValue));
        }
        setEditPrice(false);
        setShowComment(false);
      }}
    >
      {({ handleSubmit, values, dirty }) => {
        return (
          <Form>
            <Box sx={salaryWrapper}>
              {/*<Box*/}
              {/*  sx={{*/}
              {/*    display: 'flex',*/}
              {/*    alignItems: 'center',*/}
              {/*    gap: '15px',*/}
              {/*  }}*/}
              {/*>*/}
              {/*  <svg*/}
              {/*    width="20"*/}
              {/*    height="20"*/}
              {/*    viewBox="0 0 26 26"*/}
              {/*    fill="none"*/}
              {/*    xmlns="http://www.w3.org/2000/svg"*/}
              {/*  >*/}
              {/*    <path*/}
              {/*      d="M13.2559 25.5499C20.2424 25.5499 25.9061 19.8862 25.9061 12.8997C25.9061 5.91319 20.2424 0.249512 13.2559 0.249512C6.26939 0.249512 0.605713 5.91319 0.605713 12.8997C0.605713 19.8862 6.26939 25.5499 13.2559 25.5499Z"*/}
              {/*      fill="#52176D"*/}
              {/*    />*/}
              {/*    <path*/}
              {/*      d="M13.257 4.64941L15.4702 9.71865L20.4071 10.5528L16.8321 14.4671L17.6833 20.0496L13.257 17.4188L8.83078 20.0496L9.68199 14.4671L6.10693 10.5528L11.0439 9.71865L13.257 4.64941Z"*/}
              {/*      fill="#FFCA28"*/}
              {/*    />*/}
              {/*  </svg>*/}
              {/*  150*/}
              {/*</Box>*/}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: '7px',
                    alignItems: 'center',
                  }}
                >
                  {!editPrice ? (
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '15px',
                        alignItems: 'center',
                      }}
                    >
                      {!hideIcon && (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 27 26"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.6131 0.249512C11.1111 0.249512 8.66532 0.991432 6.58501 2.38145C4.5047 3.77147 2.8833 5.74716 1.92583 8.05868C0.968372 10.3702 0.717856 12.9137 1.20597 15.3676C1.69408 17.8215 2.89889 20.0756 4.66805 21.8447C6.43721 23.6139 8.69125 24.8187 11.1451 25.3068C13.599 25.7949 16.1426 25.5444 18.4541 24.5869C20.7656 23.6295 22.7413 22.0081 24.1313 19.9278C25.5213 17.8474 26.2633 15.4017 26.2633 12.8997C26.2568 9.54663 24.922 6.33274 22.551 3.96177C20.18 1.59079 16.9661 0.255941 13.6131 0.249512ZM15.0727 18.7382H14.5862V19.7113C14.5862 19.9694 14.4836 20.2169 14.3012 20.3994C14.1187 20.5819 13.8712 20.6844 13.6131 20.6844C13.355 20.6844 13.1075 20.5819 12.925 20.3994C12.7425 20.2169 12.64 19.9694 12.64 19.7113V18.7382H10.6938C10.4357 18.7382 10.1882 18.6357 10.0057 18.4532C9.82324 18.2707 9.72071 18.0232 9.72071 17.7651C9.72071 17.5071 9.82324 17.2596 10.0057 17.0771C10.1882 16.8946 10.4357 16.7921 10.6938 16.7921H15.0727C15.4598 16.7921 15.8311 16.6383 16.1048 16.3645C16.3786 16.0908 16.5323 15.7195 16.5323 15.3324C16.5323 14.9453 16.3786 14.574 16.1048 14.3003C15.8311 14.0266 15.4598 13.8728 15.0727 13.8728H12.1534C11.2502 13.8728 10.3839 13.514 9.74516 12.8752C9.10645 12.2365 8.74762 11.3702 8.74762 10.467C8.74762 9.56369 9.10645 8.6974 9.74516 8.05869C10.3839 7.41997 11.2502 7.06115 12.1534 7.06115H12.64V6.08806C12.64 5.82998 12.7425 5.58247 12.925 5.39998C13.1075 5.21749 13.355 5.11497 13.6131 5.11497C13.8712 5.11497 14.1187 5.21749 14.3012 5.39998C14.4836 5.58247 14.5862 5.82998 14.5862 6.08806V7.06115H16.5323C16.7904 7.06115 17.0379 7.16367 17.2204 7.34616C17.4029 7.52865 17.5054 7.77616 17.5054 8.03424C17.5054 8.29232 17.4029 8.53983 17.2204 8.72232C17.0379 8.90481 16.7904 9.00733 16.5323 9.00733H12.1534C11.7663 9.00733 11.3951 9.16111 11.1213 9.43485C10.8476 9.70858 10.6938 10.0798 10.6938 10.467C10.6938 10.8541 10.8476 11.2253 11.1213 11.4991C11.3951 11.7728 11.7663 11.9266 12.1534 11.9266H15.0727C15.976 11.9266 16.8423 12.2854 17.481 12.9241C18.1197 13.5629 18.4785 14.4291 18.4785 15.3324C18.4785 16.2357 18.1197 17.102 17.481 17.7407C16.8423 18.3794 15.976 18.7382 15.0727 18.7382Z"
                            fill="#FF9900"
                          />
                        </svg>
                      )}
                      <Typography sx={{ fontWeight: 500 }}>
                        {values.price}{' '}
                        {audit?.total_cost ? 'total cost' : 'per line'}
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '7px',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '7px',
                          alignItems: 'center',
                        }}
                      >
                        <Typography>per line</Typography>
                        <Switch
                          color={
                            user.current_role === CUSTOMER
                              ? 'primary'
                              : 'secondary'
                          }
                          checked={isTotalPrice}
                          onChange={(e, newValue) => {
                            setIsTotalPrice(newValue);
                          }}
                          inputProps={{
                            'aria-label': 'controlled',
                          }}
                        />
                        <Typography>total cost</Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '7px',
                        }}
                      >
                        <FastField
                          component={TextField}
                          name={'price'}
                          disabled={false}
                          sx={{
                            width: 'auto',
                            maxWidth: '140px',
                            fontWeight: 500,
                            '& .MuiOutlinedInput-root': {
                              paddingLeft: '10px',
                            },
                            '& input': {
                              padding: '3.5px 0',
                            },
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                        />
                        {editPrice && (
                          <Button
                            onClick={() => {
                              if (dirty) {
                                setShowComment(true);
                              } else {
                                setEditPrice(false);
                              }
                            }}
                          >
                            <SaveIcon
                              color={
                                user.current_role === CUSTOMER
                                  ? 'primary'
                                  : 'secondary'
                              }
                              fontSize={'small'}
                            />
                          </Button>
                        )}
                      </Box>
                    </Box>
                  )}
                  <Modal
                    open={showComment}
                    onClose={() => setShowComment(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100%',
                        maxWidth: '650px',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: '10px',
                        p: 2,
                      }}
                    >
                      <FastField
                        component={TextField}
                        name={'comment'}
                        // label={label}
                        placeholder={'Add a comment'}
                        fullWidth={true}
                        disabled={false}
                        maxRows={4}
                        multiline={true}
                        rows={4}
                        inputProps={{ ...addTestsLabel(`comment-input`) }}
                      />
                      <Button
                        sx={{
                          mt: '15px',
                          marginLeft: 'auto',
                          marginRight: 0,
                          display: 'block',
                          textTransform: 'unset',
                        }}
                        variant={'contained'}
                        onClick={handleSubmit}
                      >
                        Save
                      </Button>
                    </Box>
                  </Modal>
                  {!hideChange &&
                    !editPrice &&
                    audit?.status.toLowerCase() !== RESOLVED.toLowerCase() && (
                      <Button
                        sx={{ minWidth: 'unset' }}
                        onClick={() => setEditPrice(!editPrice)}
                      >
                        <EditIcon
                          color={
                            user.current_role === CUSTOMER
                              ? 'primary'
                              : 'secondary'
                          }
                          fontSize={'small'}
                        />
                      </Button>
                    )}
                </Box>
              </Box>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EditPrice;

const salaryWrapper = {
  display: 'flex',
  gap: '20px',
  fontSize: '16px',
  fontWeight: 500,
};

const sliderSx = {
  height: '9px',
  '& .MuiSlider-track, .MuiSlider-rail': {
    backgroundColor: '#B9B9B9',
    border: 'none',
  },
};
