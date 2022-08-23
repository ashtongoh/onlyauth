const { ethers } = require("hardhat");
const keccak256 = require("keccak256");

async function main() {

    const [deployer] = await ethers.getSigners();
    //let owner = (deployer.address);

    // Deploy Main contract
    const MainContract = await ethers.getContractFactory("Main");
    const mainContract = await MainContract.deploy();

    // Message (private key)
    const message = "Hello";

    // Message Hash
    const messageHash = ethers.utils.solidityKeccak256(['string'], [message]);

    // Wallet owner signs message
    const signature = await deployer.signMessage(ethers.utils.arrayify(messageHash));

    // This works
    //console.log(signature);

    // split signature
    const r = signature.slice(0, 66);
    const s = "0x" + signature.slice(66, 130);
    const v = parseInt(signature.slice(130, 132), 16);
    console.log(r, s, v);

    // verifySigature(bytes32 _hashedMessage, uint8 _v, bytes32 _r, bytes32 _s)

    const result = await mainContract.connect(deployer).verifySignature(messageHash, v, r, s);

    console.log(result);


}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });