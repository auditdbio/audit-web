import React from 'react';
import {Box} from "@mui/material";
import theme from "../../styles/themes.js";

const InfoCard = ({children, role = 'customer'}) => {
    return (
        <Box sx={[cardWrapper, role === 'customer' ? customerStyle : auditorStyle ]}>
                {children}
        </Box>
    );
};

export default InfoCard;

const customerStyle = (theme) => ({
    border: `8px solid ${theme.palette.primary.main}`
})

const auditorStyle = (theme) => ({
    border: `8px solid ${theme.palette.secondary.main}`
})

const cardWrapper = (theme) => ({
    height: '100%',
    backgroundColor: theme.palette.background.default,
    borderRadius: '0px 0px 15px 15px',
    boxShadow: '0px 100px 80px rgba(0, 0, 0, 0.07), ' +
        '0px 41.7776px 33.4221px rgba(0, 0, 0, 0.0503198),' +
        ' 0px 22.3363px 17.869px rgba(0, 0, 0, 0.0417275), ' +
        '0px 12.5216px 10.0172px rgba(0, 0, 0, 0.035), ' +
        '0px 6.6501px 5.32008px rgba(0, 0, 0, 0.0282725), ' +
        '0px 2.76726px 2.21381px rgba(0, 0, 0, 0.0196802)',
        maxWidth: '1300px',
        minHeight: '530px',
        width: '100%',
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
        padding: '30px 40px'
    },
    [theme.breakpoints.down('xs')]: {
        minHeight: '400px'
    }
})
