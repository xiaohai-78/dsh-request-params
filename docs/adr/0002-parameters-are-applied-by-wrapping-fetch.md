# Parameters are applied by wrapping the global fetch

DSH's model adapters, the DeepSeek adapter and every `llm-pi-ai` provider, all send through the global `fetch`, so the plugin wraps it: that is the one place that sees every channel without a hook in each adapter. The wrapper changes only the headers and JSON body of POST requests to a model address or a path a parameter names, never where a request goes, and an internal failure sends the request unchanged and shows the failure in the request log.

## Consequences

- A provider that captured `fetch` before the plugin loaded is not seen; the request log shows what the plugin saw.
