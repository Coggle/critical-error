# critical-error
Provides a simple interface to send messages to a pre-configured SNS endpoint,
using @aws-sdk/client-sns.

All messages are also logged to `console.error`.

A process `uncaughtException` handler is also installed which logs uncaught exceptions.

## Usage
```
var critical = require('critical-error');

// configure somewhere once before use:
critical.configure({TopicArn:"arn:aws:yourarnhere", region:"the-topics-region"});

critical("Oh no! Super bad error D:")
```

## Options

All options are passed to the AWS SDK PublishCommand creation, apart from
`region` which is used when creating the AWS SNS Client object.

## Usage in shortlived processes
`critical()` is asynchronous but does not provide a callback (since there is no
sensible way to handle errors). If you need to wait for messages to be sent
(for instance due to running as a serverless function), then use:

```
// call callback when an in-flight critical() request is completed:
critical.waitForCompletion(callback);

// await the completion of an inflight request:
await critical.waitForCompletion();
```

## Changelog

### 1.2.0
 * add .wait

### 1.1.0
 * Updated to use aws-sdk v3, depending only on @aws-sdk/client-sns instead of the whole sdk
