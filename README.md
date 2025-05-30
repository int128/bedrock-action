# bedrock-action [![ts](https://github.com/int128/bedrock-action/actions/workflows/ts.yaml/badge.svg)](https://github.com/int128/bedrock-action/actions/workflows/ts.yaml)

This is a general-purpose action for conversation with Amazon Bedrock in GitHub Actions.
It uses the [Amazon Bedrock API](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html) to send a user prompt and receive a response.

## Getting Started

To run this action, create a workflow as follows:

```yaml
jobs:
  hello:
    runs-on: ubuntu-latest
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-region: us-west-2
          role-to-assume: arn:aws:iam::0123456789012:role/your-iam-role
      - uses: int128/bedrock-action@v0
        with:
          model-id: us.amazon.nova-lite-v1:0
          user-prompt: |
            Hello world!
```

## Specification

### Inputs

| Name                          | Default    | Description                                                 |
| ----------------------------- | ---------- | ----------------------------------------------------------- |
| `user-prompt`                 | (required) | User prompt message                                         |
| `user-prompt-files`           | -          | Glob patterns of files to append to the user prompt         |
| `system-prompt`               | -          | System prompt message                                       |
| `model-id`                    | (required) | Model ID                                                    |
| `inference-config-max-tokens` | -          | Maximum number of tokens to allow in the generated response |

### Outputs

| Name   | Description  |
| ------ | ------------ |
| `text` | Text content |
