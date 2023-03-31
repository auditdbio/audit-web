import React from "react";
import {Box, Button, Checkbox, Typography} from "@mui/material";
import Currency from "./icons/Currency.jsx";
import Star from "./icons/Star.jsx";
import theme, { radiusOfComponents } from "../styles/themes.js";
import {AUDITOR, DONE, SUBMITED} from "../redux/actions/types.js";
import { useNavigate } from "react-router-dom/dist";

const MyProjectListCard = ({ type, project }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (type === AUDITOR) {
            navigate(`/audit-request-offer/${project.id}`);
        } else {
            navigate("/edit-project", { state: { project } });
        }
    };

    return (
        <Box sx={cardWrapper}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: '20px'
                }}
            >
                <Typography variant={"h5"} textAlign={"center"}>
                    {project.name || project.project_name}
                </Typography>
                <Typography sx={categorySx}>{project?.tags?.map(el => el).join(', ') ?? ''}</Typography>
                <Box sx={priceWrapper}>
                    <Box sx={infoWrapper}>
                        <Currency />
                        <Typography>{project.price}</Typography>
                    </Box>
                    <Box sx={infoWrapper}>
                        <Star />
                        <Typography>150</Typography>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: '30px',
                }}
            >
                <Checkbox color={'success'} sx={checkBoxSx}/>
            </Box>
        </Box>
    );
};

export default MyProjectListCard;

const checkBoxSx = (theme) => ({
    '& .MuiSvgIcon-root': {
        width: '40px',
        height: '40px'
    },
})

const priceWrapper = (theme) => ({
    display: "flex",
    gap: "30px",
    [theme.breakpoints.down("md")]: {
        gap: "18px",
    },
});

const infoWrapper = (theme) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& p": {
        fontSize: "12px!important",
        marginLeft: "8px",
    },
    [theme.breakpoints.down("xs")]: {
        "& p": {
            fontSize: "10px!important",
        },
        "& svg": {
            width: "10px",
            height: "10px",
        },
    },
});

const categorySx = (theme) => ({
    textAlign: "center",
    fontSize: "12px!important",
    fontWeight: 500,
    color: "#434242",
    [theme.breakpoints.down("xs")]: {
        fontSize: "10px!important",
    },
});

const cardWrapper = (theme) => ({
    display: "flex",
    flexDirection: "column",
    padding: "20px 45px",
    height: '100%',
    boxShadow:
        "0px 64.1377px 76.5824px rgba(0, 0, 0, 0.07)," +
        " 0px 14.326px 17.1057px rgba(0, 0, 0, 0.0417275)," +
        "0px 8.03104px 9.5893px rgba(0, 0, 0, 0.035), " +
        "0px 4.26523px 5.09281px rgba(0, 0, 0, 0.0282725), " +
        "0px 1.77486px 2.11923px rgba(0, 0, 0, 0.0196802)",
    borderRadius: "25px",
    border: "1px solid rgba(67, 66, 66, 0.1)",
    alignItems: "center",
    "& h5": {
        fontSize: "18px",
        fontWeight: 500,
        lineHeight: "22px",
    },
    [theme.breakpoints.down("md")]: {
        padding: "33px 22px 24px",
    },
    [theme.breakpoints.down("xs")]: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: "15px 10px",
        "& h5": {
            fontSize: "14px",
            fontWeight: 500,
        },
    },
});