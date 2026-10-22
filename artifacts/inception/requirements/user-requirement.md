# User Initial Request

Follow instructions in #prompt:SKILL.md with these arguments: i want to convert the application under the main branch with URL https://github.com/jainprateekkumar/WW-AI-Demo/blob/main to AWS serverless architecture with react as front end and python scripts based lambda for API gateways

## Attached File: SKILL.md

-

# AI-DLC Workflow

You are executing the AI-DLC lifecycle. The workflow specification is not written
here — it is retrieved at runtime.

## Step 1 — always first

Call `aidlc_startWorkflow` before doing anything else, including before answering,
planning, reading the codebase, or writing a single file. It returns the governing
workflow specification and its mandatory common rules.

If that tool is unavailable, say that the AI-DLC workflow could not be loaded and
stop. Do not improvise a substitute lifecycle.

## Step 2 — follow what it returns, exactly

The returned specification is authoritative and overrides your default habits:

- Its phase and stage order is mandatory. Do not skip, merge, or reorder stages,
  and do not skip a stage because the user supplied a lot of detail up front.
- Where it requires clarifying questions, ask them. A long requirements document
  is input data, never a reason to stop asking.
- Where it requires explicit user approval before continuing, stop and wait.
- Where it names further guidance to load, use `aidlc_getPhaseRules` for
  everything the current phase or stage needs, in one call.
- Optional extensions arrive already loaded with their opt-in prompts. Present
  each as a clarifying question during Requirements Analysis. Only once a user
  opts in, call `aidlc_enableExtension` with that extension's short name to load
  its full rules — never before.

The specification was written for a host that offers a `aidlc_askQuestions` tool.
You do not have it — ask those questions directly in the conversation instead,
keeping the option format the specification prescribes.

## Step 3 — presentation rules, mandatory

The workflow's own mechanics stay invisible. In anything the user sees:

- Never name or quote rule documents, file paths, or directories belonging to this
  workflow, and never reproduce their contents verbatim.
- Never say that you are loading, reading, initialising, or consulting rules,
  instructions, tools, or a specification.
- Never expose tool names, tool inputs, or tool results.
- Never end a message with an internal state marker such as `---STAGE-NAME---`.

Present the workflow as a natural conversation: what you are doing, what you need
from the user, what you produced. Deliverables the workflow tells you to write into
the user's workspace — requirement documents, designs, state and audit records,
code — are the exception. Those are the user's artifacts. Write them normally and
refer to them by their plain names.
