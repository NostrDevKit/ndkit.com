# Hello Nostr
Let's start with the basics. We'll ensure we have a compatible Rust toolchain installed, create a new Rust binary, post a message (event) to a couple of relays, and retrieve the message.

## Installing Rust
If you already have a working installation of the latest Rust compiler, feel free to skip to the next section.

To install the latest version of Rust, we recommend using `rustup`. Install `rustup` by following the instructions on [its website](https://rustup.rs/). Once `rustup` is installed, ensure the latest toolchain is installed by running the command:
```
rustup default stable
```

## Create a new Rust binary project
```bash
cargo new hello-nostr
cd hello-nostr
```

Go ahead and build and run the binary to ensure the toolchain works. 
```bash
cargo run
```
or
```bash
cargo build --release 
./target/release/hello-nostr
```

Both commands above should output the following: 
```
   Compiling hello-nostr v0.1.0 (/home/max/github.com/NostrDevKit/hello-nostr)
    Finished release [optimized] target(s) in 0.11s
Hello, nostr!
```

Refer back to this section whenever you need to run the program.

## Generate a Key Pair
In a later tutorial, we'll dive into key management, but for now, let's create one unsafely using an online tool. 

Go to [https://www.nostr.rest/](https://www.nostr.rest/)

Click **Generate Vanity Key Pair**

The created keypair will look something like this. Copy the Private Key.

![image](https://user-images.githubusercontent.com/32852271/222962068-2fcb3ba6-8509-48e7-950f-fe64c29c0dcb.png)

Back in our `main.rs`, let's store our private key in a `const`.
```rust
const PRIVATE_KEY: &str = "9c3654397cf1d1cf4068111e23510ed872849353756032b69ab0e475b9564450";

fn main() {
    println!("Hello, nostr!");
}
```

## Add `rust-nostr` dependency
Open `Cargo.toml` and add the `rust-nostr` dependency. You can check the latest version of the library or use the lazy way like below.

Nostr works best in a multi-threaded environment, and `tokio` is the rust library providing support for this. Add that as a dependency as well.

```toml
[dependencies]
nostr-sdk = "*"
tokio = { version = "1", features = ["full"] }
```

Add the import to the top of the `main.rs` file. 
```rust
use nostr_sdk::prelude::*;
```

## Make `async`
Update the `main` function signature to add the `tokio` tag, label it `async`, and return the `nostr_sdk::prelude::Result` type. You'll need to add the `Ok(())` statement at the end of the `main` function.

```rust
#[tokio::main]
async fn main() -> Result<()> {
    // <snip>
    Ok(())
}
```

## Load Key
We need to create an instance of the `Keys` type from our private key. Update your `main` function to the code below and run it. 
```rust
    let secret_key = SecretKey::from_str(PRIVATE_KEY).unwrap();
    let my_keys = Keys::new(secret_key);
```

Let's update the `println` to include your public key and ensure that it matches that one you created using the web tool. Your full program should look like this, except with your private key.

```rust
use nostr_sdk::prelude::*;

const PRIVATE_KEY: &str = "9c3654397cf1d1cf4068111e23510ed872849353756032b69ab0e475b9564450";

#[tokio::main]
async fn main() -> Result<()> {

    let secret_key = SecretKey::from_str(PRIVATE_KEY).unwrap();
    let my_keys = Keys::new(secret_key);

    println!("Hello, nostr! My public key is: {}", my_keys.public_key().to_string());
    Ok(())
}
```

## Create Client and Add Relay
Nostr uses relays to receive, store, and query events, and we use the `Client` type to access a relay. Let's create a client and add two relays to receive our post. Using multiple relays ensures that our content is replicated and protects creators from censorship. After adding the relays, we call `connect()`.

```rust
    let client = Client::new(&my_keys);
    client.add_relay("wss://relay.house", None).await?;
    client.add_relay("wss://relay.damus.io", None).await?;
    client.connect().await;
```

To learn more about the `async` and `await` functionality in rust, see []().

## Publish Text Note
Let's put our message into a `String` variable so we can print it and submit it to the relays.
```rust
    let message = format!("Hello, nostr! My public key is: {}", my_keys.public_key().to_string());
    println!("{}", message);
```

Then add the call to `publish_text_note` and print out the resulting event ID.
```rust 
    let event = client.publish_text_note(message, &[]).await?;
    println!("{:#?}", event);
```

Run the program and your output should look similar to this: 
```
Hello, nostr! My public key is: bed843041defdc5c9589d5b94b0cb1466454bb70ced2e5c8229702d6d0824801
EventId(
    31e893831dc57837b8deddf6c83eec73bc3c4bea068de586b982f85f1bad067b,
)
```

Congratulations, you have posted your first event!

### Again!
Run your program again and notice that the event ID changes. This is because the event ID is a hash of data that includes the timestamp, and since the time changed since the original post, the ID changed also.

## Retrieve the Event
Let's add code to retrieve the event by creating an instance of a `nostr_sdk::message::subscription::Filter` with the event ID we just created. 

```rust
    let filter = Filter::new().id(event_id);
```

Since we are sending the subscription filter to the relay **immediately** after posting our message, it is likely that the relay is not yet ready to serve it. To provide some buffer, let's add a 1 second sleep.

```rust
    time::sleep(Duration::from_secs(1)).await;
```

Then send the `Filter` to the relay via the client to retrieve a list of events that match that criteria.
```rust 
    let events = client.get_events_of(vec![filter], None).await?;
    println!("{:#?}", events);
```

The event output will look like this: 
```
Event {
    id: EventId(
        b47362dbc94548622191ca89faafffb2d66ae310e6eb9bfc025c311334845946,
    ),
    pubkey: XOnlyPublicKey(
        014882d0d6029722c8e5d2ce70bb546446b10c4bb9d589955cdcef1d0443d8be2c0dfed8f5c2b85357831dc33f5c9e13a46a956ffbb1de2252f54e689d38b5d1,
    ),
    created_at: Timestamp(
        1678032260,
    ),
    kind: TextNote,
    tags: [],
    content: "Hello, nostr! My public key is: bed843041defdc5c9589d5b94b0cb1466454bb70ced2e5c8229702d6d0824801",
    sig: Signature(b01af3f17be7e5b7140eafcc30de7738761db017d022e4e706ce080ac0747dd0a305073a1ee72bab1661253c7b38d029ea57b7f2277236d0a917f232cf07f92e),
    ots: None,
}
```

You should see two events in the results because we published the event and subsequently sent the filter to two separate relays. This is an censorship resitance through replication in action.

## Better Filtering
In practice, it's probably rare to retrieve an event by it's ID. We'd typically use criteria with other filter parameters. Let's update our program to retrieve all of the events that we've published from our key.

Filters are very powerful and include a lot of potential inputs. You can see the fields that can be used when querying for and subscribing to events. We will add our public key to the `authors` parameter.

```rust
    let filter = Filter {
        ids: None,
        authors: Some(vec![my_keys.public_key()]),
        kinds: None,
        events: None,
        pubkeys: None,
        hashtags: None,
        references: None,
        search: None,
        since: None,
        until: None,
        limit: None,
    };
```

Re-run the program and you should see all of the events that you have posted as part of this tutorial.

In a future tutorial, we will dive into each of the parameters that can be used when filtering and subscribing.

In this simple tutorial, we ensured that we have the Rust toolchain installed, created a new Rust binary, posted a message (event) to a couple of relays, and retrieved the message.

## Tutorial Repo

[Hello Nostr application code repository](https://github.com/NostrDevKit/hello-nostr)