import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit.js';
import {
  addUserInOrganization,
  changeAccessLevel,
  deleteUserFromOrganization,
} from '../../redux/actions/organizationAction.js';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded.js';
import ListItemButton from '@mui/material/ListItemButton';
import { ASSET_URL } from '../../services/urls.js';
import { useDispatch, useSelector } from 'react-redux';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import IconButton from '@mui/material/IconButton';
import { addTestsLabel } from '../../lib/helper.js';
import { ArrowBack } from '@mui/icons-material';
import Radio from '@mui/material/Radio';
import { CUSTOMER } from '../../redux/actions/types.js';
import theme from '../../styles/themes.js';

const UserLIstItem = ({ value, labelId, organization }) => {
  const user = useSelector(s => s.user.user);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [rulesOfMember, setRulesOfMember] = useState(
    value.access_level || 'Representative',
  );

  const handleChangeOwner = () => {
    dispatch(
      changeAccessLevel(
        organization.id,
        value.user_id,
        ['Owner', 'Representative', 'Editor'],
        organization.link_id,
      ),
    );
    setIsOpenConfirm(false);
    setIsOpen(false);
  };

  const handleClose = () => {
    setRulesOfMember(value.access_level);
    setIsOpen(false);
  };

  const handleChangeAccess = () => {
    const data = [
      {
        user_id: value?.user_id,
        access_level: rulesOfMember,
      },
    ];
    dispatch(
      changeAccessLevel(
        organization.id,
        value.user_id,
        { access_level: rulesOfMember },
        organization.link_id,
      ),
    );
    handleClose();
  };

  return (
    <ListItem
      key={value.user_id}
      sx={{
        borderBottom: '1px solid rgba(0, 0, 0, 0.23)',
      }}
      secondaryAction={
        organization.owner.user_id === user.id &&
        value.user_id !== user.id && (
          <Box>
            <Button
              sx={userActionSx}
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <EditIcon color={'warning'} />
            </Button>
            <Button
              sx={userActionSx}
              onClick={() => {
                dispatch(
                  deleteUserFromOrganization(
                    organization.id,
                    value.user_id,
                    organization.link_id,
                  ),
                );
              }}
            >
              <DeleteForeverRoundedIcon color={'error'} />
            </Button>
            <Modal
              open={isOpen}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={modalSx}>
                <Box>
                  <IconButton
                    onClick={handleClose}
                    color={
                      user?.current_role?.toLowerCase() ===
                      CUSTOMER?.toLowerCase()
                        ? 'primary'
                        : 'secondary'
                    }
                    {...addTestsLabel('go-back-button')}
                  >
                    <CloseOutlinedIcon />
                  </IconButton>
                </Box>
                <Box sx={{ p: '15px' }}>
                  <Typography variant={'h4'} sx={{ fontWeight: 500 }}>
                    Current organization
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                      marginY: '15px',
                    }}
                  >
                    <Avatar src={`${ASSET_URL}/id/${organization.avatar}`} />
                    <Typography variant={'h5'}>{organization.name}</Typography>
                  </Box>
                  <Typography variant={'h5'} sx={{ fontWeight: 500 }}>
                    {`Change the role of ${value.username}`}
                  </Typography>

                  <Box
                    sx={{
                      mt: '10px',
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '20px',
                    }}
                  >
                    <FormControlLabel
                      value="Owner"
                      control={
                        <Radio
                          checked={rulesOfMember === 'Owner'}
                          color={
                            user?.current_role?.toLowerCase() ===
                            CUSTOMER?.toLowerCase()
                              ? 'primary'
                              : 'secondary'
                          }
                          onChange={() => setRulesOfMember('Owner')}
                        />
                      }
                      sx={{ width: '30%' }}
                      label="Owner"
                      labelPlacement="top"
                    />
                    <FormControlLabel
                      value="Editor"
                      control={
                        <Radio
                          checked={rulesOfMember === 'Editor'}
                          color={
                            user?.current_role?.toLowerCase() ===
                            CUSTOMER?.toLowerCase()
                              ? 'primary'
                              : 'secondary'
                          }
                          onChange={() => setRulesOfMember('Editor')}
                        />
                      }
                      sx={{ width: '30%' }}
                      label="Editor"
                      labelPlacement="top"
                    />
                    <FormControlLabel
                      value="Representative"
                      control={
                        <Radio
                          checked={rulesOfMember === 'Representative'}
                          color={
                            user?.current_role?.toLowerCase() ===
                            CUSTOMER?.toLowerCase()
                              ? 'primary'
                              : 'secondary'
                          }
                          onChange={() => setRulesOfMember('Representative')}
                        />
                      }
                      sx={{ width: '30%' }}
                      label="Representative"
                      labelPlacement="top"
                    />
                  </Box>
                  <Button
                    variant={'contained'}
                    sx={{
                      textTransform: 'unset',
                      display: 'block',
                      marginX: 'auto',
                      marginTop: '20px',
                    }}
                    color={
                      user?.current_role?.toLowerCase() ===
                      CUSTOMER?.toLowerCase()
                        ? 'primary'
                        : 'secondary'
                    }
                    onClick={handleChangeAccess}
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            </Modal>
          </Box>
        )
      }
      disablePadding
    >
      <ListItemButton>
        <ListItemAvatar>
          <Avatar
            sx={{ width: '30px', height: '30px' }}
            alt={`Avatar n°${value + 1}`}
            src={value.avatar ? `${ASSET_URL}/id/${value.avatar}` : ''}
          />
        </ListItemAvatar>
        <ListItemText id={labelId} primary={value.username} />
        {value.access_level.includes('Owner') && (
          <Chip size="small" label="Owner" color="success" />
        )}
      </ListItemButton>
    </ListItem>
  );
};

export default UserLIstItem;

const modalSx = theme => ({
  position: 'absolute',
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 3,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '10px',
  width: '700px',
  [theme.breakpoints.down('sm')]: {
    paddingBottom: '30px',
    height: '100%',
    width: '100%',
  },
  [theme.breakpoints.down(500)]: {
    width: '310px',
    p: 2,
  },
});

const userActionSx = theme => ({
  minWidth: 'unset',
  padding: '5px',
  mx: '5px',
});
