import { Box, Typography } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import MenuItem from "@mui/material/MenuItem";
import { useMediaQuery } from "@mui/material";

const Footer = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Box sx={mainFooterStyles(isMobile)}>
      {/*logo, icons, menu*/}

      <Box sx={footerStyle(isMobile)}>
        {/*logo and icons*/}
        <Box sx={logoIconsStyle(isMobile)}>
          <Box sx={{ display: "flex" }}>
            <Typography style={auditStyles(isMobile)}>Audit</Typography>
            <Typography style={dbStyles(isMobile)}>DB</Typography>
          </Box>
          <Box>
            <TwitterIcon sx={IconStyle} />
            <YouTubeIcon sx={IconStyle} />
            <InstagramIcon sx={IconStyle} />
          </Box>
        </Box>
        <Box
          // menu items
          sx={menuItems(isMobile)}
        >
          {pages.map((page) => (
            <MenuItem disableGutters key={page.id}>
              <Box sx={menuItem(isMobile)}>{page.name}</Box>
            </MenuItem>
          ))}
        </Box>
      </Box>

      <Typography style={rightsStyles(isMobile)}>
        2022 All rights reserved.
      </Typography>
    </Box>
  );
};

const mainFooterStyles = (isMobile) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  backgroundColor: "#FF9900",
  padding: isMobile ? "35px 54px 28px 54px" : "24px 45px 8px 45px",
  // padding: "1rem",
  gap: "30px",
});


const footerStyle = (isMobile) => ({
  display: isMobile ? "flex" : "grid",
  flexDirection: isMobile ? "column" : "none",
  gap: "30px",
  gridTemplateColumns: "1fr repeat(3, auto) 1fr",
  justifyItems: "center",
});

const logoIconsStyle = (isMobile) => ({
  display: "flex",
  flexDirection: "column",
  marginRight: "auto",
  gap: isMobile ? "30px" : "22px",
  alignSelf: "flex-start",
});

const auditStyles = (isMobile) => ({
  fontSize: isMobile ? "30px" : "40px",
  color: "#52176D",
  fontWeight: "800",
});

const dbStyles = (isMobile) => ({
  fontSize: isMobile ? "30px" : "40px",
  color: "#FCFAF6",
  fontWeight: "800",
});

const menuItems = (isMobile) => ({
  display: "grid",
  gridTemplateColumns: isMobile ? "repeat(2, auto)" : "repeat(3, auto)",
  gap: "0 50px",
});

const menuItem = (isMobile) => ({
  // width: "200px",
  textAlign: "left",
  color: "#FCFAF6",
  fontFamily: "Montserrat",
  marginX: isMobile ? "0" : "2rem",
  fontSize: isMobile ? "22px" : "26px",
  paddingLeft: "0px",
  fontWeight: "500",
});

const rightsStyles = (isMobile) => ({
  fontSize: isMobile ? "9px" : "18px",
  fontWeight: "500",
  textAlign: "center",
});

const pages = [
  {
    id: 1,
    name: "Product",
  },
  {
    id: 2,
    name: "About Us",
  },
  {
    id: 3,
    name: "Product",
  },
  {
    id: 4,
    name: "About Us",
  },
  {
    id: 5,
    name: "Product",
  },
  {
    id: 6,
    name: "About Us",
  },
];

const IconStyle = {
  color: "#52176D",
};

export default Footer;
