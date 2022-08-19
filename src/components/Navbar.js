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
            <a href="/create">
              Claim
            </a>
            <a href="/auth">
              Auth
            </a>
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
