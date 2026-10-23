# Changelog

## Unreleased

- An upgrade no longer stays marked as installing when the note it leaves in `settings.json` cannot be written, or when DSH's installer throws instead of failing: the note is skipped with a warning in the log and the install goes ahead, and an installer that throws ends the upgrade as failed, so it can be tried again.
- A channel known to send Anthropic Messages requests (the official DeepSeek route, or a route whose `api` is `anthropic-messages`) no longer offers the vLLM and OpenAI `prompt_cache_key` examples, whose body fields such a gateway would reject. The request format comes from the route's `api` setting, the official route, OpenRouter, or the paths of the requests seen.

## 0.2.0 (2026-10-22)

The page is organized by channel.

- **Channels first**: the page lists the model channels dsh already has (the official DeepSeek route and the `llm-pi-ai` routes) with the address each one sends to, taken from the channel settings, the catalog default, `$DEEPSEEK_BASE_URL`, or the requests seen. A channel's page shows its parameters, adds new ones already matched to it (its host, plus its base path when another channel shares the host, and its models when another shares the whole base URL), and lists its recent requests. Parameters for other addresses are under **Other addresses** and keep their own hosts, paths, and models.
- **Added when sending**: a live preview of what the channel's parameters, saved or not, add to a request for a chosen model, as JSON and header changes. It uses the host's dry run; nothing is sent.
- **Provider routing** is one provider list: search providers (the ones serving the previewed model first, with price and uptime), order them, choose whether other providers may be used, and exclude some; rarer conditions are under **More conditions**. A provider that does not serve the previewed model is flagged, and a list that would fail with "No endpoints found" is called out before saving.
- Each parameter is a card with a one-line summary, a model scope, an on/off switch, and a menu: rename, edit hosts and paths, note, duplicate, move, edit as JSON, delete. Deleting no longer asks first; it can be undone.
- The kinds offered follow the channel: OpenRouter-only kinds appear for OpenRouter channels and under **Other addresses**.
- Import, export, help, and refresh are in the header menu; the save bar and messages float at the bottom of the page.
- A stored preset form is normalized when the rules are read, so a hand-edited form with missing fields still opens.
- **Updates**: the page asks the npm registry DSH uses for a newer release of this plugin (at most every 12 hours, or on **Check for updates**) and installs it in one click with DSH's installer, with progress, cancel, and a rollback command; the next page load says **Upgraded to** the new version. A switch turns the automatic check off.

## 0.1.0 (2026-10-22)

First release.

- Rules that add, fill in, or remove JSON body fields and add or remove headers on the model requests dsh sends, matched by host, model, and path, applied top to bottom.
- Presets: OpenRouter provider routing (with fallback models), reasoning effort, sampling extras, session stickiness, app attribution, remove fields, and custom rules; one-click examples for vLLM, Helicone, Cloudflare AI Gateway, and OpenAI `prompt_cache_key`.
- **See which providers serve a model**: OpenRouter's public catalog with price, context, and uptime, and buttons that add a provider to the routing lists; works offline from a built-in provider list.
- **Try it**: run the rules, saved or not, on a sample request and see a diff of the body and the header changes.
- **Recent requests**: the last 50 model requests with the changes made, the HTTP status, the start of a gateway error (with environment values hidden), and a note when the error names a field a rule set.
- Templates `{{model}}`, `{{session}}`, and `{{env:NAME}}`; core body fields and credential headers are protected.
- A pause switch, unsaved drafts that survive leaving the page, undo for deletes, detection of rule changes made elsewhere, import and export, English and Chinese, light and dark.
