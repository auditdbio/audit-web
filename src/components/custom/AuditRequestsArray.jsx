import { Box, Typography } from '@mui/material';

export const AuditRequestsArray = ({ requests }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {requests.length > 0 && (
        <Typography style={headerText}>Audit requests</Typography>
      )}
      {requests.map((req, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            // justifyContent: "space-between",
          }}
        >
          <Typography style={nameStyle}>{'Auditor name '}</Typography>
          <Typography
            style={textStyle}
          >{`---request id: ${req.id}`}</Typography>
          {/*<Typography style={textStyle}>{". "+req.auditor_id}</Typography>*/}
        </Box>
      ))}
    </Box>
  );
};

const textStyle = {
  fontSize: '14px',
};
const nameStyle = {
  fontSize: '14px',
  color: '#FF9900',
};
const headerText = {
  fontSize: '14px',
};
