import assert from 'assert'
import * as core from '@actions/core'
import * as fs from 'fs/promises'
import * as glob from '@actions/glob'
import * as bedrock from '@aws-sdk/client-bedrock-runtime'

type Inputs = {
  userPrompt: string
  userPromptFiles: string
  systemPrompt: string | undefined
  modelId: string
  inferenceConfigMaxTokens: number | undefined
}

type Outputs = {
  text: string
}

export const run = async (inputs: Inputs): Promise<Outputs> => {
  const converseInput = await getConverseInput(inputs)

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

const getConverseInput = async (inputs: Inputs): Promise<bedrock.ConverseCommandInput> => {
  const userContent: bedrock.ContentBlock[] = [{ text: inputs.userPrompt }]

  for await (const userPromptFile of (
    await glob.create(inputs.userPromptFiles, { matchDirectories: false })
  ).globGenerator()) {
    const userPromptFileContent = await fs.readFile(userPromptFile, 'utf-8')
    userContent.push({ text: userPromptFileContent })
  }

  return {
    messages: [
      {
        role: 'user',
        content: userContent,
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
