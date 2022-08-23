// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Main is ERC721Enumerable, Ownable {

    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("BlockChampsNFT", "BC") {}

    struct Page {
        string path;
        bool isTrue;
    }

    // Maps token ID to Page struct
    mapping(uint => Page) private tokenIdToPage; 

    function createPage(string memory _path, uint256 _tokenId) public onlyOwner {

        Page memory page = Page(_path, true);
        tokenIdToPage[_tokenId] = page;
    }

    function mint() external {

        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        _safeMint(_msgSender(), tokenId);

    }

    function tokenURI(uint256 tokenId) override public pure returns (string memory) {
        string memory json = string(abi.encodePacked('{"name": "BlockChamps NFT #', tokenId.toString(), '",'));

        json = string(abi.encodePacked(json, '"description": "NFT for BlockChamps Hackathon!",'));

        json = Base64.encode(bytes(string(abi.encodePacked(json, '"image": "https://gateway.pinata.cloud/ipfs/QmTfLNkin1r6sM8RHrqFZLpDU2gd9qBpZDZHfHWWYytkrj"}'))));
        return string(abi.encodePacked('data:application/json;base64,', json));
    }

    function verifySignature(bytes32 _hashedMessage, uint8 _v, bytes32 _r, bytes32 _s) external view returns (bool) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHashMessage = keccak256(abi.encodePacked(prefix, _hashedMessage));
        address signer = ecrecover(prefixedHashMessage, _v, _r, _s);

        // if the signature is signed by the owner
        if (signer == _msgSender()) {
            return true;
        }

        return false;
    }

    // This is to check how many tokens the an account owns
    function checkOwn (address _acc) external view returns (uint256[] memory tokens) {

        tokens = new uint256[](balanceOf(_acc));
        uint256 counter = 0;

        for (uint256 i = 1; i <= totalSupply(); i++) {
            if (ownerOf(i) == _acc) tokens[counter++] = i;
        }
    }

    function verifyAccess(string memory _path, uint256 _tokenId) external view returns (bool){

        Page memory page = tokenIdToPage[_tokenId];

        if (keccak256(abi.encodePacked(page.path)) == keccak256(abi.encodePacked(_path)) && page.isTrue == true) {
            return true;
        }

        else {
            return false;
        }
    }
}
