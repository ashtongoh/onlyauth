import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";

import {usePrepareContractWrite, useContractWrite} from 'wagmi'

import {
  useAccount,
} from 'wagmi'

const Claim = () => {
  const {address} = useAccount()

  const handleDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files;

    console.log(files)
  };

  const {config, error, isError} = usePrepareContractWrite({
    addressOrName: address,
    contractInterface: ['function mint()'],
    functionName: 'mint',
  });

  const {data, write} = useContractWrite(config)

  return (
    <div className="flex flex-grow justify-center container pt-10 items-center full-height">
      <Card className="w-96">
        <CardHeader color="blue" className="relative h-56">
          <div
            onDragOver={e => {
              e.preventDefault();
              return false
            }}
            onDrop={handleDrop} className="w-full h-full"
          />
        </CardHeader>
        <CardBody className="text-center">
          Upload an NFT
        </CardBody>
        <CardFooter divider className="flex items-center justify-end py-3">
          <Button onClick={() => write()} disabled={!write} color="green" variant="gradient" size="lg" > Mint </Button>
          {isError && <div>Error: {error.message}</div>}
        </CardFooter>
      </Card>
    </div>
  )
}
export default Claim;
