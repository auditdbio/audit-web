import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWeb3Modal, useWeb3ModalTheme } from '@web3modal/wagmi/react';
import { useAccount, useSignMessage } from 'wagmi';
import { Box, Button, Typography } from '@mui/material';
import WalletConnectIcon from '../icons/WalletConnectIcon.jsx';
import { connectWallet } from '../../redux/actions/userAction.js';

const message = 'Verify your wallet';

const WalletConnectButton = ({ sx = {} }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.user);

  const { open } = useWeb3Modal();
  const { setThemeMode, setThemeVariables } = useWeb3ModalTheme();
  const { address, isConnected, connector } = useAccount();
  const {
    data: signature,
    isSuccess,
    signMessage,
  } = useSignMessage({ message });

  useEffect(() => {
    setThemeMode('light');
    setThemeVariables({
      '--w3m-color-mix': '#FF9900',
      '--w3m-color-mix-strength': 50,
    });
  }, []);

  const handleOpen = async () => {
    await open();
  };

  useEffect(() => {
    if (isConnected && connector) {
      signMessage();
    }
  }, [isConnected, connector]);

  useEffect(() => {
    if (isSuccess && signature) {
      const wallet = {
        address,
        message,
        signature,
      };

      dispatch(connectWallet(user.id, wallet));
    }
  }, [signature, isSuccess]);

  return (
    <Box sx={[sx, { padding: 0 }]}>
      <Button sx={buttonSx} onClick={handleOpen}>
        <WalletConnectIcon />
        <Typography>Wallets</Typography>
      </Button>
    </Box>
  );
};

export default WalletConnectButton;

const buttonSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'initial',
  gap: '7px',
  width: '100%',
  textTransform: 'none',
  color: 'black',
  padding: '10px 20px !important',
};
