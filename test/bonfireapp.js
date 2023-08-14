const BonfireApp = artifacts.require("BonfireApp");

// permission enums: NONE, READ, READWRITE
const NONE = 0;
const READ = 1;
const READ_WRITE = 2;

contract("BonfireApp", (accounts) => {
  it("should add access properly", async () => {
    const BonfireAppInstance = await BonfireApp.deployed();

    const ownerAccount = accounts[0];
    const requesterAccount1 = accounts[1];
    const requesterAccount2 = accounts[2];
    const requesterAccount3 = accounts[3];

    await BonfireAppInstance.addAccess(requesterAccount1, READ, {
      from: ownerAccount,
    });

    await BonfireAppInstance.addAccess(requesterAccount2, READ_WRITE, {
      from: ownerAccount,
    });

    const account1Permission = await BonfireAppInstance.checkPermission.call(
      ownerAccount,
      requesterAccount1
    );

    const account2Permission = await BonfireAppInstance.checkPermission.call(
      ownerAccount,
      requesterAccount2
    );

    const account3Permission = await BonfireAppInstance.checkPermission.call(
      ownerAccount,
      requesterAccount3
    );

    assert.equal(
      account1Permission,
      READ,
      "Access level for account 1 should be READ"
    );
    assert.equal(
      account2Permission,
      READ_WRITE,
      "Access level for account 2 should be READ_WRITE"
    );
    assert.equal(
      account3Permission,
      NONE,
      "Access level for account 3 should be NONE"
    );
  });

  it("should revoke access properly", async () => {
    const BonfireAppInstance = await BonfireApp.deployed();

    const ownerAccount = accounts[0];
    const requesterAccount1 = accounts[1];
    const requesterAccount2 = accounts[2];
    const requesterAccount3 = accounts[3];

    await BonfireAppInstance.deleteAccess(requesterAccount1, {
      from: ownerAccount,
    });

    await BonfireAppInstance.deleteAccess(requesterAccount2, {
      from: ownerAccount,
    });

    await BonfireAppInstance.deleteAccess(requesterAccount3, {
      from: ownerAccount,
    });

    const account1Permission = await BonfireAppInstance.checkPermission.call(
      ownerAccount,
      requesterAccount1
    );

    assert.equal(
      account1Permission,
      NONE,
      "Access level for account 1 should be NONE"
    );
  });

  // TODO: rewrite this test suite
  it("should correctly show allowed addresses for a particular owner address", async () => {
    const BonfireAppInstance = await BonfireApp.deployed();

    const ownerAccount = accounts[0];
    const requesterAccount1 = accounts[1];
    const requesterAccount2 = accounts[2];

    await BonfireAppInstance.addAccess(requesterAccount1, READ, {
      from: ownerAccount,
    });

    await BonfireAppInstance.addAccess(requesterAccount2, READ_WRITE, {
      from: ownerAccount,
    });

    const allowedAccountsRead =
      await BonfireAppInstance.getAllowedRequestersForOwner.call(
        ownerAccount,
        READ
      );

    const allowedAccountsReadWrite =
      await BonfireAppInstance.getAllowedRequestersForOwner.call(
        ownerAccount,
        READ_WRITE
      );

    assert.equal(
      allowedAccountsRead,
      [requesterAccount1, requesterAccount2],
      "Incorrect allowed accounts list for READ"
    );

    assert.equal(
      allowedAccountsReadWrite,
      [requesterAccount2],
      "Incorrect allowed accounts list for READ_WRITE"
    );
  });

  // TODO: rewrite this test suite
  it("should correctly show owners whom allow access for a particular requester address", async () => {
    const BonfireAppInstance = await BonfireApp.deployed();

    // NOTE: shared state from last block
    const ownerAccount1 = accounts[0];
    const ownerAccount2 = accounts[4];
    const requesterAccount1 = accounts[1];

    await BonfireAppInstance.addAccess(requesterAccount1, READ_WRITE, {
      from: ownerAccount2,
    });

    const ownersRead =
      await BonfireAppInstance.getAllowedOwnersForRequester.call(
        requesterAccount1,
        READ
      );

    const ownersReadWrite =
      await BonfireAppInstance.getAllowedOwnersForRequester.call(
        requesterAccount1,
        READ_WRITE
      );

    assert.equal(
      ownersRead,
      [ownerAccount1, ownerAccount2],
      "Incorrect owners list for READ"
    );

    assert.equal(
      ownersReadWrite,
      [ownerAccount2],
      "Incorrect owners list for READ_WRITE"
    );
  });
});
