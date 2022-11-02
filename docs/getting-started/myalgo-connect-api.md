---
sidebar_position: 2
---

# MyAlgo Connect API

## constructor

Create an instance of `MyAlgoConnect`.

#### Signature and types

```ts
export interface Options {
	timeout?: number;
	bridgeUrl?: string;
	disableLedgerNano?: boolean;
}

constructor(options?: Options);
```

#### Params

Object `options` may have the following fields:

 - `timeout`: Number of msec to wait the popup response, default value: 1600000 msec.
 - `bridgeUrl`: Override `wallet.myalgo.com` default url
 - `disableLedgerNano`: Disable ledger nano accounts and return only mnemonic accounts.

## connect()

Request the user to give access to the dapp and which account(s) to share (only the public data).
In order to request a signature from the user or have the user approve a transaction, one must be able to access the user's wallet address.
Connect method allows the dapp to know the list of addresses allowed by the user for future signatures.

The Connect method is agnostic to all networks.

#### Signature and types

```jsx
export interface Accounts {
  address: Address;
  name: string;
}

export interface ConnectionSettings {
  shouldSelectOneAccount?: boolean; 
  openManager?: boolean;
}

connect(settings?: ConnectionSettings): Promise<Accounts[]>;
```

#### Params

Object `settings` may have the following fields:

- `shouldSelectOneAccount`: Users are allowed to select just one account. Default is false.

- `openManager`: Users are sent to **Manage Account** to allow it to change the current wallet(s) selected. Default is false.

#### Response

Returns an array of Account objects, which contains the public wallet(s) data selected by the user in the “Manage your account” section.

```json
[
  {
    "address": "46QNIYQEMLKNOBTQC56UEBBHFNH37EWLHGT2KGL3ZGB4SW77W6V7GBKPDY",
    "name": "Wallet #1"
  }
]
```

If the user closes the popup, Promise will be rejected with an error message. These cases need to be handled by the application.

## signTxns()

