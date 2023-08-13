# Bonfire App Smart Contract

The official smart contract repository for Bonfire.

## Installation

Install `truffle` globally

```
npm install -g truffle
```

then, go to the project folder

```
cd bonfire-smart-contracts
```

You should be able to get started.

## Developing

To develop the project, these three commands are used extensively

```
truffle develop  # deploy contract to local network and make it interactable
truffle test # test the smart contract with the test files written in the "test" directory
truffle compile # compile the smart contracts
truffle migrate # deploy the contracts
```

For the directory structure, you can refer to the following:

- `contracts/`: Directory for Solidity contracts
- `migrations/`: Directory for scriptable deployment files
- `test/`: Directory for test files for testing your application and contracts
- `truffle.js`: Truffle configuration file

For more information, please refer to the Truffle Official Documentation: https://trufflesuite.com/docs/truffle/
