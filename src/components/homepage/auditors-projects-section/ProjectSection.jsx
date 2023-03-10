import {
    Box,
    Typography,
    InputBase,
    IconButton,
    useMediaQuery,
    Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PublicProjectCard from "./PublicProjectCard";
import theme from "../../../styles/themes";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAllProjects} from "../../../redux/actions/projectAction.js";
import MenuItem from "@mui/material/MenuItem";

const ProjectSection = () => {
  const dispatch = useDispatch();
  const matchSm = useMediaQuery(theme.breakpoints.down("xs"));
  const [searchInput, setSearchInput] = useState("");

  const [projectFound, setProjectFound] = useState(true);

  const projectReducer = useSelector((state) => state.project.projects);


    useEffect(() => {
        if (searchInput) {
            dispatch(getAllProjects(searchInput));
        } else {
            dispatch(getAllProjects("java"));
        }
    }, [searchInput]);

  useEffect(() => {
    console.log("projectReducer ==>", projectReducer);
  }, [projectReducer]);

  useEffect(() => {
    if (projectReducer && projectReducer.length != 0) {
      setProjectFound(true);
      console.log("These are your projects");
    } else {
      setProjectFound(false);
      console.log("No projects found");
    }
  }, [projectReducer]);

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box sx={headerWrapper}>
        <Typography variant="h1" sx={{ fontWeight: 500 }}>
          Projects
        </Typography>
        <Box sx={searchWrapper}>
          <InputBase
            sx={{
              ml: 1,
              flex: 1,
              white: "color",
              padding: "0",
            }}
            inputProps={{
              "aria-label": "search google maps",
              style: {
                color: "white",
                lineHeight: "26px",
                padding: "0",
              },
            }}
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
          <IconButton
            type="button"
            sx={{ p: "10px", color: "white" }}
            aria-label="search"
            disableRipple
          >
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ height: "2rem" }}></Box>
      {!projectFound && (
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 500, marginBottom: "20px" }}
          >
            No projects found
          </Typography>
        </Box>
      )}
      <Grid
        container
        rowSpacing={4}
        columnSpacing={{
          zero: 2,
          xs: 4,
          md: 12,
        }}
        justifyContent="space-between"
      >
        {projectReducer &&
          projectReducer.slice(0, matchSm ? 4 : 3).map((project) => (
            <Grid key={project.id} item zero="6" xs={4}>
              <PublicProjectCard project={project} />
            </Grid>
          ))}
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        <Typography variant="body2">view more...</Typography>
      </Box>
    </Box>
  );
};

const headerWrapper = {
  display: "flex",
  justifyContent: "space-between",
  flexDirection: { xs: "column", sm: "row" },
  alignItems: "center",
  gap: "2rem",
};

const searchWrapper = {
  display: "flex",
  alignItems: "center",
  border: "2px white solid",
  borderRadius: "15px",
  padding: "0",
  maxHeight: "42px",
  width: "60%",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
};

export default ProjectSection;
