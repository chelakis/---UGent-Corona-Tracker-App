# Information Security Project

## Abstract

### Introduction

Nowadays everyone is  more and more concerned about the fast spreading pandemic of the Corona virus and the impact it bears to the society and the economy. Driven by these facts the basic goal of this project is the design of an application that helps people keep track if they had physical, close enough, contact with another person that is diagnosed with the disease and inform them to do a clinical check-up or even go into quarantine.

Key objective of this application is to facilitate people in emergency, as in this case, so everybody can be prepared to act immediately. Both the government and the society must take advantage of the benefits offered by today's technology and media. By using these tools people can have the opportunity to map the diffusion of the virus and take the appropriate prevention measures on time. This way human kind will be able to predict danger and manage to stay a step ahead of it. 

The application of the above mentioned can be accomplished via two approaches.

### Security services and attacks

#### Confidentiality
Confidentiality refers to protecting information from being accessed by unauthorized parties. In other words, only the people who are authorized to do so can gain access to sensitive data. All the personal data are collected and stored only for safety reasons and analytics so it's everyone's right this data remain private. To achieve confidentiality we do not provide a local storage for personal information, instead we have outsourced the storage of all personal data in an third party, security first, ssl encrypted database service.

#### Authentication
Authentication is the process of determining whether someone or something is, in fact, who or what it declares itself to be. The tracking system should authenticate the users when they login on the system. For this reason when users sign in they redirect to an external service and when they successfully authenticate then they get a token. A few authentication attack types are:

- Brute Force Attack: Consists of an attack that the attacker runs a script submitting many passwords with the hope of eventually guessing correctly.
- Eavesdropping Attack: happens when an unauthorized party steals, modifies or deletes essential information that is transmitted between two electronic devices.
- Bypass Attack: Can be an authentication bypass, mainly due to a weak authentication mechanism or due to a system failure.


#### Data Integrity
Data Integrity refers to ensuring the authenticity of information. That means that it ensures that data has not been accidentally or maliciously modified. Any unintended changes to data as the result of a storage, retrieval or processing operation, including malicious intent, unexpected hardware failure, and human error, is failure of data integrity. In our tracking system data integrity needs to be our main focus, as well as accurate data is a critical aspect to ensure that the result will be valid. The problems that can emerge in our system are:

- Data errors during transfer from one device to another. The most common type of attack is Denial Of Service attack (DOS) in which the attacker interupts the system by interrupting the device's normal functioning.
- Bugs, viruses, hacking or other similar threats.

#### Non repudiation
Non repudiation assures that the alleged sender in fact sent the message and that the alleged receiver in fact received the message. This is important to our system in order to asure that every desision of the user is not fake. Fake data can influence the result if used to a large extent. In a repudiation attack, erroneous data may be fed into log files, the authoring information of actions on the system may be altered, and general data manipulation or spoofing may occur.

#### Availability
Availability of information is basically an asurance that our system, and eventually our data, is accesible only by authorised users and only whenever it is needed. Only in that way the information is valueable. The most common attack known, of temporarily making resources unavailable to its intended users, is the Distributed Denial Of Service (DDOS). In this type of attack the attacker "floods" the target system by disrupting normal traffic and overloading it with requests. The primary aim of DDOS attacks is to deny, from users, access to the resources of the website. In order to be protected from an attack of this type a use of a Content Delivery Network (CDN) could be a solution. CDN uses multiple servers so it is imposible to "flood the system". Also a frequent back up could be a solution to keep data safe from an unexpected shut down.


## General Features 


### Approach

#### Online Mode

When a user's device discovers another user's device then one of them send a token to the other device. This token is requested from the backend and then sent by the other device back to the backend. This way the backend can verify that the user's have been in contact.

#### Semi-Offline Mode

A beacon is used, that transmits a rotating key. This key can be discovered by nearby user devices and then transmitted to the backend at any time.

### Requirements

#### User Devices

Devices that are able to run our application. These have capabilities to connect over cellular, wifi and Bluetooth.

#### Beacon

A beacon is a small device that citizens can carry in their pocket. The device is always on and does nothing more than transmit a message. A beacon can be linked to a citizen by scanning a code with a smartphone that can be found on the device. People without a smartphone also have one and can provide info to the system without using the app. To get feedback from the system they will need somebody (for example a relative), who can monitor their status.

#### Backend

A server that runs the backend of our application. The database is assumed to be on the same server or cluster of servers.

### Assumptions

