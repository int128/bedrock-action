import assert from 'assert'
import * as core from '@actions/core'
import * as bedrock from '@aws-sdk/client-bedrock-runtime'

type Inputs = {
  userPrompt: string
  systemPrompt: string | undefined
  modelId: string
  inferenceConfigMaxTokens: number | undefined
}

type Outputs = {
  text: string
}

export const run = async (inputs: Inputs): Promise<Outputs> => {
  const converseInput = getConverseInput(inputs)

  core.startGroup('ConverseInput')
  core.info(JSON.stringify(converseInput, null, 2))
  core.endGroup()
  const bedrockClient = new bedrock.BedrockRuntimeClient()
  const converseOutput = await bedrockClient.send(new bedrock.ConverseCommand(converseInput))
  core.startGroup('ConverseOutput')
  core.info(JSON.stringify(converseOutput, null, 2))
  core.endGroup()

  return getActionOutputs(converseOutput)
}

const getConverseInput = (inputs: Inputs): bedrock.ConverseCommandInput => {
  return {
    messages: [
      {
        role: 'user',
        content: [{ text: inputs.userPrompt }],
      },
    ],
    system: inputs.systemPrompt ? [{ text: inputs.systemPrompt }] : undefined,
    modelId: inputs.modelId,
    inferenceConfig: {
      maxTokens: inputs.inferenceConfigMaxTokens,
    },
  }
}

const getActionOutputs = (converseOutput: bedrock.ConverseCommandOutput): Outputs => {
  assert(converseOutput.output)
  assert(converseOutput.output.message)
  assert(converseOutput.output.message.content)
  assert(converseOutput.output.message.role)

  const text = converseOutput.output.message.content
    .filter((content) => content.text !== undefined)
    .map((content) => content.text)
    .join('\n')

  return {
    text,
  }
}
