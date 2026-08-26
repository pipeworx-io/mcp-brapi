# @pipeworx/brapi

[brapi.dev](https://brapi.dev/docs) MCP — keyless Brazilian stock + crypto + ETF quotes (B3 exchange).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

## Tools

- `quote_list(search?, limit?, sortBy?, sortOrder?, type?, sector?, page?)` — list quotes
- `quote(tickers, range?, interval?, fundamental?, dividends?, modules?)` — quote (comma-sep tickers like `PETR4,VALE3`)
- `available()` — available tickers
- `crypto(coin, currency?)` — crypto quote (coin = BTC, ETH, …)
- `currency(currency)` — currency conversion (e.g. `USD-BRL,EUR-BRL`)
- `inflation(country?, historical?, start?, end?, sortBy?, sortOrder?)` — inflation series
- `prime_rate(country?, historical?, start?, end?, sortBy?, sortOrder?)` — prime rate series

## Data source

`https://brapi.dev/api`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "brapi": {
      "url": "https://gateway.pipeworx.io/brapi/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/brapi/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Brapi data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