- Registration service and backend know each other's secret key

#### Online 

- User Devices are always connected to the internet.
- Everyone has a User Device

#### Semi-Offline Approach

- Everyone has a beacon
- Beacon's private key is known to the backend

## Analysis of security features 

### Security features

We will mainly communicate using JWT messages. We only encode/encrypt and decode/decrypt these tokens in the backend and on beacons which means the frontend does not need to store any keys.

Making the beacon an isolated device which cannot receive any information means it is hard to compromise without being able to access its hardware.

#### Beacon to Device

The beacon will be created with a few keys in memory and a code on the casing. When registering a user with a token, a link is created in the database between the government ID and a beacon.

When the registration is complete a beacon can provide information to the server by constantly broadcasting a key. When a smartphone user is in the vicinity of the beacon, the app will store the interaction between itself and the key. 

(beacon comms in approach 2? are the beacon messages)

#### Device to Device

Information from a device to the other is exchanged using bluetooth beacons. 

#### Device to Backend

Communication between server and client is achieved through https protocol. HTTPs uses the well-known HTTP protocol and layers a SSL/TLS encryption layer on top of it. 

To authorize users we use the widely used JSON Web Tokens. These tokens are generated on registration and can contain any extra payload that we wish to include. This way we don't have to keep track of which tokens are in use. In this payload we can encode the user's uuid which we can use for authentication of the user. A timestamp can also be included to expire tokens after a given time interval by checked when it has been created on every authorization.

#### Backend to Database

Any trafic exchanged between the database and backend service is always encrypted using SSL. We also assume that our services run on the same computer/network which means that any trafic between the two services can only be distrubed. As we store encryption and signing keys on the backend server it should not be possible for the database to derive any meaningful information. The UUID should also be anonymous that it would not be useful for any attacker to identify a user.

#### Registration Service

By outsourcing our registration service we can also guarantee that authenticating users is done securely. We take itsme as an example as this has an accessible documentation available and is widely used for government and banking services.

Authenticating users is a simple process that takes just a few https requests:

- Redirect the user from the app to itsme
- Use itsme to authenticate a user
- User goes back to the app with its unique id and a authorization token
- The user uses its token and id to authenticate in our backend
- Backend verifies if the unique id and token are authentic by sending a request to itsme
- When itsme verifies the token successfully we send the user a jwt token that it can use to do other requests to the backend

