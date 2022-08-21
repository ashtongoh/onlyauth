import React from "react";

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
  const [image, setImage] = React.useState(null)

  const handleDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const files = e.dataTransfer.files;
    const file = files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      console.log(e.target.result);
      setImage(e.target.result)
    };
    reader.readAsDataURL(file);

    fetch("/api/upload").then(res => res.json()).then(data => console.log(data))
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
          >
            {image && (<img src={image} />)}
          </div>
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
