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
  changeAccessLevel,
  deleteUserFromOrganization,
} from '../../redux/actions/organizationAction.js';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded.js';
import ListItemButton from '@mui/material/ListItemButton';
import { ASSET_URL } from '../../services/urls.js';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmModal from '../modal/ConfirmModal.jsx';

const UserLIstItem = ({ value, labelId, organization }) => {
  const user = useSelector(s => s.user.user);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [rulesOfMember, setRulesOfMember] = useState({
    Representative: value.access_level.includes('Representative'),
    Editor: value.access_level.includes('Editor'),
  });

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
    setRulesOfMember({
      Representative: value.access_level.includes('Representative'),
      Editor: value.access_level.includes('Editor'),
    });
    setIsOpen(false);
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
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Rules of {value.username}
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
                    value="Representative"
                    control={<Checkbox />}
                    label="Representative"
                    labelPlacement="top"
                    checked={rulesOfMember.Representative}
                    onChange={e => {
                      setRulesOfMember({
                        ...rulesOfMember,
                        Representative: e.target.checked,
                      });
                    }}
                  />
                  <FormControlLabel
                    value="Editor"
                    control={<Checkbox />}
                    label="Editor"
                    checked={rulesOfMember.Editor}
                    labelPlacement="top"
                    onChange={e => {
                      setRulesOfMember({
                        ...rulesOfMember,
                        Editor: e.target.checked,
                      });
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: '15px' }}>
                  <Button
                    variant={'contained'}
                    onClick={() => {
                      const rules = Object.keys(rulesOfMember).filter(
                        key => rulesOfMember[key],
                      );
                      dispatch(
                        changeAccessLevel(
                          organization.id,
                          value.user_id,
                          rules,
                          organization.link_id,
                        ),
                      );
                      setIsOpen(false);
                    }}
                    sx={{
                      textTransform: 'unset',
                      mt: '10px',
                      width: '50%',
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    sx={{
                      textTransform: 'unset',
                      mt: '10px',
                      width: '50%',
                    }}
                    color={'secondary'}
                    variant={'contained'}
                    onClick={() => {
                      setIsOpenConfirm(true);
                    }}
                  >
                    Make owner
                  </Button>
                  <ConfirmModal
                    handleAgree={() => handleChangeOwner()}
                    handleDisagree={() => setIsOpenConfirm(false)}
                    isOpen={isOpenConfirm}
                  />
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
            src={value.avatar ? `${ASSET_URL}/${value.avatar}` : ''}
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
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
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
