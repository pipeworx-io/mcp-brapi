# @pipeworx/brapi

[brapi.dev](https://brapi.dev/docs) MCP — keyless Brazilian stock + crypto + ETF quotes (B3 exchange).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Brapi data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
