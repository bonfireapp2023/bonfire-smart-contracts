// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;

contract BonfireApp {
    enum AccessLevel {
        NONE,
        READ,
        READ_WRITE
    }

    struct MapValue {
        AccessLevel value;
        bool isLoaded;
    }

    // shows the addresses that the key allows access to
    mapping(address => mapping(address => MapValue)) requestersForOwner;
    mapping(address => address[]) requesterForOwnerKeys;

    // show the addresses that the key is allowed access to
    mapping(address => mapping(address => MapValue)) ownersForRequester;
    mapping(address => address[]) ownersForRequesterKeys;

    modifier isElevatedPermission(AccessLevel _accessLevel) {
        require(
            _accessLevel > AccessLevel.NONE &&
                _accessLevel <= AccessLevel.READ_WRITE,
            "Please set to READ (1) or READ_WRITE (2)"
        );

        _;
    }

    function getAllowedRequestersForOwner(
        address _address,
        AccessLevel _accessLevel
    )
        public
        view
        isElevatedPermission(_accessLevel)
        returns (address[] memory)
    {
        address[] memory allowedRequesters = requesterForOwnerKeys[_address];
        address[] memory result = new address[](allowedRequesters.length);
        uint resultCounter = 0;
        for (uint i = 0; i < allowedRequesters.length; i++) {
            AccessLevel currentAccessLevel = requestersForOwner[_address][
                allowedRequesters[i]
            ].value;
            if (currentAccessLevel >= _accessLevel) {
                result[resultCounter] = allowedRequesters[i];
                resultCounter++;
            }
        }

        return result;
    }

    function getAllowedOwnersForRequester(
        address _address,
        AccessLevel _accessLevel
    )
        public
        view
        isElevatedPermission(_accessLevel)
        returns (address[] memory)
    {
        address[] memory allowedAccessOwners = ownersForRequesterKeys[_address];
        address[] memory result = new address[](allowedAccessOwners.length);
        uint resultCounter = 0;
        for (uint i = 0; i < allowedAccessOwners.length; i++) {
            AccessLevel currentAccessLevel = ownersForRequester[_address][
                allowedAccessOwners[i]
            ].value;
            if (currentAccessLevel >= _accessLevel) {
                result[resultCounter] = allowedAccessOwners[i];
                resultCounter++;
            }
        }

        return result;
    }

    function checkPermission(
        address _owner,
        address _requester
    ) public view returns (AccessLevel) {
        return requestersForOwner[_owner][_requester].value;
    }

    function addAccess(
        address _requester,
        AccessLevel _accessLevel
    ) public isElevatedPermission(_accessLevel) {
        if (!requestersForOwner[msg.sender][_requester].isLoaded) {
            requesterForOwnerKeys[msg.sender].push(_requester);
        }

        if (!ownersForRequester[_requester][msg.sender].isLoaded) {
            ownersForRequesterKeys[_requester].push(msg.sender);
        }

        requestersForOwner[msg.sender][_requester].value = _accessLevel;
        requestersForOwner[msg.sender][_requester].isLoaded = true;
        ownersForRequester[_requester][msg.sender].value = _accessLevel;
        ownersForRequester[_requester][msg.sender].isLoaded = true;
    }

    function deleteAccess(address _requester) public {
        requestersForOwner[msg.sender][_requester].value = AccessLevel.NONE;
        ownersForRequester[_requester][msg.sender].value = AccessLevel.NONE;
    }
}
