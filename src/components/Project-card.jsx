import React from 'react';
import {Box, Button, Typography} from "@mui/material";
import Currency from "./icons/Currency.jsx";
import Star from "./icons/Star.jsx";
import {radiusOfComponents} from "../styles/themes.js";

const ProjectCard = ({type}) => {
    return (
        <Box sx={cardWrapper}>
            <Typography variant={'h5'} sx={{fontWeight: 500}}>
                AuditBD
            </Typography>
            <Typography sx={categorySx}>
                Criptography,  Games
            </Typography>
            <Box sx={{display: 'flex', justifyContent: 'space-between', gap: '40px'}}>
                <Box sx={infoWrapper}>
                    <Currency/>
                    <Typography>3.1 K</Typography>
                </Box>
                <Box sx={infoWrapper}>
                    <Star/>
                    <Typography>150</Typography>
                </Box>
            </Box>
            <Box sx={statusWrapper}>
                <Box/>
                <Typography>Waiting audit</Typography>
            </Box>
            <Button variant={'contained'} sx={[editButton, type === 'auditor' ? editAuditor : {}]}>
                Edit
            </Button>
            <Button sx={{textTransform: 'none'}}>
                Make a copy
            </Button>
        </Box>
    );
};

export default ProjectCard;

const statusWrapper = (theme) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
    '& p': {
      fontSize: '14px',
      fontWeight: 500
    },
    '& div': {
        width: '17px',
        height: '17px',
        borderRadius: '50%',
        backgroundColor: '#09C010'
    },
    margin: '40px 0 18px'
})

const editButton = (theme) => ({
    fontSize: '21px',
    fontWeight: 600,
    lineHeight: '25px',
    width: '100%',
    textTransform: 'none',
    borderRadius: radiusOfComponents,
    gap: '40px',
    padding: '11px 0'
})

const editAuditor = (theme) => ({
    backgroundColor: theme.palette.secondary.main,
    '&:hover': {
        backgroundColor: '#450e5d'
    }
})

const infoWrapper = (theme) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& p': {
        fontSize: '18px!important',
        marginLeft: '18px'
    }
})

const categorySx = (theme) => ({
    textAlign: 'center',
    fontSize: '18px!important',
    fontWeight: 500,
    margin: '7px 0 7px'
})

const cardWrapper = (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: '31px 48px 37px',
    boxShadow: '0px 64.1377px 76.5824px rgba(0, 0, 0, 0.07),' +
        ' 0px 14.326px 17.1057px rgba(0, 0, 0, 0.0417275),' +
        '0px 8.03104px 9.5893px rgba(0, 0, 0, 0.035), ' +
        '0px 4.26523px 5.09281px rgba(0, 0, 0, 0.0282725), ' +
        '0px 1.77486px 2.11923px rgba(0, 0, 0, 0.0196802)',
    borderRadius: '25px',
    border: '1px solid rgba(67, 66, 66, 0.1)',
    alignItems: 'center',
    width: '283px',
    marginBottom: '40px'
})