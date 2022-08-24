import React from "react"
import Link from "next/link"
import {MoonIcon, SunIcon} from '@heroicons/react/solid'
import {
  Navbar,
  Typography,
  Button,
} from "@material-tailwind/react";

import {
  useAccount,
  useConnect,
  useDisconnect,
} from 'wagmi'

const ThemeSwitcher = () => {
  const [theme, setTheme] = React.useState(null);

  return (
    theme && theme === "dark" ? (
      <SunIcon className="w-7 h-7" role="button" onClick={() => {
        setTheme(null)
        document.documentElement.classList.remove('dark')
      }} />
    ) : (
      <MoonIcon className="w-7 h-7" role="button" onClick={() => {
        setTheme("dark")
        document.documentElement.classList.add('dark')
      }} />
    ))
};

const NavbarContainer = () => {
  const [connectedAddress, setConnectedAddress] = React.useState(null);
  const {address, isConnected} = useAccount()
  const {connect, connectors, error, isLoading, pendingConnector} = useConnect()
  const {disconnect} = useDisconnect()

  React.useEffect(() => {
    if (isConnected && address) {
      setConnectedAddress(address)
    }
  }, [isConnected, address]);

  const handleDisconnect = () => {
    disconnect()
    setConnectedAddress(null)
  };

  return (
    <>
      <Navbar className="border-b border-color-black mx-auto py-2 px-4 py-3" fullWidth={true} shadow={false}>
        <div className="container mx-auto flex items-center text-[#1E0536]">
          <Typography
            as="a"
            href="/"
            variant="small"
            className="mr-4 cursor-pointer py-1.5 font-bold mr-10"
          >
            <span>onlyAuth</span>
          </Typography>
          <div className="flex space-x-6 text-[#1E0536]">
            <Link href="/claim">
              Claim
            </Link>
            <Link href="/auth">
              Auth
            </Link>
            <ThemeSwitcher />
          </div>
          <div className="flex items-center space-x-2 ml-auto text-[#1E0536]">
            {connectors.map((connector) => (
              <Button
                key={connector.id}
                onClick={() => connectedAddress ? handleDisconnect() : connect({connector})}
                color="orange"
              >
                {connector.name}
                {" "}
                {connectedAddress}
                {isLoading &&
                  connector.id === pendingConnector?.id &&
                  ' (connecting)'}
              </Button>
            ))}
          </div>
        </div>
      </Navbar>
      {error && <div>{error.message}</div>}
    </>
  )
}

export default NavbarContainer;
