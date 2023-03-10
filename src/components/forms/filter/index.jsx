import React from 'react';
import {Formik, Form} from 'formik'
import {Box, Button, IconButton, InputAdornment} from "@mui/material";
import {Field} from "formik";
import {TextField} from "formik-mui";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const Filter = () => {
    return (
        <Formik
            initialValues={{}}
            validationSchema={{}}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={(values) => {
                console.log(values)
            }}
        >
            {({handleSubmit}) => {
                return (
                    <Form>
                      <Box>
                          <Box sx={headerWrapper}>
                              <Field
                                  component={TextField}
                                  name={'tags'}
                                  disabled={false}
                                  size={'small'}
                                  InputProps={{
                                      endAdornment: (
                                          <InputAdornment position="end">
                                              <IconButton edge="end" color="disabled">
                                                  <SearchOutlinedIcon />
                                              </IconButton>
                                          </InputAdornment>
                                      ),
                                  }}
                              />
                              <Button variant={'contained'} color={'secondary'} sx={filterButton}>
                                  All filters
                              </Button>
                          </Box>
                      </Box>
                    </Form>
                )
            }}
        </Formik>
    );
};

export default Filter;

const headerWrapper = (theme) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '22px',
})

const filterButton = (theme) => ({
    fontSize: '12px',
    padding: '14px 0',
    width: '160px',
    textTransform: 'unset',
})