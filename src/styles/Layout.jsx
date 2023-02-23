import React from 'react';
import {ContentWrapper} from "./themes.js";
import Header from "../components/header/Header.jsx";
import Box from "@mui/material/Box";

const Layout = ({children, sx}) => {
    return (
        <ContentWrapper>
            <Header/>
            <Box sx={[layoutStyle, sx]}>
                {children}
            </Box>
        </ContentWrapper>
    );
};

export default Layout;

const layoutStyle = (theme) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '120px 100px',
    [theme.breakpoints.down('sm')]: {
        padding: '60px 30px',
    },
    [theme.breakpoints.down('xs')]: {
        padding: '40px 30px'
    },
    [theme.breakpoints.down(450)]: {
        padding: '40px 10px'
    }
})