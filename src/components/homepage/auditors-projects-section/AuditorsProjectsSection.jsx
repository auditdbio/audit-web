import {Box, Divider} from "@mui/material";
import theme from "../../../styles/themes";

import AuditorSection from "./AuditorSection";
import ProjectSection from "./ProjectSection";
import {useMediaQuery} from "@mui/material";

const AuditorsProjectsSection = () => {
    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
        <Box sx={wrapperStyle}>
                <Box sx={AuditorsProjectsSectionStyle(isMobile)}>
                <AuditorSection />
                <Divider
                orientation="vertical"
                flexItem
                sx={{
                backgroundColor: "white",
                color: "white",
            }}
                light
                />
                <ProjectSection />
                </Box>
                </Box>
                );
            };

            const wrapperStyle = {
            backgroundColor: "#52176D",
            width: "100%",
            paddingY: "5rem",
        };
            const AuditorsProjectsSectionStyle = () => ({
            width: "100%",
            maxWidth: "1512px",
            backgroundColor: "#52176D",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "3rem",
            color: "white",
            marginX: "auto",
            [theme.breakpoints.down("lg")]: {
            paddingX: "5%",
            gap: "1rem",
        },
        });

            export default AuditorsProjectsSection;
