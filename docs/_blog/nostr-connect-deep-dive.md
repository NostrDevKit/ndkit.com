---
title: "Nostr Connect Technical Deep Dive"
description: "technical deep dive into the Nostr Connect (NIP-46) protocol"
date : "2023-03-14"
authors: 
  - "Max Gravitt"
---

Nostr Connect can be used to create a seamless flow where users do their work in the browser, while signing using their devices safely and securely. This articles describes the UX and specific message flows for how a circuit is created and how Bob can login to update and publish his work from multiple devices.

This video is a demo of the rust-nostr libraries that implement NIP-46.

<iframe width="560" height="315" src="https://www.youtube.com/embed/dhPV58k9YNY" frameborder="0" allowfullscreen></iframe>

# Nostr Connect Step-by-Step
### 📱 Logging In
![image](https://user-images.githubusercontent.com/32852271/224999471-a10e4deb-ddbe-49d9-8811-ee3740097f6a.png)

<font color=red>msg 1.</font> The webapp uses its private key to post a message to the relay that is awaiting for a party to establish a session. It also make a QR code or `nostrconnect://` link available on the site to scan. The `nostrconnect` string is static, and so the QR code is as well. 

The URI string has a format like the `uri` below. 
```javascript
const pubkey = "pubkey-representing-the-browser"
```
```javascript
const relay = "wss://which-relay-the-parties-will-use-to-bounce-events.com"
```
```javascript
const applicationName = "Content Authoring Application Name"
```
```javascript
const uri = `nostrconnect://${pubkey}?relay=${encodeURIComponent(relay)}&
                metadata=${encodeURIComponent(JSON.stringify({"name": applicationName}))}`
```

<font color=red>msg 2.</font> Bob scans the the QR code and is asked whether to approve sending a Login proof to the WebApp in Bob's Browser.

<font color=red>msg 3.</font> After signing, Bob broadcasts the message to the relay that was provided in the QR code. He does not broadcast this to other relays. 

<font color=red>msg 4.</font> Just as the Bob's Browser opened a subscription to Bob in step 1, Bob opens a websocket subscription to receive updates from the WebApp.

<font color=red>msg 5.</font> The WebApp was already subscribed from step 1 and now receives the Login proof and allows the user into the application.

The events described above all ephempheral, meaning they are not saved on the relay longer than a few minutes. They are also encrypted, but they **do leak metadata** about who is logging into which applications via which relays. A closed relay could be used for more privacy.

### 🖥️ Using the Application
At this point, Bob is logged into the application on his browser. He may start to author some content, post some events (tweets), creating bitcoin spending policies, or propose spends.

Let's say that he authors a long paper using markdown on his computer. He is not quite finished, but he wants to save it as a draft. 

In the application, he can perform a **Save** action. This would encrypt the document locally and send it to the relay which will forward it over the subscription to Bob's Phone. The device would ask Bob if he approves saving that event to his private own DM Notes to Self <font color=red>(msgs 10-11)</font>.

When Bob approves, the signed event is returned the Bob's Browser via the Relay, where the WebApp then sends it to the relay as a NIP-04 encrypted message <font color=red>(msgs 12-14)</font>. 

![image](https://user-images.githubusercontent.com/32852271/224999571-2246462d-340f-4a48-baa7-73b844a399ff.png)

> *Do we need a LOG-OFF event to inform the Browser to end the subscription? (and also erase any local data)*

### 💻 Later that Day (or Year)
Later that day, Bob begins working on his laptop and wants to finalize his paper and publish it to Nostr. 

Bob goes to the URL of the application on his laptop browser and scans the QR to Login <font color=red>(msg 20)</font>. The same login sequence that occurred at the beginning occurs again to create a session.

Once logged in, Bob sees his content within his Notes to Self and continues to edit and proofread. When he is complete, it clicks 'Post' to submit the content as a normal Nostr event <font color=red>(msg 22)</font>. 

That click in the Browser constructs an Event and encapsulates it in wrapper event to send to Bob's Phone over the relay. Bob reviews the hash of the event in the browser and on the device to know it is the same one, and then approves <font color=red>(msg 23)</font>.

The approval is sent back to Bob's Browser where it is broadcast to a relay as the public post. It is only at this point that the content is accessible unencrypted by any audience or component outside of Bob's local systems <font color=red>(msg 24)</font>.

![image](https://user-images.githubusercontent.com/32852271/224999650-b440f0ca-f33b-4a56-8fff-fafdcec24315.png)

## ✨ Summary
Establishing secure, flexible, and real time communications between the browser and application and device makes many great use cases available for Nostr. 

<hr/>

### ₿ Postscript: Bitcoin Signatures in Nostr Connect
I am an admitted and unashamed stalker of open source developers. I noticed that yesterday, the author of the [Nostr Connect](https://github.com/nostr-connect/connect) protocol and the reference implementation [Nostrum](https://github.com/nostr-connect/nostrum) starred and forked a Javascript library for **signing and decoding Bitcoin transactions**. 

[Coinstr](https://coinstr.app) is very interested in using this protocol to sign more than Nostr events, especially Bitcoin. We will keep a close eye on what transpires.

<img src="https://user-images.githubusercontent.com/32852271/222914638-fe23a97b-d616-428e-8c52-42e316881c60.png" width="400"/>

### Web3 Signing with Anchor on Telos
This is unrelated to Nostr and Nostr Connect, but the general UX of remote signing is very well done. It demonstrates using a remote signer on Telos.

<iframe width="560" height="315" src="https://www.youtube.com/embed/2XYVnsAgyyM" frameborder="0" allowfullscreen></iframe>

[Follow Max on Nostr](https://snort.social/p/npub1ws2t95pdtpna4ps62rrz75mm6ujsudjv70yj2jk4wsqjhedlw22qsqwew9) to report any errors and for more articles and information about innovation around Nostr, Bitcoin and Lightning.

https://snort.social/p/npub1ws2t95pdtpna4ps62rrz75mm6ujsudjv70yj2jk4wsqjhedlw22qsqwew9
