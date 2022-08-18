import '../styles/globals.css'
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";

function MyApp({Component, pageProps}) {
  return (
    <>
      <Navbar className="mt-6 mx-auto max-w-screen-xl py-2 px-4 lg:px-8 lg:py-4">
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
            <Button color="green" variant="gradient" size="sm" className="lg:inline-block">
              <span>Create</span>
            </Button>
            <Button variant="gradient" size="sm" className="lg:inline-block">
              <span>Auth</span>
            </Button>
          </div>
        </div>
      </Navbar>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
