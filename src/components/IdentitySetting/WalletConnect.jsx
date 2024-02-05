import React from 'react';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { WagmiConfig } from 'wagmi';
import { mainnet } from 'viem/chains';
import WalletConnectButton from './WalletConnectButton.jsx';

const projectId = import.meta.env.VITE_WALLET_CONNECT_ID;
const chains = [mainnet];
const url = import.meta.env.VITE_BASE_URL;

const metadata = {
  name: 'AuditDB',
  description: 'AuditDB',
  url,
  icons: [`${url}logo_short.svg`],
};

const WalletConnect = ({ sx = {} }) => {
  const wagmiConfig = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    enableAnalytics: true,
  });

  createWeb3Modal({ wagmiConfig, projectId, chains });

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <WalletConnectButton sx={sx} />
      </WagmiConfig>
    </>
  );
};

export default WalletConnect;
