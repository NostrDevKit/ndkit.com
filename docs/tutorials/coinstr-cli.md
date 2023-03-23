# Coinstr CLI
This Coinstr CLI tutorial provides a step by step command line demo of using Coinstr to create and spend with a 2-of-2 multisignature. Step by step video included.]

## Step by Step - 2 of 2 Multisig
This step by step guide shows how to create a 2 of 2 multisignature Bitcoin transaction using `coinstr-cli`. 

For this tutorial, you'll need to [install rust](https://rustup.rs) and also build Coinstr.

## Step 1. Build Coinstr
```bash
git clone https://github.com/NostrDevKit/coinstr.git
cd coinstr
cargo build --release
```

## Step 2. Setup Keys
Create keys and save them to keychains. I've used the keychain names of `frank` and `gary`.

> NOTE: Mnemonics will be printed but they don't need to be saved for this tutorial.

`--password` is for encrypting your local keechain file, while `--passphrase` is applied to your mnemonic and alters the keys. Below, the password is set to `1234` and I am not using a passphrase.

```
./target/release/coinstr-cli --network testnet generate --password 1234 --passphrase "" frank
./target/release/coinstr-cli --network testnet generate --password 1234 --passphrase "" gary
```

### Inspect Keys

We can inspect the keys we just created by running: 
```bash
COINSTR_PASSWORD=1234 ./target/release/coinstr-cli --network testnet inspect frank
```

This will show the mnemonic as well as useful key-related derived information for both Nostr and Bitcoin.

```
Mnemonic: document now all cable kitten recall outside song liquid still sister engine
Passphrase: 

Nostr
 Bech32 Keys
  Public   : npub1tes4288tq3fprqwe44qzjh3jmnjac4sfc3sj5v3em0rqcvqgphxsj7652f 
  Private  : nsec1t5845hnslzfvveyazj3nlcy69qxz5564v5qh5mrueewcavxexmuqx2yv0h 
 Hex Keys
  Public   : 5e61551ceb04521181d9ad40295e32dce5dc5609c4612a3239dbc60c30080dcd 
  Private  : 5d0f5a5e70f892c6649d14a33fe09a280c2a535565017a6c7cce5d8eb0d936f8 
  Normalized Public   : 035e61551ceb04521181d9ad40295e32dce5dc5609c4612a3239dbc60c30080dcd 

Bitcoin
  Root Private Key: tprv8ZgxMBicQKsPfDBozE3WYukpnYybXyUfFMAFbqARzft6USFZJpkkUQSzgo7FCew2zNbdbmnttL57qh3HLkBUd59TGonUBw2rTcENe8hMvLt
  Extended Pub Key: tpubD6NzVbkrYhZ4YgDbssi6xKQwMaVXhJfZpem2tMCjQwgVJvWKwDaLeu4rrtRLSxUfZxBpMHCgL7zEsbjTDx8FuttBq49Hvnfddxmw5wyWaq3
  Output Descriptor: tr([b3de2233/86'/1'/0']tpubDDr2LYycsYfkApXGXpsTKXz9yuwSYeeuPyNHTiS3bVzM3ab7CZifpVmk9CJxBa5Ueu5uakusH1NWWitQ1Kg8fwnVc6H9ad7RcSUSBx9GujA/0/*)#nhpcgk5a
  Change Descriptor: tr([b3de2233/86'/1'/0']tpubDDr2LYycsYfkApXGXpsTKXz9yuwSYeeuPyNHTiS3bVzM3ab7CZifpVmk9CJxBa5Ueu5uakusH1NWWitQ1Kg8fwnVc6H9ad7RcSUSBx9GujA/1/*)#zrye4ry9
  Ext Address 1: tb1pm5c5gpx4ljcg2qykhqkc3hr45mlphupqmh4kqyxt6wzhe4wk06rsh282k6
  Ext Address 2: tb1pwg8mpatfm9fj5lavehfrrjr6yfm2043tjxf4dm05fgff7ha6an9s3y20d6
  Change Address: tb1puakeecj6vuar3tvce7c7l6wxvj2tajjps2yesa24qhrk62jwzkpsggxmes
```

## Step 2: Create the 2-of-2 Policy
Using miniscript, we will create a 2 of 2 multisignature policy that follows this format: 
```
thresh(2,pk(<FRANK_PUBKEY>),pk(<GARY_PUBKEY>))
```

Inspect the keys you created above and paste your Nostr HEX public key into the miniscript template.

So, the miniscript for our 2 of 2 policy is (your keys will be different):
```
thresh(2,pk(5e61551ceb04521181d9ad40295e32dce5dc5609c4612a3239dbc60c30080dcd),pk(d223b67e6091ef0665188a4016d20a51a7bbb1b240fafc4429bf1329527338d1))
```

## Step 3: Save the Policy 
Save the policy using the key, policy name, policy description, and the output descriptor.

```
COINSTR_PASSWORD=1234 \
./target/release/coinstr-cli save-policy \
    frank \
    "Multisig 2 of 2" \
    "Testing multisig as part of the Coinstr CLI tutorial" \
    "thresh(2,pk(5e61551ceb04521181d9ad40295e32dce5dc5609c4612a3239dbc60c30080dcd),pk(d223b67e6091ef0665188a4016d20a51a7bbb1b240fafc4429bf1329527338d1))"
```

