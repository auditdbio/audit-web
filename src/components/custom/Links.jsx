import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import theme from "../../styles/themes.js";

export const Links = ({ links, handleDelete }) => {
  return (
    <Box
      sx={{
        // display: "flex",
        flexDirection: "column",
        paddingLeft: "30px",
      }}
    >
      {links.map((link) => (
        <Box
          key={link}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <a href={link} target="_blank">
            <Typography variant="body2" sx={linkStyle}>
              {link}
            </Typography>
          </a>

          <IconButton
            sx={{ padding: "5px" }}
            onClick={() => handleDelete(link)}
          >
            <CloseIcon
              sx={{
                height: "18px",
                width: "18px",
              }}
            />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

const linkStyle = {
  whiteSpace: "nowrap",
  [theme.breakpoints.down("md")]: {
    width: "250px",
  },
  [theme.breakpoints.down("sm")]: {
    width: "200px",
  },
  width: "300px",
  textOverflow: "ellipsis",
  overflow: "hidden",
  fontSize: "18px",
  color: "#152BEA",
  textDecoration: "underline",
};
