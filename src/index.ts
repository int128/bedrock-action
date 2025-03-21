import * as core from '@actions/core'
import { run } from './run.js'

try {
  const outputs = await run({
    userPrompt: core.getInput('user-prompt', { required: true }),
    systemPrompt: core.getInput('system-prompt') || undefined,
    modelId: core.getInput('model-id', { required: true }),
    inferenceConfigMaxTokens: Number(core.getInput('inference-config-max-tokens')) || undefined,
  })
  if (outputs.text) {
    core.setOutput('text', outputs.text)
  }
} catch (e) {
  core.setFailed(e instanceof Error ? e : String(e))
  console.error(e)
}
