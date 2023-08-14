// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

// TODO: multiple access levels

contract BonfireApp {
    // shows the addresses that the key allows access to
    mapping(address => mapping(address => bool)) requestersForOwner;
    mapping(address => address[]) requesterForOwnerKeys;

    // show the addresses that the key is allowed access to
    mapping(address => mapping(address => bool)) ownersForRequester;
    mapping(address => address[]) ownersForRequesterKeys;

    function getAllowedRequestersForOwner(
        address _address
    ) public view returns (address[] memory) {
        // TODO: fix duplicate address bug
        address[] memory allowedRequesters = requesterForOwnerKeys[_address];
        address[] memory result = new address[](allowedRequesters.length);
        uint resultCounter = 0;
        for (uint i = 0; i < allowedRequesters.length; i++) {
            if (requestersForOwner[_address][allowedRequesters[i]]) {
                result[resultCounter] = allowedRequesters[i];
                resultCounter++;
            }
        }

        return result;
    }

    function getAllowedOwnersForRequester(
        address _address
    ) public view returns (address[] memory) {
        // TODO: fix duplicate address bug
        address[] memory allowedAccessOwners = ownersForRequesterKeys[_address];
        address[] memory result = new address[](allowedAccessOwners.length);
        uint resultCounter = 0;
        for (uint i = 0; i < allowedAccessOwners.length; i++) {
            if (ownersForRequester[_address][allowedAccessOwners[i]]) {
                result[resultCounter] = allowedAccessOwners[i];
                resultCounter++;
            }
        }

        return result;
    }

    function checkPermission(
        address _owner,
        address _requester
    ) public view returns (bool) {
        return requestersForOwner[_owner][_requester];
    }

    function addAccess(address _requester) public {
        requestersForOwner[msg.sender][_requester] = true;
        ownersForRequester[_requester][msg.sender] = true;
        requesterForOwnerKeys[msg.sender].push(_requester);
        ownersForRequesterKeys[_requester].push(msg.sender);
    }

    function deleteAccess(address _requester) public {
        requestersForOwner[msg.sender][_requester] = false;
        ownersForRequester[_requester][msg.sender] = false;
    }
}
