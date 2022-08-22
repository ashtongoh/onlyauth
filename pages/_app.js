import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'

import {
  WagmiConfig,
  createClient,
  defaultChains,
  configureChains,
} from 'wagmi'

import {alchemyProvider} from 'wagmi/providers/alchemy'
import {publicProvider} from 'wagmi/providers/public'

import {MetaMaskConnector} from 'wagmi/connectors/metaMask'

import NavbarContainer from '../src/components/Navbar'

const {chains, provider, webSocketProvider} = configureChains(defaultChains, [
  alchemyProvider({apiKey: 'CaDXn1g7zGJvM8WOLJeAMA8MM_u1-CMV'}),
  publicProvider()
]);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({chains}),
  ],
  provider,
  webSocketProvider,
});

function MyApp({Component, pageProps}) {
  return (
    <ThemeProvider enableSystem = {true} attribute ="class">
      <WagmiConfig client={client}>
        <NavbarContainer />
        <div className="container mx-auto flex flex-grow items-center justify-between ">
          <Component {...pageProps} />
        </div>
      </WagmiConfig>
    </ThemeProvider>
  )
}

export default MyApp
