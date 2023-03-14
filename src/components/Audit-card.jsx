import {Box, Card, Typography} from "@mui/material";
import theme from "../styles/themes.js";
import {CustomButton} from "./custom/Button.jsx";
import {useNavigate} from "react-router-dom/dist";
import {useDispatch} from "react-redux";
import {confirmAudit} from "../redux/actions/auditAction.js";
import {useMemo} from "react";
import {CUSTOMER, DONE, SUBMITED} from "../redux/actions/types.js";
import dayjs from "dayjs";


const AuditCard = ({audit}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    return (
        <Card sx={cardWrapper}>
            <Typography sx={auditNameStyle}>{audit.project_name}</Typography>
            <Typography sx={nameTextStyle}>{audit?.auditor_contacts?.email}</Typography>
            <Typography sx={priceTextStyle}>${audit?.price} per line</Typography>
            <Box sx={dateWrapper}>
                <Typography sx={dateStyle}>{dayjs(audit?.time?.begin).format('DD.MM.YYYY') }</Typography>
                <Typography variant={'caption'}>-</Typography>
                <Typography sx={dateStyle}>{dayjs(audit?.time?.end).format('DD.MM.YYYY') }</Typography>
            </Box>

            <Box sx={statusWrapper}>
                { audit.status !== SUBMITED &&
                    <>
                        { audit.status === DONE ?
                            <Box sx={{backgroundColor: '#52176D'}} /> :
                            audit.status === 'pending' &&
                            <Box sx={{backgroundColor: '#FF9900'}} />
                        }
                        { (audit.status !== 'pending' && audit.status !== DONE) &&
                            <Box sx={{backgroundColor: '#09C010'}} />
                        }
                    </>
                }
                <Typography>
                    {
                        !audit.status ? 'Waiting for audit' :
                            audit.status === DONE ? 'Finished' : audit.status === SUBMITED ? 'Submitted' : 'In progress'
                    }
                </Typography>
            </Box>
            { !audit.status &&
                <CustomButton sx={[acceptButtonStyle,
                    audit?.last_changer.toLowerCase() === CUSTOMER ? {backgroundColor: '#d7d7d7'} : {}]}
                              disabled={audit?.last_changer.toLowerCase() === CUSTOMER}
                onClick={() => dispatch(confirmAudit(audit))}>
                    Accept
                </CustomButton>
            }
            <CustomButton sx={viewButtonStyle} onClick={() => navigate(`/audit-info/${audit.id}`)}>View</CustomButton>
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
    fontSize: "14px!important",
    [theme.breakpoints.down("sm")]: {
        fontSize: "12px!important",
    },
};

const priceTextStyle = {
    fontWeight: "500",
    fontSize: "14px!important",
    [theme.breakpoints.down("sm")]: {
        fontSize: "11.5px!important",
    },
};

const auditNameStyle = {
    fontWeight: "500",
    fontSize: "18px!important",
    [theme.breakpoints.down("sm")]: {
        fontSize: "14px!important",
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
