const { ethers } = require("hardhat");
const keccak256 = require("keccak256");

async function main() {

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
    await mainContract.connect(tester1).mint();
    await mainContract.connect(tester1).mint();
    await mainContract.connect(tester1).mint();

    // Get tester to mint an nft
    // await mainContract.connect(tester2).mint();
    // await mainContract.connect(tester2).mint();

    //Check if tester accounts own a token
    const balArr = await mainContract.checkOwn(tester1.address);
    //console.log("What tester 1 owns: ", result); 

    // const balanceOfOwner = await mainContract.balanceOf(tester1.address);
    // console.log("Balance of owner: ", balanceOfOwner.toNumber());
    // const totalSupply = await mainContract.totalSupply();
    // console.log("Total supply: ", totalSupply.toNumber());

    // const counter = 0;
    // const balArr = [];

    // for (let i = 1; i <= totalSupply; i++) {

    //     const ownerOf = await mainContract.ownerOf(i);
    //     console.log(ownerOf);    

    //     if(ownerOf == tester1.address) {
    //         console.log(true);
    //         //balArr.append(i);
    //     }
    // }

    //console.log(balArr);

    //console.log("Look at this:", balanceOfOwner);

    // if array is not empty
    if (balArr.length !== 0) {

        console.log("Array is not empty");

        for (let i = 0; i < balArr.length; i++) {
            // If any one of the token exists, grant access

            const verificationResult = await mainContract.verifyAccess("auth", balArr[i].toNumber());
            console.log("Verification Result: ", verificationResult);

            if (verificationResult == true) {

                // Get user to prove his identity through signature verification

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
                    console.log("Signature Verification Successful!");
                }

                else {
                    // Deny access to page
                }
            }
        }
    }
}



main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });