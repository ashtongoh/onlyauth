import '../styles/globals.css'
import {
  Navbar,
  Typography,
  Button,
} from "@material-tailwind/react";

function MyApp({Component, pageProps}) {
  return (
    <>
      <Navbar className="border-b border-color-black mx-auto py-2 px-4 py-3" fullWidth={true} shadow={false}>
        <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
          <Typography
            as="a"
            href="/"
            variant="small"
            className="mr-4 cursor-pointer py-1.5 font-bold"
          >
            <span>BlockChamp</span>
          </Typography>
          <div className="flex items-center space-x-2">
            <a href="/create">
              <Button color="green" variant="gradient" size="sm" className="lg:inline-block">
                Claim
              </Button>
            </a>
            <a href="/auth">
              <Button variant="gradient" size="sm" className="lg:inline-block">
                Auth
              </Button>
            </a>
          </div>
        </div>
      </Navbar>
      <div className="container mx-auto flex flex-grow items-center justify-between ">
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default MyApp
