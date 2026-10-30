# Protocols belong to addresses, not channels

A protocol, the request format an address reads and the extra fields it accepts on top, is detected and declared per address (host plus base path), not per channel. Channels that point at the same address reach the same server, so one declaration keeps them from giving contradictory answers about it. A user's declaration is saved with the parameters under that address, so it stays when a channel is renamed or removed.

## Considered Options

- **Per channel**: two channels on one company relay could carry different declarations, but the relay reads one protocol, so one of them would always be wrong.
