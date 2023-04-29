import {Alert, AlertTitle, Box, Card, Modal, Snackbar, Stack, Tooltip, Typography} from "@mui/material";
import theme from "../../../styles/themes";
import {CustomButton} from "../../custom/Button";
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import ProjectModal from "../../ProjectModal.jsx";
import AuditRequestInfo from "../../audit-request-info.jsx";

const PublicProjectCard = ({project}) => {
    const navigate = useNavigate();
    const [message, setMessage] = useState(null)
    const [openModal, setOpenModal] = useState(false);
    const handleView = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleError = () => {
        setMessage('Switched to auditor role')
    }

    return (
        <Card sx={cardWrapper}>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={modalWrapper}>
                    <AuditRequestInfo
                        onClose={handleCloseModal}
                        project={project}
                        handleError={handleError}
                        isModal={true}
                        redirect={true}

                    />
                </Box>
            </Modal>
            <Tooltip title={project.name}
                     arrow placement={'top'}>
                <Typography sx={auditNameStyle}>{project.name}</Typography>
            </Tooltip>
            <Box sx={{display: 'grid'}}>
                <Tooltip title={project.creator_contacts.email}
                         arrow placement={'top'}>
                    <Typography noWrap={true} sx={nameTextStyle}>{project.creator_contacts.email}</Typography>
                </Tooltip>
            </Box>
            <Tooltip
                title={project?.tags?.map(el => el).join(', ') ?? ''}
                arrow placement={'top'}
            >
            <Typography sx={modalSubheader}>
                {project.tags
                    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
                    .join(", ")}
            </Typography>
            </Tooltip>
            <Snackbar
                autoHideDuration={3000}
                open={!!message}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                onClose={() => setMessage(null)}
            >
                <Stack sx={{width: '100%', flexDirection: 'column', gap: 2}} spacing={2}>
                    <Alert severity='success'>
                        <AlertTitle>{message}</AlertTitle>
                    </Alert>
                </Stack>
            </Snackbar>
            <Box sx={statusWrapper}>
                <Box/>
                <Typography>{project.publish_options.publish ? 'Published' : 'Private'}</Typography>
            </Box>
            {/*<CustomButton sx={acceptButtonStyle}>Accept</CustomButton>*/}
            <CustomButton
                sx={viewButtonStyle}
                // onClick={() => navigate(`/audit-request/${project.id}`)}
                onClick={handleView}
            >
                {" "}
                View{" "}
            </CustomButton>
        </Card>
    );
};

const modalWrapper = (theme) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    height: '90%',
    overflow: 'auto',
    borderRadius: '14px',
    '& .audit-request-wrapper': {
        gap: '5px',
        paddingX: '44px',
    },
    [theme.breakpoints.down('md')]: {
        '& .audit-request-wrapper': {
            paddingX: '20px',
        }
    },
    [theme.breakpoints.down('xs')]: {
        width: 360,
    }
})

const cardWrapper = (theme) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#FFFFFF",
    width: "100%",
    height: "100%",
    // maxWidth: "340px",
    // maxHeight: "450px",
    gap: "1.5rem",
    // marginY: "1.5rem",
    borderRadius: "1.5rem",
    boxShadow:
        "0px 64.1377px 76.5824px rgba(0, 0, 0, 0.07)," +
        " 0px 14.326px 17.1057px rgba(0, 0, 0, 0.0417275)," +
        "0px 8.03104px 9.5893px rgba(0, 0, 0, 0.035), " +
        "0px 4.26523px 5.09281px rgba(0, 0, 0, 0.0282725), " +
        "0px 1.77486px 2.11923px rgba(0, 0, 0, 0.0196802)",
    [theme.breakpoints.down("xs")]: {
        gap: '15px',
        padding: '14px'
    },
})

const acceptButtonStyle = {
    backgroundColor: "#52176D",
    color: "white",
    ":hover": {backgroundColor: "#52176D", color: "white"},
    [theme.breakpoints.down("sm")]: {
        fontSize: "13px",
    },
};

const viewButtonStyle = {
    backgroundColor: "orange",
    color: "white",
    ":hover": {backgroundColor: "orange", color: "white"},
    [theme.breakpoints.down("sm")]: {
        fontSize: "13px",
    },
};

const statusWrapper = (theme) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    width: "100%",
    "& p": {
        fontSize: "14px",
        fontWeight: 500,
        textAlign: "center",
        [theme.breakpoints.down("sm")]: {
            fontSize: "10px",
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
    fontSize: "23px",
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
        fontSize: "14px",
    },
    [theme.breakpoints.down("xs")]: {
        fontSize: "10px",
    },
};

const priceTextStyle = {
    fontWeight: "500",
    fontSize: "23px",
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
        fontSize: "14px",
    },
};

const auditNameStyle = (theme) => ({
    display: "-webkit-box",
    "-webkit-line-clamp": '1',
    "-webkit-box-orient": "vertical",
    textOverflow: "ellipsis",
    overflow: "hidden",
    fontWeight: "500",
    fontSize: "28px",
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
        fontSize: "14px",
    },
})

const dateWrapper = {
    display: "flex",
    flexDirection: "row",
    gap: "0.5rem",
    alignItems: "center",
};

const dateStyle = {
    fontSize: "18px",
    fontWeight: "500",
    color: "#434242",
    border: "1.8px #E5E5E5 solid",
    padding: "1rem",
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
        fontSize: "10px",
        padding: "0.3rem",
    },
};
const modalSubheader = {
    height: '110px',
    overflow: 'hidden',
    '-webkit-line-clamp': '3',
    '-webkit-box-orient': 'vertical',
    'text-overflow': 'ellipsis',
    display: '-webkit-box',
    textAlign: "center",
    fontSize: {
        zero: "10px",
        sm: "16px",
        md: "22px",
        lg: "25px",
    },
    fontWeight: "400",
    [theme.breakpoints.down('lg')]: {
        height: '100px'
    },
    [theme.breakpoints.down('md')]: {
        height: '72px'
    },
    [theme.breakpoints.down('sm')]: {
        height: '45px'
    },
};
export default PublicProjectCard;
