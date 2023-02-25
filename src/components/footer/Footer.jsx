import { Box, Typography } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import MenuItem from "@mui/material/MenuItem";

const Footer = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#FF9900",
        paddingTop: "40px",
        paddingBottom: "22px",
        padding: "1rem",
      }}
    >
        <Box
        sx = {{
            display: 'flex',
        }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <Box sx={{ display: "flex" }}>
                    <Typography
                        style={{
                            fontSize: "40px",
                            color: "#52176D",
                            fontWeight: "800",
                        }}
                    >
                        Audit
                    </Typography>
                    <Typography
                        style={{
                            fontSize: "40px",
                            color: "#FCFAF6",
                            fontWeight: "800",
                        }}
                    >
                        DB
                    </Typography>
                </Box>
                <Box>
                    <TwitterIcon sx={IconStyle} />
                    <YouTubeIcon sx={IconStyle} />
                    <InstagramIcon sx={IconStyle} />
                </Box>

        </Box>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "row",
                    width: '50%',
                }}
            >
                {pages.map((page) => (
                    <MenuItem key={page.id}>
                        <Box
                            textAlign="center"
                            sx={{
                                width: "150px",
                                textAlign: "left",
                                color: "#FCFAF6",
                                fontFamily: "Montserrat",
                                marginX: "1rem",
                                fontSize: "26px",
                                fontWeight: "500",
                            }}
                        >
                            {page.name}
                        </Box>
                    </MenuItem>
                ))}
            </Box>

      </Box>

      <Typography
        style={{
          fontSize: "18px",
          fontWeight: "500",
          textAlign: "center",
        }}
      >
        2022 All rights reserved.
      </Typography>
    </Box>
  );
};

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
