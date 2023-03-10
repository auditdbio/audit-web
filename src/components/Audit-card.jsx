import { Box, Card, Typography } from "@mui/material";
import theme from "../styles/themes.js";
import {CustomButton} from "./custom/Button.jsx";
import {useNavigate} from "react-router-dom/dist";


const AuditCard = ({audit}) => {
    const navigate = useNavigate()

    return (
        <Card sx={cardWrapper}>
            <Typography sx={auditNameStyle}>{audit.name}</Typography>
            <Typography sx={nameTextStyle}>Mishail Soronikov</Typography>
            <Typography sx={priceTextStyle}>20 $ per stroke</Typography>
            <Box sx={dateWrapper}>
                <Typography sx={dateStyle}>10.01.2023</Typography>
                <Typography variant={'caption'}>-</Typography>
                <Typography sx={dateStyle}>10.01.2023</Typography>
            </Box>

            <Box sx={statusWrapper}>
                <Box />
                <Typography>{audit.source}</Typography>
            </Box>
            <CustomButton sx={acceptButtonStyle}>Accept</CustomButton>
            <CustomButton sx={viewButtonStyle} onClick={() => navigate('/audit-info')}>View</CustomButton>
        </Card>
    );
};

const cardWrapper = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#FFFFFF",
    padding: '34px 18px 25px',
    borderRadius: "1.5rem",
    gap: '15px',
    boxShadow:
        "0px 64.1377px 76.5824px rgba(0, 0, 0, 0.07)," +
        " 0px 14.326px 17.1057px rgba(0, 0, 0, 0.0417275)," +
        "0px 8.03104px 9.5893px rgba(0, 0, 0, 0.035), " +
        "0px 4.26523px 5.09281px rgba(0, 0, 0, 0.0282725), " +
        "0px 1.77486px 2.11923px rgba(0, 0, 0, 0.0196802)",
    [theme.breakpoints.down("sm")]: {
        padding: '18px 12px',
        gap: '10px'
    },
};

const acceptButtonStyle = {
    backgroundColor: "#52176D",
    color: "white",
    fontSize: '15px!important',
    padding: '13px 58px',
    width: '170px',
    height: '44px',
    ":hover": { backgroundColor: "#52176D", color: "white" },
    [theme.breakpoints.down("sm")]: {
        fontSize: "12px!important",
        width: '105px',
        height: '28px',
        borderRadius: '8px',
        padding: '6px 30px'
    },
};

const viewButtonStyle = {
    backgroundColor: "orange",
    color: "white",
    fontSize: '15px!important',
    padding: '13px 58px',
    width: '170px',
    height: '44px',
    ":hover": { backgroundColor: "orange", color: "white" },
    [theme.breakpoints.down("sm")]: {
        fontSize: "12px!important",
        width: '105px',
        height: '28px',
        borderRadius: '8px',
        padding: '6px 30px'
    },
};

const statusWrapper = (theme) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    width: "100%",
    "& p": {
        fontSize: "10px",
        fontWeight: 500,
        [theme.breakpoints.down("sm")]: {
            fontSize: "8px",
        },
    },
    "& div": {
        width: "17px",
        height: "17px",
        borderRadius: "50%",
        backgroundColor: "#09C010",
        [theme.breakpoints.down("sm")]: {
            width: "10px",
            height: "10px",
        },
    },
    margin: "0",
});

const nameTextStyle = {
    color: "#152BEA",
    fontWeight: "500",
    fontSize: "14px",
    [theme.breakpoints.down("sm")]: {
        fontSize: "12px",
    },
};

const priceTextStyle = {
    fontWeight: "500",
    fontSize: "14px",
    [theme.breakpoints.down("sm")]: {
        fontSize: "11.5px",
    },
};

const auditNameStyle = {
    fontWeight: "500",
    fontSize: "18px",
    [theme.breakpoints.down("sm")]: {
        fontSize: "14px",
    },
};

const dateWrapper = {
    display: "flex",
    flexDirection: "row",
    gap: "0.5rem",
    alignItems: "center",
    [theme.breakpoints.down('sm')]: {
        gap: '5px',
        '& span': {
            fontSize: '8px'
        }
    }
};

const dateStyle = {
    fontSize: "11px!important",
    fontWeight: 500,
    color: "#434242",
    border: "1.8px #E5E5E5 solid",
    padding: "1rem",
    [theme.breakpoints.down("sm")]: {
        fontSize: "9px!important",
        padding: '10px'
    },
    [theme.breakpoints.down('xs')]: {
        padding: '8px'
    },
    [theme.breakpoints.down(450)]: {
        padding: '5px'
    }
};
export default AuditCard;
