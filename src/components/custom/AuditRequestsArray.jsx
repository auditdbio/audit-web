import { Box, Typography } from "@mui/material";

export const AuditRequestsArray = ({ requests }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
        <Typography style={headerText}>Audit requests:</Typography>
      {requests.map((req, index) => (
        <Box
          key={req.id}
          sx={{
            display: "flex",
            // justifyContent: "space-between",
          }}
        >
          <Typography style={textStyle}>{index+1}</Typography>
          <Typography style={textStyle}>{". Auditor name "}</Typography>
            <Typography style={textStyle}>{`---request id: ${req.id}`}</Typography>
          {/*<Typography style={textStyle}>{". "+req.auditor_id}</Typography>*/}
        </Box>
      ))}
    </Box>
  );
};

const textStyle = {
  fontSize: "12px",
};
const headerText = {
  fontSize: "14px",
};