Now you can review the saved policies for frank using the following command: 
```
COINSTR_PASSWORD=1234 ./target/release/coinstr-cli get policies frank
```

Produces: 
```
+---+------------------------------------------------------------------+-----------------+------------------------------------------------------+
| # | ID                                                               | Name            | Description                                          |
+===+==================================================================+=================+======================================================+
| 1 | e2927eabd79c817df2e7e16be9f6125bba979259f41efe0f22cc9a33fc2b9824 | Multisig 2 of 2 | Testing multisig as part of the Coinstr CLI tutorial |
+---+------------------------------------------------------------------+-----------------+------------------------------------------------------+
```

You can see the details of the policy by calling `get policy`: 
```
COINSTR_PASSWORD=1234 ./target/release/coinstr-cli --network testnet \
    get policy \
    frank \
    e2927eabd79c817df2e7e16be9f6125bba979259f41efe0f22cc9a33fc2b9824
```

> NOTE: Gary has the same policy saved into his list.

Produces the following output: 
```
Policy
- ID: e2927eabd79c817df2e7e16be9f6125bba979259f41efe0f22cc9a33fc2b9824
- Name: Multisig 2 of 2
- Description: Testing multisig as part of the Coinstr CLI tutorial
- Descriptor
└── id -> 8hmw3yl0
    └── 👑 Threshold Condition   : 1 of 2 
        ├── id -> en4snfs4
        │   └── 🔑 Schnorr Sig of  <xonly-pk:bbbc8e8b39d46a289a51bd5029dde3c946b9e97be935dc1e59845aa3b36ae101>
        └── id -> eh682v0m
            └── 🤝 MultiSig  :  2 of 2
                ├── 🔑 <xonly-pk:5e61551ceb04521181d9ad40295e32dce5dc5609c4612a3239dbc60c30080dcd>
                └── 🔑 <xonly-pk:d223b67e6091ef0665188a4016d20a51a7bbb1b240fafc4429bf1329527338d1>

Balances
- Immature            	: 0 sats
- Trusted pending     	: 0 sats
- Untrusted pending   	: 0 sats
- Confirmed           	: 0 sats

Deposit address: tb1pw3kszzyg67crrevpgxnfkyh3zn045hdqp56cgspkufvuefz9rllszm7kss
```

## Step 4: Get Testnet BTC from Faucet
Use the [testnet bitcoin faucet](https://testnet-faucet.com/btc-testnet/) to request BTC for our policy. The deposit address is at the bottom of the output above.

## Step 5: Generate a Spend Proposal
We will create the spend proposal from Alice's perspective. to create a spend proposal: 
```
Usage: coinstr-cli spend <NAME> <POLICY_ID> <TO_ADDRESS> <AMOUNT> <MEMO>
```
```
COINSTR_PASSWORD=1234 ./target/release/coinstr-cli --network testnet spend \
    frank \
    e2927eabd79c817df2e7e16be9f6125bba979259f41efe0f22cc9a33fc2b9824 \
    mohjSavDdQYHRYXcS3uS6ttaHP8amyvX78 \
    1000 \
    "Send back to the faucet"
```
You can now view the spend proposal:
```
COINSTR_PASSWORD=1234 ./target/release/coinstr-cli get proposals frank
```
Create the below table: 
```
+---+------------------------------------------------------------------+-----------+-------------------------+------------------------------------+------------+
| # | ID                                                               | Policy ID | Memo                    | Address                            | Amount     |
+===+==================================================================+===========+=========================+====================================+============+
| 1 | 04ecf276638dc441aaac9eb8d6ae884f907e63d7f65d302515de5ada001d1e0e | e2927eabd | Send back to the faucet | mohjSavDdQYHRYXcS3uS6ttaHP8amyvX78 | 1 000 sats |
+---+------------------------------------------------------------------+-----------+-------------------------+------------------------------------+------------+
```

## Step 6: Approve a Spend Proposal
Now we need to approve the proposal from both Alice and Bob's perspective.
```
./target/release/coinstr-cli --network testnet approve \
    frank \
    04ecf276638dc441aaac9eb8d6ae884f907e63d7f65d302515de5ada001d1e0e

./target/release/coinstr-cli --network testnet approve \
    gary \
    04ecf276638dc441aaac9eb8d6ae884f907e63d7f65d302515de5ada001d1e0e
```

> NOTE: if you try to broadcast the transaction before it is finalized, you will get an error such as `PSBT not finalized: [InputError(CouldNotSatisfyTr, 0), InputError(CouldNotSatisfyTr, 1)]`.


## Step 7: Broadcast the Transaction
```
./target/release/coinstr-cli --network testnet broadcast \
    gary \
    04ecf276638dc441aaac9eb8d6ae884f907e63d7f65d302515de5ada001d1e0e
```

You will get a transaction-id that you can view with a block explorer: 
```
Transaction 56294f3e8071d621d7158d2c2690faf05e9b7a81aeed7e6e6f312b0a8eb6e5b5 broadcasted

Explorer: https://blockstream.info/testnet/tx/56294f3e8071d621d7158d2c2690faf05e9b7a81aeed7e6e6f312b0a8eb6e5b5 
```
