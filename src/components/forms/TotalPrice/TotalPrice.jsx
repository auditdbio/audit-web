import React, { useState } from 'react';
import { Box, Switch } from '@mui/material';
import SalarySlider from '../salary-slider/salary-slider.jsx';
import { useSelector } from 'react-redux';
import { CUSTOMER } from '../../../redux/actions/types.js';
import { useField } from 'formik';

const TotalPrice = () => {
  const currentRole = useSelector(s => s.user.user.current_role);
  const [, , TotalCostHelper] = useField('total_cost');
  const [priceField, , priceHelper] = useField('price');
  const [isTotalCost, setIsTotalCost] = useState(!priceField.value);

  const handleChangePriceToCost = () => {
    setIsTotalCost(!isTotalCost);
    if (isTotalCost) {
      TotalCostHelper.setValue(null);
    } else {
      priceHelper.setValue(null);
    }
  };

  return (
    <>
      <Box sx={priceLabelSx}>
        Price per line of code
        <Switch
          checked={isTotalCost}
          size="small"
          sx={{ marginX: '7px' }}
          color={currentRole === CUSTOMER ? 'primary' : 'secondary'}
          onChange={handleChangePriceToCost}
        />
        Total cost
      </Box>
      <SalarySlider
        max={isTotalCost ? 500000 : 1000}
        name={isTotalCost ? 'total_cost' : 'price'}
      />
    </>
  );
};

export default TotalPrice;

const priceLabelSx = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px',
  fontWeight: 500,
  color: '#B3B3B3',
};
