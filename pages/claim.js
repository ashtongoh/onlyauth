import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@material-tailwind/react";

const Create = () => {
  const handleDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files;

    console.log(files)

  };

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
          <Button color="green" variant="gradient" size="lg" > Upload </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
export default Create;
