import React, {useState} from 'react';
import {Box, Slider} from "@mui/material";

const SalarySlider = () => {
    const [amount, setAmount] = useState(30)
    return (
        <Box sx={sliderWrapper}>
            <Slider
                defaultValue={amount}
                valueLabelDisplay="off"
                sx={sliderSx}
                onChange={(e) => setAmount(e.target.value)}
            />
            <Box sx={infoWrapper}>
                {amount}
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