import pinataSDK from '@pinata/sdk';
const pinata = pinataSDK('3f5eba85645bc0376309', 'fdd55e534d600deee43744c65e40b878441bed85b96cf64dbada87fab4362741');

export default function handler(req, res) {
  pinata.testAuthentication().then((result) => {
    //handle successful authentication here
    res.status(200).json(result)
  }).catch((err) => {
    //handle error here
    res.status(500).json(err)
  });

}
