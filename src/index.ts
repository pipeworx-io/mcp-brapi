interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * brapi.dev MCP — Brazilian stock + crypto + ETF quotes.
 */


const BASE = 'https://brapi.dev/api';
const UA = 'pipeworx-mcp-brapi/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'quote_list',
    description: 'List quotes.',
    inputSchema: {
      type: 'object',
      properties: { search: { type: 'string' }, limit: { type: 'number' }, sortBy: { type: 'string' }, sortOrder: { type: 'string' }, type: { type: 'string' }, sector: { type: 'string' }, page: { type: 'number' } },
    },
  },
  {
    name: 'quote',
    description: 'Quote (comma-sep tickers).',
    inputSchema: {
      type: 'object',
      properties: {
        tickers: { type: 'string' },
        range: { type: 'string' },
        interval: { type: 'string' },
        fundamental: { type: 'boolean' },
        dividends: { type: 'boolean' },
        modules: { type: 'string' },
      },
      required: ['tickers'],
    },
  },
  { name: 'available', description: 'Available tickers.', inputSchema: { type: 'object', properties: {} } },
  { name: 'crypto', description: 'Crypto quote.', inputSchema: { type: 'object', properties: { coin: { type: 'string' }, currency: { type: 'string' } }, required: ['coin'] } },
  { name: 'currency', description: 'Currency conversion.', inputSchema: { type: 'object', properties: { currency: { type: 'string' } }, required: ['currency'] } },
  {
    name: 'inflation',
    description: 'Inflation series.',
    inputSchema: { type: 'object', properties: { country: { type: 'string' }, historical: { type: 'boolean' }, start: { type: 'string' }, end: { type: 'string' }, sortBy: { type: 'string' }, sortOrder: { type: 'string' } } },
  },
  {
    name: 'prime_rate',
    description: 'Prime rate series.',
    inputSchema: { type: 'object', properties: { country: { type: 'string' }, historical: { type: 'boolean' }, start: { type: 'string' }, end: { type: 'string' }, sortBy: { type: 'string' }, sortOrder: { type: 'string' } } },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const get = async (path: string, params?: Record<string, unknown>) => {
    const p = new URLSearchParams();
    if (params) for (const [k, v] of Object.entries(params)) if (v != null) p.set(k, String(v));
    const url = `${BASE}${path}${[...p].length ? `?${p}` : ''}`;
    const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': UA } });
    if (!res.ok) throw new Error(`brapi: ${res.status}`);
    return res.json();
  };
  const reqStr = (k: string, ex: string) => {
    const v = args[k];
    if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${k}" is missing. Pass a string like ${ex}.`);
    return v;
  };
  switch (name) {
    case 'quote_list':
      return get('/quote/list', args);
    case 'quote': {
      const tickers = encodeURIComponent(reqStr('tickers', '"PETR4,VALE3"'));
      return get(`/quote/${tickers}`, { range: args.range, interval: args.interval, fundamental: args.fundamental, dividends: args.dividends, modules: args.modules });
    }
    case 'available':
      return get('/available');
    case 'crypto':
      return get('/v2/crypto', { coin: reqStr('coin', '"BTC"'), currency: args.currency });
    case 'currency':
      return get('/v2/currency', { currency: reqStr('currency', '"USD-BRL"') });
    case 'inflation':
      return get('/v2/inflation', args);
    case 'prime_rate':
      return get('/v2/prime-rate', args);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
