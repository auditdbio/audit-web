import { Box, Slider, Typography } from "@mui/material";
import React from "react";

export const SliderRange = ({ min, max, value, onChange, label, sx }) => {
    return (
        <Box>
            <Typography variant={"body2"} sx={formLabelSx}>
                {label}
            </Typography>
            <Box sx={sliderWrapper} className={"salary-slider"}>
                <Slider
                    range={"true"}
                    min={min}
                    max={max}
                    value={[value?.from, value?.to]}
                    onChange={onChange}
                    sx={{
                        ...sliderSx,
                        ...sx,
                    }}
                    // trackStyle={{ backgroundColor: "#007aff" }}
                    // handleStyle={{
                    //   borderColor: "#007aff",
                    //   backgroundColor: "#007aff",
                    // }}
                    // railStyle={{ backgroundColor: "#b7b7b7" }}
                />
                <Box sx={infoWrapper}>
                    {value.from}-{value.to} $
                </Box>
            </Box>
        </Box>
    )
};

export const sliderWrapper = () => ({
  display: "flex",
  gap: "34px",
    alignItems: 'center'
});

const sliderSx = () => ({
  height: "9px",
  "& .MuiSlider-track, .MuiSlider-rail": {
    backgroundColor: "#B9B9B9",
    border: "none",
  },
});
const infoWrapper = () => ({
  border: "1.42857px solid #E5E5E5",
  width: "100px",
  padding: "15px 0",
  textAlign: "center",
    fontSize: '12px'
});

const formLabelSx = (theme) => ({
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "24px",
  color: "#434242",
  [theme.breakpoints.down("lg")]: {
    fontSize: "14px",
  },
});
