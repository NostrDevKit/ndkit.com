# Hello World
Let's start with the basics. We'll ensure we have a compatible Rust toolchain installed, create a new Rust binary, and post a message to a relay.

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
Hello, world!
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
    println!("Hello, world!");
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

    println!("Hello, world! My public key is: {}", my_keys.public_key().to_string());
    Ok(())
}
```

## Create Client and Add Relay
Nostr uses relays to receive, store, and query events, and we use the `Client` type to access a relay. Let's create a client and add two relays to receive our post. Using multiple relays ensures that our content is replicated and protects creators from censorship.

```rust
    let client = Client::new(&my_keys);
    client.add_relay("wss://relay.house", None).await?;
    client.add_relay("wss://relay.damus.io", None).await?;
```

To learn more about the `async` and `await` functionality in rust, see []().

## Publish Text Note
Let's put our message into a `String` variable so we can print it and submit it to the relays.
```rust
    let message = format!("Hello, world! My public key is: {}", my_keys.public_key().to_string());
    println!("{}", message);
```

Then add the call to `publish_text_note` and print out the resulting event.
```rust 
    let event = client.publish_text_note(message, &[]).await?;
    println!("{:#?}", event);
```

Run the program and your output should look similar to this: 
```
Hello, world! My public key is: bed843041defdc5c9589d5b94b0cb1466454bb70ced2e5c8229702d6d0824801
EventId(
    31e893831dc57837b8deddf6c83eec73bc3c4bea068de586b982f85f1bad067b,
)
```

Congratulations, you have posted your first event!

### Again!
Run your program again and notice that the event ID changes. This is because the event ID is a hash of data that includes the timestamp, and since the time changed since the original post, the ID changed also.

## Retrieve the Event
Let's add code to retrieve the event by creating an instance of a `nostr_sdk::message::subscription::Filter` with the event ID we just created. 

Filters are very powerful and include a lot of potential inputs. We will set all of them to `None` except for the `ids` field.

```rust
let filter = Filter {
        ids: Some(vec![event.to_string()]),
        authors: None,
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

We send the `Filter` to the relay via the client to retrieve a list of events that match that criteria.
```rust 



