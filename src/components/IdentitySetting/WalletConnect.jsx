import React from 'react';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { WagmiProvider } from 'wagmi';
import { arbitrum, mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WalletConnectButton from './WalletConnectButton.jsx';

const projectId = import.meta.env.VITE_WALLET_CONNECT_ID;
const chains = [mainnet];
const url = import.meta.env.VITE_BASE_URL;

const queryClient = new QueryClient();

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
    enableInjected: false,
    auth: {
      email: false,
    },
  });

  const modal = createWeb3Modal({
    enableAnalytics: false,
    enableOnramp: false,
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
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <WalletConnectButton sx={sx} linkedAccounts={linkedAccounts} />
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
};

export default WalletConnect;
