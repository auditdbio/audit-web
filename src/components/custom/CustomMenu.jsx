import React, { useId } from 'react';
import { useNavigate } from 'react-router-dom/dist';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box } from '@mui/material';
import { addTestsLabel, isAuth } from '../../lib/helper.js';
import theme from '../../styles/themes.js';

const StyledMenu = styled(props => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 10,
    marginTop: theme.spacing(0),
    minWidth: 180,
    fontWeight: 500,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      ':hover': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
      },
    },
  },
}));

export default function CustomMenu({ buttonText, options }) {
  const styledMenuId = useId();
  const menuOptions = options;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const currentRole = useSelector(s => s.user.user.current_role);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={wrapper}>
      <Button
        aria-controls={open ? styledMenuId : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        disableRipple
        sx={menuButton}
        {...addTestsLabel(`header_dropdown-${buttonText}`)}
      >
        {buttonText}
      </Button>
      <StyledMenu
        id={styledMenuId}
        MenuListProps={{ 'aria-labelledby': 'demo-customized-button' }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {menuOptions
          .filter(item => (isAuth() ? item.role === currentRole : item))
          .map(item => {
            return (
              <MenuItem
                onClick={() => {
                  handleClose();
                  if (item.link.includes('http')) {
                    window.open(item.link, '_blank');
                  } else {
                    navigate(item.link);
                  }
                }}
                key={item.id}
                disableRipple
                {...addTestsLabel(`header_dropdown-item-${item.itemName}`)}
              >
                {item.itemName}
              </MenuItem>
            );
          })}
      </StyledMenu>
    </Box>
  );
}

const wrapper = {
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
};

const menuButton = theme => ({
  background: 'transparent',
  color: '#222222',
  fontSize: '20px',
  fontWeight: '400',
  fontFamily: 'Montserrat',
  textTransform: 'none',
  ':hover': {
    backgroundColor: 'transparent', //
    color: theme.palette.primary.main,
  },
  ':focus-visible': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
  },
  textTransform: 'none',
  marginY: 'auto',
  [theme.breakpoints.down('md')]: {
    padding: '6px',
    fontSize: '22px',
  },
});
