# MercadoPago MCP Server

The MercadoPago MCP Server implements the [Model Context Protocol (MCP)](https://modelcontextprotocol.io) standard, enabling AI agents and LLMs to interact with MercadoPago APIs through natural language.

## What is MCP Server?

MCP Server acts as an intermediary that translates MercadoPago ecosystem resources into executable tools that AI applications can invoke. This enables:

- Simplified integration process
- Code implementation through natural language
- Automated payment flows assisted by AI

## Requirements

| Requirement | Details |
|-------------|---------|
| **Node.js** | Version 20 or higher |
| **NPM** | Version 5.2.0+ (for npx) |
| **Network** | Access to `https://mcp.mercadopago.com/mcp` |
| **Credentials** | Valid MercadoPago Access Token |

## Compatible Clients

- Cursor (v1+)
- VS Code
- Windsurf
- Cline
- Claude Desktop
- Claude Code
- ChatGPT

## Connection Setup

### Cursor / VS Code

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "mercadopago": {
      "command": "npx",
      "args": ["-y", "@mercadopago/mcp-server"],
      "env": {
        "MP_ACCESS_TOKEN": "your-access-token"
      }
    }
  }
}
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mercadopago": {
      "command": "npx",
      "args": ["-y", "@mercadopago/mcp-server"],
      "env": {
        "MP_ACCESS_TOKEN": "your-access-token"
      }
    }
  }
}
```

## Available Tools

The MCP Server exposes MercadoPago APIs as tools:

| Tool | Description |
|------|-------------|
| `create_preference` | Create a Checkout Pro preference |
| `get_payment` | Retrieve payment details |
| `search_payments` | Search payments with filters |
| `get_payment_methods` | List available payment methods |
| `create_refund` | Process a refund |

## Troubleshooting

### Connection Failed

**Symptoms**: Cannot connect to MCP Server

**Solutions**:
1. Check internet connection
2. Verify no firewall blocks `https://mcp.mercadopago.com/mcp`
3. Test network access: `curl https://mcp.mercadopago.com/mcp`

### Invalid Credentials

**Symptoms**: Authentication errors, 401 responses

**Solutions**:
1. Verify Access Token is correct
2. Test credentials with public API:
   ```bash
   curl -X GET \
     "https://api.mercadopago.com/v1/payment_methods" \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```
3. Regenerate credentials from [Developer Panel](https://www.mercadopago.com/developers/panel/app)

### NPX Not Found

**Symptoms**: `command not found: npx`

**Solutions**:
1. Check npm version: `npm --version` (needs 5.2.0+)
2. Update npm: `npm install -g npm`
3. Verify npx: `npx --version`

### Node.js Version Incompatible

**Symptoms**: Syntax errors, module not found

**Solutions**:
1. Check version: `node -v` (needs v20+)
2. Install with nvm:
   ```bash
   nvm install 20
   nvm use 20
   ```

### Outdated Client

**Symptoms**: Features not working, unexpected errors

**Solutions**:
1. Update your IDE/client to latest version
2. Check MercadoPago changelog for breaking changes
3. Clear client cache and restart

## Verifying Setup

Test your MCP connection by asking the AI:

```
List available payment methods for my MercadoPago account
```

If configured correctly, the AI will use the `get_payment_methods` tool and return your available methods.

## Best Practices

1. **Use TEST credentials** during development
2. **Never expose** Access Token in frontend code
3. **Rotate credentials** if compromised
4. **Monitor** API usage in Developer Panel

## References

- [MCP Server Documentation](https://www.mercadopago.com/developers/es/docs/checkout-api/additional-content/mcp-server)
- [MCP Server Troubleshooting](https://www.mercadopago.com/developers/en/docs/checkout-api-payments/additional-content/mcp-server/troubleshooting)
- [Model Context Protocol](https://modelcontextprotocol.io)
