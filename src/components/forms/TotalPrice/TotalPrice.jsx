import React, { useState } from 'react';
import { Box, Switch } from '@mui/material';
import SalarySlider from '../salary-slider/salary-slider.jsx';
import { useSelector } from 'react-redux';
import { CUSTOMER } from '../../../redux/actions/types.js';
import { useField } from 'formik';

const TotalPrice = () => {
  const currentRole = useSelector(s => s.user.user.current_role);
  const [field, fieldMeta, fieldHelper] = useField('total_cost');
  const [fieldPrice, fiel, priceHelper] = useField('price');
  const [isTotalCost, setIsTotalCost] = useState(!!field.value);
  const handleChangePriceToCost = () => {
    setIsTotalCost(!isTotalCost);
    if (isTotalCost) {
      fieldHelper.setValue(null);
    } else {
      priceHelper.setValue(null);
    }
  };

  return (
    <>
      <Box sx={priceLabelSx}>
        Price per line of code
        <Switch
          defaultChecked
          checked={isTotalCost}
          size="small"
          sx={{ marginX: '7px' }}
          color={currentRole === CUSTOMER ? 'primary' : 'secondary'}
          onChange={handleChangePriceToCost}
        />
        Total cost
      </Box>
      <SalarySlider
        max={isTotalCost ? 2000 : 100}
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
