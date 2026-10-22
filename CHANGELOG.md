# Changelog

## 0.2.0 (2026-10-22)

- **Configured channels**: the Rules tab lists the model channels dsh already has (the official DeepSeek route and the `llm-pi-ai` routes) with the endpoint each one sends to, where that endpoint came from (channel settings, the catalog default, `$DEEPSEEK_BASE_URL`, or requests seen), and its models.
- **Make a rule** for a channel starts a rule that already matches it: its host, plus its base path when another channel shares the host, and its models when another shares the whole base URL. An OpenRouter channel gets **Set up routing** in one click.
- The rule editor can add a configured channel to **Applies to**, suggests that channel's models, and a rule row shows the channel's name instead of its host.

## 0.1.0 (2026-10-22)

First release.

- Rules that add, fill in, or remove JSON body fields and add or remove headers on the model requests dsh sends, matched by host, model, and path, applied top to bottom.
- Presets: OpenRouter provider routing (with fallback models), reasoning effort, sampling extras, session stickiness, app attribution, remove fields, and custom rules; one-click examples for vLLM, Helicone, Cloudflare AI Gateway, and OpenAI `prompt_cache_key`.
- **See which providers serve a model**: OpenRouter's public catalog with price, context, and uptime, and buttons that add a provider to the routing lists; works offline from a built-in provider list.
- **Try it**: run the rules, saved or not, on a sample request and see a diff of the body and the header changes.
- **Recent requests**: the last 50 model requests with the changes made, the HTTP status, the start of a gateway error (with environment values hidden), and a note when the error names a field a rule set.
- Templates `{{model}}`, `{{session}}`, and `{{env:NAME}}`; core body fields and credential headers are protected.
- A pause switch, unsaved drafts that survive leaving the page, undo for deletes, detection of rule changes made elsewhere, import and export, English and Chinese, light and dark.