We can assume that itsme is a secure service when reading their privacy policy. They also are [ISO 27001 certified](https://www.itsme.be/en/legal/app-privacy-policy) which means we can rely on them as a service which would be used on a nation wide scale for availability, integrity and confidentiality.

We do not plan on using any personal information. But if such need would come up we could also use itsme to retrieve a user's personal details.

The service does also strictly mention using JWT tokens and requiring us to verify them. This means we can always verify the signature of the information it sends to us guaranteeing integrity of our data.

#### Backend/Device to Registration Service

Requests between the backend/device and the registration service happens over HTTPS. We can assume that the registration service that has is certified also takes the necessary steps to make sure that communications are secure. A man in the middle attack would for example not be possible as we also agree on a secret which can be used to verify every request's signature.

In case the user loses his device or wants to use the app on another device it can just register again via the third party. The backend uses stateless tokens that do not keep track of devices.

#### Stored Data

Our citizen's/user's are authenticated via a third party. We do not store any personal information ourself. Still we need an id that we can use to associatewith any interactions and diagnoses. Say a diagnose is made we would still have to be able to assign this to the correct user.

We have a couple of options, but the most simple would be to use the national number of our citizen as this number never changes. In case our data is compromised the intruder would still have to lookup the personal information of every national number.

Other data we store in our database is nothing more than interactions between users with timestamps, diagnoses with timestamps and private keys associated with beacons.

## Trade-offs 

(what are the fallbacks security wise? e.g. do we not implement something in regards to computing time which makes it less ideal for security?)

In order to make the beacons completely anonymous, they could generate constantly new keys and recreating this on the server, but this would vastly increase the power consumption of the beacon and the server then had to update all the database entries, which would be impossible on a nationwide scale.

Another possible solution we looked at, was indexing the beacon messages. By using a handshake protocol for connection between the app and a beacon, the beacon would know how many interactions where send to the server. We could then use a block cypher for each interaction. But this would compromise the beacon aspect of this approach(transmitting only) and would cause lots of additional computation when interactions were lost or delayed. The upside of this would completely anonymize the beacons. 
So we choose a limited amount of keys and a mass storage of all keys on the database. The beacon then only has to loop through and the server knows at each time interval which table of the database needs to be used.

#### Beacon:
-	Use without internet connection
-	It has to be mandatory for everyone to have one on all the time
-	Will the government provide these?
-	Battery life issues
-	How elder people manage to use them?
-	Connectivity with smartphones
#### Always-online:
-	Accessible for everyone. Only use of a smartphone
-	No hardware is needed
-	Mandatory use for everyone
-	Always requires internet connection
-	Use of location service or Bluetooth is required


## Approach 

Below is an explenantion of how our app will function. The frontend and backend functions will be discussed indicating through what method the risk of a user to be infected will be determined. The methods explain here will work both online as offline.

### Frontend

The frontend will provide both online as offline functionality. The scope of the frontend is to be user friendly and also to implement the all the security features

#### Registration

For the registration and authentication of the user the itsme service is used. Upon registration the user will be redirected to the itsme app where they will be able to approve the registration. 

#### Login

Similarly for the login itsme is used.

#### Always-Online

##### Establishing connection

This approach involves two people with the app coming across each other. When this happens the frontend should be able to detect this taking place.

Exactly how the frontend can detect this is not further specified. Either through bluetooth or some approach using local wifi hotspots. It is even possible that the user will manually indicate to the app that they have come across someone. The important thing is that the frontends of two devices will be able to establish a connection.

##### Token exchange

After a connection has been established between two devices a token exchange will take place. Let's refer to the two devices as device A and device B.

Device A will send a request for a token to device B. When device B recieves this request it will in turn request a token from the backend. The backend will generate this token and send it back to device B. Once device B has recieved the token it will send it back to device A. Device A will in turn send this token to the backend.

If everything worked smoothly the backend will note that there had been a interaction between device A and device B.

In the above explenation it is assumed that only device A is requesting a token from device B. It is not required that device B also requests a token from device A.

##### Offline tokens

In the above explenation it is assumed that a device requests a token from the backend for every new interaction and immediatly sends a token to the backend upon revieving it. This makes it difficult to use the app when goes offline for a short duration of time.

Once a device has recieved a token from an other device it is not required to send it to the backend immediatly if it has no connection at that moment. Instead it could temporarely store this token and wait until it has regained a connection to send the token to the backend. It should not wait too long with this. If enough time has passed after it recieving the token and a connection has not been reastablished the token should be discarded.

#### Beacon Based

An alternative approach would be to use beacons that users carry around. These beacon store a private key which is also stored in advanced in our backend. Based on this private key the beacon can generate a public key which it rotates in a time interval. This public key is wrappen in a JWT message and signed with its private key guaranteeing that the message is authentic.

The only way to generate a false message would be to get access to the hardware of the device. But in this case an intruder would need phsyical access to the device which will probably alert the user.

Another benifit to this approach is that users without a smartphone can still log interactions.

##### Beacon 

A beacon has a number of keys available to it. It transmits one public key at a time. Keys are frequently rotated so that the same key will not be transmitted for too long.

##### App frontend

A smartphone app will be able to recieve the transmitted public keys from the beacons. The app will then send the public key from the beacon to the backend. The backend can then note that the owner of the beacon and owner of the smarthphone had been in close proximity. The frontend does not have to send the public key to the backend immediatly if it does not have a connection at the moment.

Besides the public key the frontend should also send the location, time and ID of the beacon. This beacon ID is also transmitted in addition to the public key.

#### Location updates

In addition to all of the above functions the frontend should also periodically send it's location to the backend. That way the backend can maintain which regions have a lot of people who are diagnosed or at risk.

### Backend

The backend has various functions.

#### Token generation

These are the tokens that are generated when a user's device requests one. These are JWT web tokens that contain the timestamp of their generation. JWT tokens are signed tokens so the information contained within them cannot be tempered with. It should be possible for the backend to derive from a token to what user it belongs.

#### Interaction generation

##### Using tokens

When the backend recieves a token from a user's device it will check to which user this token belongs. If the token is still valid the backend will store an interaction between the user who send the token to the backend and the user to whome the token belongs. It will also update the value of the token in token table.

##### Using public keys

The backend will have access to a set of private keys that correspond to the public keys stored in the beacons. It will check then if a public key matches a private key. The backend will be able to identify the private key using the ID that it also recieved from the frontend. If this is the case it will indicate that can interaction had taken place between a user and a certain beacon. A beacon always corresponds to a user so an interaction between a device and beacon is the same as an interaction between two devices.

#### Updating risk

Once the an interaction has been added to the interaction table the backend will check what the risk was of the involved users. That way it will be able to estimate the new risk of a user. For example if a user with high risk had been around a certain beacon at a certain time the beacon now also has an increased risk. In addition all the other users that had been in close contact with the beacon around that same time will now also have an increased risk.

#### Location gathering

It is important that it is not possible to track specific users. It could be possible to do this be storing where every user has been and then encrypting the data making it available only for when the map is generated. But this approach could contain a lot of potential attack avenues.

An other more safe approach which does indeed fullfill the requirements of the application would be not to store the location of a user. Instead the only thing that will be stored is:

- The location
- The risk of the user present at that location
- The time that user was present at that location

Now this data can be public and it will not be possible to identify anyone in particular.

### Database

(how does our database stay secure? make sure it cannot be attacked like dos or accessed by unauthorized people?)

## Demo implementation 

(basic overview, what security concepts or settings can we demonstrate? should mention what we used like react/express/postgres but not explain why or how they are secure as mentioned in ufora discussion)

### Frontend

The frontend is responsible for the interaction of the user with the system. It contains a login/register screen and the main screen where the basic information is displayed like the health status and there is a button which is pressed when the user is diagnosed with a dishttp://localhost:8080/ease.

#### Login/Register Screen

The login/register has two functions. The register function is used to register a new user in the system. The user can register to the system using a username, his name, his surname, his e-mail and his ID number. The system checks if that device, ID number and e-mail have been used before and returns an alert message if it has been done so. Otherwise it generates a unique code and sends it to that e-mail. The user can then use this code to register at the system. After registration, this device and user are registered to the system. For simplicity reasons only the ID number is used to access the system. New ID numbers will be veryfied by sending an e-mail to the user and existing IDs will be loged in straightaway.

#### Home Screen

The home screen contains the health status where the user can check his health status. The health status is a message which shows whether the user has been in close contact with an affected person. Moreover there is a button which should be pressed by the user if he has been diagnosed with coronavirus. The frontend then sends a message to the backend and then all people who have been in close contact with the affected user are notified.

### Database

The database contains a table for:
- each interaction between users that has been submitted
- every iteration in the public key rotation (every user has 1 entry in each)
- etc...

### Attacks

#### Brute Force

We could rate limit user requests but because our authentication tokens are long enough that guessing them is practically impossible.

#### DDOS

Using a third party CDN that hosts our platform we can save costs. An example would be Cloudflare which even provides DDOS protection as a free service.

#### Replay Attacks

In case tokens generated by the beacon or server do not have a signed timestamp the following exploits could be used to falsely spread the disease with our app.

We prevent this by signing the timestamp every time we exchange tokens.

#### Request multiple tokens

Say Trudy knows a contact in the government. T wants that it appears as as if everyone is at risk to make sure all future meets of a party are cancelled. T also knows a positively diagnosed patient P.

She manages to make P login onto a not secure network. Knowing P's authorization token she requests a large amount of tokens associated with P and stores them.

T then is able to transmit these tokens in any room to make every user to appear to have been in contact with a postivively diagnosed patient.

This method is applicable to online and offline methods as tokens that are transmitted could be forwarded over the internet and be retransmitted in another place.

We address this by using a challenge-response approach for exchanging keys between users in the online approach. With the offline approach this is still a vulnerability.

Our challenge-response approach requires 3 pieces of information: time, requestor and receiver. If any of these are missing following attacks would still be possible:

- The token has no unique timestamp: A can now keep using the token it got from B to make it seem he or she constantly comes in contact with B.
- The token does not mention the requestor A: Now A can pretend to be B and use B's token as his or hers own, making it seem asif B is coming in contact with a lot of people.
- The token does not mention the issuer B: This is obviously a bad idea. Now the ID of the issuer should be send alongside the token. Someone could now collect a bunch of ID's then they could send a requested token to the backend not with the ID the token came but with some other one. This would inturn create a bunch of false interactions.

## Conclusion 

We are confident that given that the secret keys that are stored on the server are not compromised that are application will be secure from most attacks. Both the online and the beacon based approach offer an adaquate level of protection agains multiple possible approaches that potential attackers could take.

## Work Distribution

- Chaikalis Marinos: database + API
- Chelakis Konstantinos Marios: frontend + python simulation
- Pitoskas Giannis: backend


## Sources
