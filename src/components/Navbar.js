import { useTheme } from "next-themes";
import {useState, useEffect} from 'react';
import {MoonIcon, SunIcon} from '@heroicons/react/solid'
import React from "react";
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

const NavbarContainer = () => {
  const [connectedAddress, setConnectedAddress] = React.useState(null);
  const {address, isConnected} = useAccount()
  const {connect, connectors, error, isLoading, pendingConnector} = useConnect()
  const {disconnect} = useDisconnect()

  const {systemTheme, theme, setTheme} = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const renderThemeChanger = () => {
    if (!mounted) return null;

    const currentTheme = theme === 'system' ? systemTheme : theme;

    if (currentTheme === 'dark') {
      return(
        <SunIcon className="w-7 h-7" role="button" onClick={() => setTheme('light')}/>
      )
    }
    else {
      return(
        <MoonIcon className="w-7 h-7" role="button" onClick={() => setTheme('dark')}/>
      )
    }
  }

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
        <div className="container mx-auto flex items-center text-blue-gray-900">
          <Typography
            as="a"
            href="/"
            variant="small"
            className="mr-4 cursor-pointer py-1.5 font-bold mr-10"
          >
            <span>BlockChamp</span>
          </Typography>
          <div className="space-x-6">
            <a href="/claim">
              Claim
            </a>
            <a href="/auth">
              Auth
            </a>
            {renderThemeChanger()}
          </div>
          <div className="flex items-center space-x-2 ml-auto">
            {connectors.map((connector) => (
              <Button
                key={connector.id}
                onClick={() => connectedAddress ? handleDisconnect() : connect({connector})}
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
