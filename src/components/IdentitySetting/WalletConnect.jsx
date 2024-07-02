import React, { useEffect } from 'react';
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

const WalletConnect = ({ linkedAccounts, sx = {} }) => {
  const wagmiConfig = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    enableCoinbase: false,
    enableEmail: false,
    enableInjected: false,
  });

  const modal = createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    allWallets: 'HIDE',
    includeWalletIds: [
      'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
      '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
    ],
  });

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <WalletConnectButton sx={sx} linkedAccounts={linkedAccounts} />
      </WagmiConfig>
    </>
  );
};

export default WalletConnect;
