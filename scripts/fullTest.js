const { ethers } = require("hardhat");
const keccak256 = require("keccak256");

async function main () {

    // Owner of contract
    const [deployer, tester1, tester2] = await ethers.getSigners();
    //let owner = (deployer.address);

    // Deploy Main contract
    const MainContract = await ethers.getContractFactory("Main");
    const mainContract = await MainContract.deploy();

    // Owner to add new page
    // Create acccess for tokenID 1
    // function createPage(string memory _path, uint256 _tokenId) public onlyOwner {
    await mainContract.connect(deployer).createPage("auth", 1);

    // let test = await mainContract.connect(tester2).balanceOf(tester2.address);
    // console.log("look at this answer: ", test);

    // Get tester to mint an nft
    await mainContract.connect(tester1).mint();

    // Get tester to mint an nft
    // await mainContract.connect(tester2).mint();
    // await mainContract.connect(tester2).mint();

    //Check if tester accounts own a token
    let result = await mainContract.connect(tester1).checkOwn(tester1.address);
    console.log("What tester 1 owns: ", result); 

    // if array is not empty
    // result.forEach(item => console.log(item.toNumber()));

    // result = await mainContract.connect(tester2).checkOwn(tester2.address);
    // console.log("What tester 2 owns: ", result);

    const balance = await mainContract.connect(tester1).checkOwn(tester1.address);

    if (balance.length !== 0) {

        console.log("Array is not empty");

        //function verifyAccess(string memory _path, uint256 _tokenId) external view returns (bool){
        // Testing access with hardcode value for tokenId
        const verificationResult = await mainContract.connect(tester1).verifyAccess("auth", 1);
        console.log("Verification Result: ", verificationResult);

        // After this is done... do signature verification

        // Message (private key) lol
        const message = "Hello";

        // Message Hash
        const messageHash = ethers.utils.solidityKeccak256(['string'], [message]);

        // Wallet owner signs message
        const signature = await tester1.signMessage(ethers.utils.arrayify(messageHash));

        // split signature
        const r = signature.slice(0, 66);
        const s = "0x" + signature.slice(66, 130);
        const v = parseInt(signature.slice(130, 132), 16);
        console.log(r, s, v);

        const sigResult = await mainContract.connect(tester1).verifySignature(messageHash, v, r, s);
   
        //console.log("Signature Verfication Result: ", sigResult);

        if (sigResult) {
            // Allow access to page
        }

        else {
            // Deny access to page
        }
    }

}



main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });