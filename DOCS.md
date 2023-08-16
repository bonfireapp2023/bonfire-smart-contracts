# Bonfire Smart Contract Documentation

## Enums

### Access Level

| Enum         | Value |
| ------------ | ----- |
| `NONE`       | 0     |
| `READ`       | 1     |
| `READ_WRITE` | 2     |

## Read Functions

### getAllowedRequestersForOwner

> Get addresses whom owner (`_address`) has granted permission as specified within the `_accessLevel` param. Note that some of the address array may be padded with the `0x0` address, please process this on your side

Params

```
address _address,
AccessLevel _accessLevel
```

Response

```
address[] allowedRequesters
```

### getAllowedOwnersForRequester

> Get addresses whom this user (`_address`) has permission to with the level as specified within the `_accessLevel` param. Note that some of the address array may be padded with the `0x0` address, please process this on your side

Params

```
address _address,
AccessLevel _accessLevel
```

Response

```
address[] allowedOwners
```

### checkPermission

> Checks the permission level of `_requester` with respect to the `_owner`

Params

```
address _owner,
address _requester
```

Response

```
AccessLevel the access level that this user has for this particular data owner
```

## Write Functions

### addAccess

> Set access level to the desired level (Note: the owner is the transaction sender).

Params

```
address _requester,
AccessLevel _accessLevel
```

Response

```
none
```

### deleteAccess

> Removes access level to a `_requester` address (Note: the owner is the transaction sender). The access level should become `NONE` after this function

Params

```
address _requester
```

Response

```
none
```
