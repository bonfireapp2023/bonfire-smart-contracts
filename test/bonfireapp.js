const BonfireApp = artifacts.require("BonfireApp");

contract("BonfireApp", (accounts) => {
  it("should add access properly", async () => {
    const BonfireAppInstance = await BonfireApp.deployed();

    const ownerAccount = accounts[0];
    const requesterAccount1 = accounts[1];
    const requesterAccount2 = accounts[2];

    await BonfireAppInstance.addAccess(requesterAccount1, {
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

    assert.equal(
      account1Permission,
      true,
      "Requester account was not added to whitelist of owner account"
    );
    assert.equal(
      account2Permission,
      false,
      "Non-added account was included in whitelist"
    );
  });

  it("should revoke access properly", async () => {
    const BonfireAppInstance = await BonfireApp.deployed();

    const ownerAccount = accounts[0];
    const requesterAccount1 = accounts[1];

    // we can straight up delete it since it persists operation from the last test
    await BonfireAppInstance.deleteAccess(requesterAccount1, {
      from: ownerAccount,
    });

    const account1Permission = await BonfireAppInstance.checkPermission.call(
      ownerAccount,
      requesterAccount1
    );

    assert.equal(
      account1Permission,
      false,
      "Requester account was not removed from the owner account whitelist"
    );
  });

  // TODO: rewrite this test suite
  it("should correctly show allowed addresses for a particular owner address", async () => {
    const BonfireAppInstance = await BonfireApp.deployed();

    const ownerAccount = accounts[0];
    const requesterAccount1 = accounts[1];
    const requesterAccount2 = accounts[2];
    console.log(ownerAccount + " " + requesterAccount1 + " " +  requesterAccount2);

    await BonfireAppInstance.addAccess(requesterAccount1, {
      from: ownerAccount,
    });

    await BonfireAppInstance.addAccess(requesterAccount2, {
      from: ownerAccount,
    });

    const allowedAccounts = await BonfireAppInstance.getAllowedRequestersForOwner.call(ownerAccount);

    console.log(allowedAccounts);
    console.log( [requesterAccount1, requesterAccount1, requesterAccount2]);

    assert.equal(
      allowedAccounts[0],
      requesterAccount1,
      "Incorrect allowed accounts list"
    );
    assert.equal(
      allowedAccounts[1],
      requesterAccount1,
      "Incorrect allowed accounts list"
    );
    assert.equal(
      allowedAccounts[2],
      requesterAccount2,
      "Incorrect allowed accounts list"
    );
  });

  // TODO: rewrite this test suite
  it("should correctly show owners whom allow access for a particular requester address", async () => {
    const BonfireAppInstance = await BonfireApp.deployed();

    const ownerAccount1 = accounts[3];
    const ownerAccount2 = accounts[4];
    const requesterAccount1 = accounts[5];

    await BonfireAppInstance.addAccess(requesterAccount1, {
      from: ownerAccount1,
    });

    await BonfireAppInstance.addAccess(requesterAccount1, {
      from: ownerAccount2,
    });

    const owners = await BonfireAppInstance.getAllowedOwnersForRequester.call(
      requesterAccount1
    );

    console.log({ owners });

    assert.equal(
      owners,
      [ownerAccount1, ownerAccount2],
      "Incorrect owners list"
    );
  });
});
