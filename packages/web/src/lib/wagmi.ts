import { http, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected, coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base],
  connectors: [
    injected({ target: 'metaMask' }),
    injected(),
    coinbaseWallet({ appName: 'saimmy' }),
  ],
  transports: {
    [base.id]: http(),
  },
})
