# Building a Node

## Introduction
In this guide, we'll be walking through how to build a Lightning node using LDK in Java.

The process breaks down to 3 overarching steps:
1. Initializing LDK's channel, peer, chain monitoring, and (optionally) routing objects on startup.
   * These objects will be parameterized by various other objects that can be from either your custom logic or one of LDK's supplied modules.
2. Starting loops to (a) poll for new peers and (b) periodically nudge the channel and peer objects so they can properly maintain their state.
3. Connect and disconnect blocks to LDK as they come in.

## Part 1: Startup
// start w/ a diagram
// could use a mac to do that

### Chain Monitoring
At a high level, the first step is initializing a [`ChainMonitor` struct](https://docs.rs/lightning/0.0.12/lightning/chain/chainmonitor/struct.ChainMonitor.html) using [this]. See an example in one of our tests [in Java].

This will look something like this:
```java
  logger = Logger.new_impl((String arg) -> System.out.println(seed + ": " + arg));
  fee_estimator = FeeEstimator.new_impl((confirmation_target -> 253));
  tx_broadcaster = BroadcasterInterface.new_impl(tx -> {
    // bro
  });
```

