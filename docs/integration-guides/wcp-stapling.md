---
title: WCP Stapling
group: integration-guides
---

## What is WCP - The Welsh Clinical Portal?

The Welsh Clinical Portal (WCP) is a web application available to hospital clinicians.

It can be used to enter information into the patient record, view patient health records and perform administrative tasks, such as referrals.

It has integrations with many other national systems, such as the Welsh Patient Administration System (WPAS).

See here for more info: https://dhcw.nhs.wales/systems-and-services/secondary-care/welsh-clinical-portal/


## What is the WCP Stapling interface

WCP's Stapling interface allows an external application to launch WCP and securely pass context information, such as the Patient ID and User ID.
Applications can implement the same interface to enable WCP users to launch the application directly from WCP.

A common approach is for the launched application to be displayed within a frame or pop-up window, similar to how one paper form may be stapled to another. Hence the name, Stapling.

> NOTE: As WCP supports stapling in both directions, you'll likely see the term "Reverse Stapling" used in URLs or documentation. <br>
When an application uses the stapling interface to launch WCP, the WCP team refer to it as "Reverse Stapling". When WCP launches another application, the team refer to it as "Stapling".


## How to: Launch WCP with the stapling interface

 1. Authenticate your application users with NADEX
 2. Register your application and provide an encryption key
 3. Implement the stapling logic


### 1 - Authenticate users with NADEX

As the stapling interface requires you to provide the user's NADEX ID you will need to pre-authenticate the to obtain their User ID before launch WCP.
This can be done using OAuth2.0, SAML.

### 2 - Register your application

To register an application, you will need to provide
  - details of your application
  - which WCP screens your application will need to launch

Once your application is registered, you will be provided with:

 - The WCP reverse stapling URL
 - An application ID (a GUID)
 - A private key for performing AES Encryption (this will be a Base64 encoded string of 256 cryptographically random bits)
  
You must keep the private key secret and notify the WCP team immediately if you suspect the secrecy has been compromised.

### 3 - Implement the stapling logic

To launch WCP via a stapled link, you'll need to construct the launch URL as shown below:
```
 https://{wcp-reverse-stapling-url}/{Application ID}?parameters={Encrypted Context Parameters}
```
There are three components:
 - WCP Rerverse Stapling URL 
 - Application ID
 - Encrypted Context Parameters

The first two will be provided as part of the registration process

The last one, Encrypted Context Parameters, should be constructed as explained below:

### 3.1 - Encrypted Context Parameters

The following parameters will be encrypted and passed in the URL

| Parameter         | Description                                                                     | Required                 | Default  |
| ----------------- | ------------------------------------------------------------------------------- | ------------------------ | -------- |
| Username          | NADEX username <br>Example: `AN123456`                                          | Yes                      |          |
| Organisation      | Code for calling Health Board<br> Example: `RVF`                                | Yes                      |          |
| SystemContext     | Further specifies the organisation when there WCP instances for an organisation | No                       |          |
| DateTimeStamp     | The current date and time. <br>Format: `yyyyMMddHHmmss`, Example `20180420120653`| Yes                      |          |
| PatientIdentifier | Patient Hospital Number. <br>Format: <code>{id-authority}&#124;{id}</code>, Example: <code>237&#124;TST0001</code>    | No                      | None     |
| IdentifierDomain  | The value will always be `HospitalNumber`                                       | if PatientIdentifier    | None     |
| Target            | WCP page to launch  (see [Target Parameter Values][1])                               | Yes                      | None     |
| ListType          | Only used when Target = `PatientListview` (see [Target Parameter Values][1])         | No                       |          |

[1]: #32----target-parameter-values
The encryption process is as follows:

**Step 1**

Populate the parameters and format as  `application/x-www-form-urlencoded` (see examples below):

*Example 1: Parameters to view Inpatient Lists page in WCP:*
```
Username=AB123456&Organisation=RVF&DateTimeStamp=20171227111435&Target=PatientListView&ListType=InpatientCurrent
```

*Example 2: Parameters to view all test results*
```
Username=AB123456&Organisation=RVF&SystemContext=Live&DateTimeStamp=20171227111500&PatientIdentifier=237|TST0001&IdentifierDomain=HospitalNumber&Target=PatientHomePage
```

*Example 3: Parameters to show the pathology test request form*
```
Username=AB123456&Organisation=RVF&SystemContext=Live&DateTimeStamp=20171227111449&PatientIdentifier=237|TST0001&IdentifierDomain=HospitalNumber&Target=TestRequest
```

**Step 2**
Create the Encrypted Context Parameters as explained below:

1. Convert the `x-www-form-urlencoded` parameter text into bytes using ASCII Encoding
2. Encrypt the bytes using AES Encryption:
  - Key: The private key supplied when registering your application
  - Mode: CBC with 128 bit blocks (the default with many encryption tools)
  - Padding: ISO 10126
3. Prepend the encrypted bytes with this Initalisation Vector (IV)
4. Base 64 encode the combined bytes and replace any "+" characters with "@"

See the pseudocode below:
```javascript
let parameter = "Username=AB123456&Organisation=RVF...Target=TestRequest"
let parameterByteArray = Encoding.ASCII.GetBytes()
let encryptor = new AesEncryptor(key, Mode.CBC, Padding.ISO_10126)
let encryptedByteArray = encryptor.Encrypt(parameterBytes);
let contextToken = Convert.ToBase64String(Array.concatenate(encryptor.IV, encryptedByteArray))
```


### 3.2 -  Target Parameter Values
The table below shows values that can be used for the `Target` parameter:

|Value|Description|
|-----|-----------|
|PatientHomePage 	| Home page (with patient in context)|
|TestRequest	        | Form for requesting pathology tests|
|TestRequestStep2 	|Same as TestRequest but skips the view of existing test requests and results|
|DirectResultsViewer	|
|IHR 	| Patient GP Record|
|PatientRecord 	| Patient Documents (Welsh Care Records Service)|
|MyPreferences 	| Allows users to set default preferences|
|PatientListView	| If provided, also include the ListType parameter, see below|

The following values can be used for the `ListType` parameter, only applicable when `Target=PatientListView`
 - PersonalNotifications
 - GeneralNotifications
 - InpatientCurrent
 - OutpatientCurrent
 - InpatientScheduled
 - OutpatientScheduled
 - AccidentEmergency
 - RecentlyDischarged