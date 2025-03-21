import * as core from '@actions/core'
import { BedrockRuntimeClient, ConverseCommand, ConverseCommandInput } from '@aws-sdk/client-bedrock-runtime'

type Inputs = {
  userPrompt: string
  systemPrompt: string | undefined
  modelId: string
  inferenceConfigMaxTokens: number | undefined
}

type Outputs = {
  text: string | undefined
}

export const run = async (inputs: Inputs): Promise<Outputs> => {
  const converseInput: ConverseCommandInput = {
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

  core.startGroup('ConverseInput')
  core.info(JSON.stringify(converseInput, null, 2))
  core.endGroup()
  const bedrockClient = new BedrockRuntimeClient()
  const converseOutput = await bedrockClient.send(new ConverseCommand(converseInput))
  core.startGroup('ConverseOutput')
  core.info(JSON.stringify(converseOutput, null, 2))
  core.endGroup()

  const text = converseOutput.output?.message?.content
    ?.map((content) => content.text)
    .filter((text) => text)
    .join('\n')
  if (text) {
    core.info('----')
    core.info(text)
    core.info('----')
  }
  return {
    text,
  }
}
