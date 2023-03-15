import React, {useState} from 'react';
import {Box, Slider} from "@mui/material";
import {useField} from "formik";
import {useSelector} from "react-redux";
import {CUSTOMER} from "../../../redux/actions/types.js";

const SalarySlider = ({min = 0, max= 100, name}) => {
    const role = useSelector(s => s.user.user.current_role)
    const [taxField, ,taxFieldHelper] = useField(name)
    return (
        <Box sx={sliderWrapper} className={'salary-slider'}>
            <Slider
                value={+taxField.value}
                multiple
                name={taxField.name}
                valueLabelDisplay="off"
                sx={sliderSx}
                min={min}
                max={max}
                color={role === CUSTOMER ? "primary" : 'secondary'}
                onChange={(e) => taxFieldHelper.setValue(e.target.value.toString())}
            />
            <Box sx={infoWrapper}>
                {taxField.value || 0}
            </Box>
        </Box>
    );
};

export default SalarySlider;

export const sliderWrapper = (theme) => ({
    display: 'flex',
    gap: '34px'
})

const sliderSx = (theme) => ({
    height: '9px',
    '& .MuiSlider-track, .MuiSlider-rail': {
        backgroundColor: '#B9B9B9',
        border: 'none'
    }
})

const infoWrapper = (theme) => ({
    border: '1.42857px solid #E5E5E5',
    width: '100px',
    padding: '15px 0',
    textAlign: 'center'
})