# critical-error
Provides a simple interface to send messages to a pre-configured SNS endpoint,
using the aws-sdk.

All messages are also logged to `console.error`.

## Usage
```
var critical = require('critical-error');

// configure somewhere once before use:
critical.configure({TopicArn:"arn:aws:yourarnhere", region:"the-topics-region"});

critical("Oh no! Super bad error D:")
```

## Options

All options are passed to the AWS SDK publish call, apart from `region` which
is used when creating the AWS SNS object.

