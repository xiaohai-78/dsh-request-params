# Request Parameters

A DSH plugin page that adds parameters to the requests DSH sends to models, per channel.

## Language

**Channel**:
A model source DSH is configured with, the official DeepSeek one or an entry in `llm-pi-ai`'s configuration, together with the address it sends requests to.
_Avoid_: route, provider (DSH's configuration word for the same thing)

**Provider**:
A service behind OpenRouter that actually serves a model, such as DeepInfra.
_Avoid_: vendor, upstream

**Address**:
Where a request goes: a host and a base path. Several channels can share one address.
_Avoid_: endpoint, URL

**Protocol**:
What an address reads: a request format, and the extra fields it accepts on top of that format. It belongs to the address, so channels that share an address share one protocol.
_Avoid_: API type
