// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// Contract template to be created by the factory
contract BonfireUserContract {
    address public owner;
    
    mapping(bytes32 => mapping(address => bool)) public idToAccess; // CID -> whitelisted addresses
    bytes32[] public cids;
    uint256 public cidCounter;

    constructor(address _owner) {
        owner = _owner;
        cidCounter = 0;
    }
    
    function grantAccess(bytes32 cid, address allowedAddress) external onlyOwner {
        require(idToAccess[cid][allowedAddress] == false, "Access already granted");

        idToAccess[cid][allowedAddress] = true;
        cids.push(cid);
        cidCounter += 1;
    }
    
    function revokeAccess(bytes32 cid, address allowedAddress) external onlyOwner {
        require(idToAccess[cid][allowedAddress] == true, "Access not found");

        idToAccess[cid][allowedAddress] = false;
    }

    function checkAccess(bytes32 cid, address allowedAddress)  external view returns (bool) {
        return idToAccess[cid][allowedAddress];
    }

    function getCID(uint256 index) external view returns (bytes32) {
        require(index < cidCounter, "index out of bound");
        return cids[index];
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
}


// Factory contract
contract BonfireFactory {
    mapping(address => address) public userToContract;
    
    event ContractCreated(address indexed user, address contractAddress);

    function createContract() external {
        require(userToContract[msg.sender] == address(0), "Contract already created");

        BonfireUserContract newContract = new BonfireUserContract(msg.sender);
        userToContract[msg.sender] = address(newContract);

        emit ContractCreated(msg.sender, address(newContract));
    }

    function getUserContract(address user) external view returns (address) {
        return userToContract[user];
    }
}