import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWeb3Modal, useWeb3ModalTheme } from '@web3modal/wagmi/react';
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import { Box, Button, Checkbox, Tooltip, Typography } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff.js';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye.js';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever.js';
import WalletConnectIcon from '../icons/WalletConnectIcon.jsx';
import {
  changeAccountVisibility,
  connect_account,
  handleDeleteLinkedAccount,
} from '../../redux/actions/userAction.js';

const message = 'Verify your wallet';

const WalletConnectButton = ({ linkedAccounts, sx = {} }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.user);
  const [linked, setLinked] = useState(null);

  const { open } = useWeb3Modal();
  const { setThemeMode, setThemeVariables } = useWeb3ModalTheme();
  const { disconnect } = useDisconnect();
  const { address, isConnected, connector } = useAccount();
  const {
    data: signature,
    isSuccess,
    signMessage,
  } = useSignMessage({ message });

  const handleOpen = async () => {
    await open();
  };

  const handleVisibilityChange = e => {
    const value = {
      is_public: e.target.checked,
    };
    dispatch(changeAccountVisibility(user.id, value, linked.id));
  };

  const handleDelete = e => {
    e.stopPropagation();
    dispatch(handleDeleteLinkedAccount(user.id, linked.id));
    if (isConnected) {
      disconnect();
    }
  };

  useEffect(() => {
    setThemeMode('light');
    setThemeVariables({
      '--w3m-color-mix': '#FF9900',
      '--w3m-color-mix-strength': 50,
    });
  }, []);

  useEffect(() => {
    setLinked(
      linkedAccounts?.find(acc => acc.name.toLowerCase() === 'walletconnect'),
    );
  }, [linkedAccounts]);

  useEffect(() => {
    if (isConnected && connector && !linked) {
      signMessage();
    }
  }, [isConnected, connector, linked]);

  useEffect(() => {
    if (isSuccess && signature && !linked && isConnected) {
      const wallet = {
        address,
        message,
        signature,
      };

      dispatch(connect_account(user.id, wallet, true));
    }
  }, [signature, isSuccess, linked, isConnected]);

  return (
    <Box sx={[sx, { padding: 0 }, linked ? { border: '1px solid green' } : {}]}>
      <Button sx={buttonSx} onClick={handleOpen}>
        <Box sx={{ width: '100%' }}>
          <WalletConnectIcon />
          <Typography>Wallets</Typography>
        </Box>
        {!!linked && (
          <>
            <Tooltip arrow placement="top" title="Show in profile">
              <Checkbox
                checked={linked.is_public}
                onChange={handleVisibilityChange}
                onClick={e => e.stopPropagation()}
                icon={<VisibilityOffIcon />}
                checkedIcon={<RemoveRedEyeIcon />}
              />
            </Tooltip>
            <Button onClick={handleDelete} sx={{ minWidth: '30px' }}>
              <DeleteForeverIcon color="error" />
            </Button>
          </>
        )}
      </Button>
    </Box>
  );
};

export default WalletConnectButton;

const buttonSx = theme => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '7px',
  width: '100%',
  textTransform: 'none',
  color: 'black',
  padding: '10px 20px !important',
  '& > div': {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '0 !important',
  },
});
