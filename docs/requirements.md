# Requirements

What Request Parameters must do, and how each part was verified. This is the one place the requirements live: a feature's spec under `.scratch/<feature>/` is folded in here when the feature is done. Terms follow [GLOSSARY.md](../GLOSSARY.md); the reasons behind the design are in [docs/adr/](adr/).

## Who it is for

People who send DSH's model requests through a gateway: OpenRouter, a company relay, or a self-hosted vLLM. Gateways accept fields DSH does not send, such as OpenRouter's provider routing, fallback models, a reasoning budget, or a session id for cache affinity. Without this plugin, adding them means changing code.

## Goals

- Add, replace, or remove body fields and headers on the requests of a chosen channel, from a page.
- Show what a request will carry before anything is sent, and what the gateway answered afterwards.
- Offer first the kinds of parameter a channel's protocol reads.

## Out of scope

- Changing where a request goes, forwarding it, or acting as a proxy.

## Constraints

- A protocol only decides which kinds are offered first and how sure the catalog hints are; parameters are always sent as written.
- Kinds a channel's protocol does not read are folded under Other kinds, never hidden.
- OpenRouter catalog hints say where they come from: they count as facts only for openrouter.ai and as a reference for any other gateway.
- Credential headers (`Authorization`, `x-api-key`, `Cookie`, and the like) can never be changed; core fields (`messages`, `model`, and the like) cannot be changed unless a custom parameter allows it.
- Parameters are stored on the computer only; the request log lives in memory and never keeps the conversation.
- The plugin goes online for two things only: OpenRouter's public catalog and the update check.
- The page follows DSH's language and has every text in Chinese and English.
- The page can check for a newer release and upgrade the plugin.
- When the page fails to draw, it shows the error text and Reload, never an empty panel.
- It works on Windows, macOS, and Linux, on Node `^22.19.0 || >=24`.
- The README and market text claim only what was verified.

## Features

### Parameters per channel

**Acceptance criteria**

- The page lists the channels DSH is configured with and the address each one sends to.
- A parameter added to a channel applies to that channel's requests; parameters for any other address name their own host, model, and path under Other addresses.
- Parameters apply just before a request leaves DSH, on the official DeepSeek channel and on `llm-pi-ai`'s OpenAI-compatible and Anthropic-compatible channels ([ADR 0002](adr/0002-parameters-are-applied-by-wrapping-fetch.md)).

**Verified**

- On real DSH processes with a local mock model server, all three kinds of channel received the parameters added to their channel, as seen in the requests that went out.

### What a channel reads

**Acceptance criteria**

- Each channel shows its protocol: the request format it reads and the extra fields it reads on top, worked out from DSH's settings and the address.
- A protocol can be set by hand per address and set back to automatic ([ADR 0001](adr/0001-protocols-belong-to-addresses.md)).
- The kinds the protocol reads come first, most specific first; the rest are under Other kinds, each marked with what it needs.

**Verified**

- OpenRouter fields ticked for an OpenAI-compatible relay made provider routing available on that channel, and the relay received it in its requests.

### Kinds of parameter

**Acceptance criteria**

- Provider routing, reasoning effort, sampling extras, session stickiness, app attribution, remove fields, and custom fields and headers each add the fields and headers listed for them in the README.
- Values can use `{{model}}`, `{{session}}`, and `{{env:NAME}}`; values from environment variables are never shown.
- Parameters apply from top to bottom, and a later one sees what an earlier one changed.

**Verified**

- Parameters added per channel were seen in the requests the mock model server received.

### Provider routing

**Acceptance criteria**

- Providers are picked from a search, where those that serve the previewed model come first with price and uptime.
- A provider that does not serve the previewed model is flagged; on openrouter.ai, a list that would fail with "No endpoints found" is called out before saving.
- On any other gateway these hints are marked as a reference, and any provider name can be typed.

**Verified**

- The provider search and the not-serving flag worked against OpenRouter's public catalog, with no request sent to OpenRouter.

### Preview and dry run

**Acceptance criteria**

- Added when sending shows, as JSON, what a channel's parameters add to a request for a chosen model, unsaved edits included, without sending anything.
- A dry run shows the whole request before and after the parameters.

**Verified**

- The preview was checked end to end against a real DSH process.

### Request log

**Acceptance criteria**

- Each channel shows its recent requests with the status and what was added, and when the gateway refused, the start of what it said.
- The request log lists every model request DSH sent, at most the last 50, in memory only.

### Safety

**Acceptance criteria**

- Protected fields and headers cannot be set or removed; a parameter with a problem does not apply, and the page says what is wrong.
- When applying a parameter fails, the request is sent unchanged and the log says why.

**Verified**

- The rule engine and `fetch` wrapper tests cover protected fields, chain safety, and requests sent unchanged after an error.

### Everyday use

**Acceptance criteria**

- One switch pauses every parameter.
- Unsaved edits survive leaving the page, and Ctrl/⌘ + S saves.
- Deleting a parameter can be undone.
- A rules file changed elsewhere is detected instead of overwritten.
- Parameters export to and import from JSON.
- The page works in light and dark themes, down to phone width.

**Verified**

- Saving, pausing, undo, import and export, and a rules file changed elsewhere were checked end to end, in light, dark, narrow, and phone layouts.

### Updating the plugin

**Acceptance criteria**

- The page says when a newer release is out and installs it through DSH's plugin manager after the user confirms ([ADR 0003](adr/0003-plugin-updates-itself-through-dsh-plugin-manager.md)).
- The automatic check can be turned off; a development install is never checked.
- After an upgrade, the new version says it is running.

**Verified**

- On dsh 0.2.1-rc.2 against the real npm registry, a copy labelled 0.0.9 found 0.1.0, **Upgrade…** installed it through DSH's installer, the profile then depended on the 0.1.0 tarball, and the new version took over without a restart.
- Installing the same release again reported it as installed and waiting for a restart.

### When the page fails

**Acceptance criteria**

- When the page throws while drawing, it shows the error text and a Reload button that loads the page again.