Sign a set of transactions. This method is [ARC-0001](https://github.com/algorandfoundation/ARCs/blob/a3a8cfa078de98977eaa5f00553c61547db7e953/ARCs/arc-0001.md) compliant and is preferred over `signTransaction`.

#### Signature and types

For more information and details on types and semantics, see the [ARC syntax and interfaces](https://github.com/algorandfoundation/ARCs/blob/a3a8cfa078de98977eaa5f00553c61547db7e953/ARCs/arc-0001.md#syntax-and-interfaces) section.

```ts

export type Address = string;
export type Base64 = string;
export type TxnStr = Base64;
export type SignedTxnStr = Base64;

export interface MultisigMetadata {
	version: number;
	threshold: number;
	addrs: Address[];
}

export interface WalletTransaction {
	txn: TxnStr;
	authAddr?: Address;
	msig?: MultisigMetadata;
	signers?: Address[];
	stxn?: SignedTxnStr;
	message?: string;
	groupMessage?: string;
}

export interface SignTxnsOpts {
	message?: string;
}

export interface SignTxnsError extends Error {
	code: number;
	data?: any;
}

signTxns(txns: WalletTransaction[], opts?: SignTxnOpts): Promise<(SignedTxnStr | null)[]>;
```

#### Response

`signTxns` returns an array with the base64 string encoded signatures of each transaction, or null for transactions that do not require signing.

#### Considerations

Unlike `signTransaction`, when signing a group all transactions that belong to that group must be present. MyAlgoConnect verifies that the computed group ID of the received transaction matches the `group` field present in them. If there are transactions that must not be signed (e.g. that are signed by another party, or by a logic sig), then use an empty `signers` array.

The following `WalletTransaction` setting are not yet implemented:
 * `authAddr`
 * `msig`
 * `message`
 * `groupMessage`

Trying to sign a WalletTransaction with any of this fields will throw an unsupported operation error (code `4200`).

The `SignTxnsOpts` `message` setting is not yet implemented.

## signTransaction()

Allows you to send Algorand transaction(s) to MyAlgo Connect to be signed by the user.
Transactions will be validated against our own set of validations and then for the AlgoSDK, just in case some transaction fails, the whole set of transactions will be rejected.

#### Signature and types

```jsx
export type Address = string;
export type Base64 = string;
export type TxHash = string;
export type EncodedTransaction = Base64 | Uint8Array;
export type AlgorandTxn = PaymentTxn | AssetTxn | AssetConfigTxn | AssetCreateTxn | DestroyAssetTxn | FreezeAssetTxn | KeyRegTxn | ApplTxn;
 
export interface SignedTx {
   txID: TxHash;
   blob: Uint8Array;
}

export interface SignTransactionOptions {
	overrideSigner?: Address;
}

signTransaction(transaction: AlgorandTxn | EncodedTransaction | AlgorandTxn[] | EncodedTransaction[], signOptions?: SignTransactionOptions ): Promise<SignedTx | SignedTx[]>;
```

#### Params

- `transaction`: an array or a single transaction of the following types: **AlgorandTxn**, **EncodedTransaction**.

Optional object `signOptions` may have the following field:

- `overrideSigner`: Force transactions to be signed with the specified account instead of the from/auth address.

#### Response

Calling `signTransaction` with an array of transactions will return an array of a SignedTx object.

```json
[
   {
       "txID": "XC2PBS2UM4AQOVW47G6INYC7RNGSOHWRXGPOAPHLY74JOJY6C3QA",
       "blob": {
        "0": 130,
        "1": 163,
        ...
        "245": 97,
        "246": 121
       }
   },
   {
       "txID": "E2S4JVCC76PBW6UBLMOKZA2CSJE36OFBRJEZY3AGFZMIRSFSEZKQ",
       "blob": {
        "0": 130,
        "1": 163,
        ...
        "245": 97,
        "246": 121
       }
   }
]
```

Otherwise, it will return a SignedTx object.

```json
{
  "txID": "XC2PBS2UM4AQOVW47G6INYC7RNGSOHWRXGPOAPHLY74JOJY6C3QA",
  "blob": {
  "0": 130,
  "1": 163,
  ...
  "245": 97,
  "246": 121
  }
}
```

#### Considerations

- Transactions that are sent to sign must have the same network. Otherwise, they will be rejected.
- Different addresses are allowed to be specified as a sender (“from”) in transaction(s), however, the address(es) should be a subset of the accounts shared by the user previously selected in the connect method.
- Rekey transactions will be signed by the corresponding wallet in case it belongs to the set of wallet shared by the user, this process is automatic and you don’t need to do anything in particular.

## signLogicSig()

Sends to MyAlgo Connect an Algorand program to be signed by the user.

#### Signature and types

```jsx
export type Address = string;
export type Base64 = string;

signLogicSig(logic: Uint8Array | Base64, address: Address): Promise<Uint8Array>;
```

#### Params

 - `Logic`:  TEAL program to be signed by the user.

 - `Address`: Signer’s Address.

#### Response

```json
// Uint8Array
[ 248, 77, 132, ..., 28, 131, 14]
```

## tealSign()

Sign an arbitrary piece of data which can be verified by a smart contract through the [ed25519verify](https://developer.algorand.org/docs/get-details/dapps/avm/teal/opcodes/#ed25519verify) opcode.

See also: [algosdk tealSign](https://algorand.github.io/js-algorand-sdk/modules.html#tealSign)

#### Signature and types

```jsx
export type Address = string;
export type Base64 = string;

tealSign(data: Uint8Array | Base64, contractAddress: Address, address: Address): Promise<Uint8Array>;
```

#### Params

 - `data`: The arbitrary piece of data to sign

 - `contractAddress`: Contract address/TEAL program hash, which can verify the signature.

 - `address`: Signer address

#### Response

Returns the signature of the data

```js
// Uint8Array
[ 248, 77, 132, ..., 28, 131, 14 ]
```

#### Considerations

- This operation is supported only by mnemonic accounts. Ledger accounts are not supported.


## signBytes()

Sign an arbitrary piece of data. The signature can be verified through `algosdk.verifyBytes`.

The bytes to sign are prepended with the `MX` preffix. That is, the final signature is that of both arrays concatenated (`MX | data`).

See also: [algosdk signBytes](https://algorand.github.io/js-algorand-sdk/modules.html#signBytes)

#### Signature and types

```jsx
export type Address = string;

signBytes(data: Uint8Array, address: Address): Promise<Uint8Array>;
```

#### Params

 - `data`: The arbitrary piece of data to sign

 - `address`: Signer address

#### Response

Returns the signature of the data preppended with the `MX` preffix.

```js
// Uint8Array
[ 248, 77, 132, ..., 28, 131, 14 ]
```

#### Considerations

- This operation is supported only by mnemonic accounts. Ledger accounts are not supported.
