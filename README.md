# Event Decoding Pipe
A simple pipe for decoding EVM events from SQD Portal's data. This helps us transform the raw events into structured data, ready to be consumed in further transormations/aggregations.

## What's the benefit?
Most stream users need to decode transaction logs using the ABI before processing the data. The goal is to include this pipeline in the SDK, giving users a head start and reducing boilerplate for handling decoded events.

## How to Use It
Here's a basic example:

```typescript
import { EventDecodingPipe } from './event-decoding-pipe';
import { events as erc20Events } from './abi/erc20';
import { events as erc721Events } from './abi/erc721';

async function main() {
  // Create a new pipe with the Portal dataset URL and event definitions
  const pipe = new EventDecodingPipe(
    "https://portal.sqd.dev/datasets/base-mainnet",
    [erc20Events, erc721Events],
  );

  // Stream events starting from block 20,000,000
  const stream = await pipe.stream({ 
    startBlock: 20_000_000,
    contractAddresses: ['0x3319197b0d0f8ccd1087f2d2e47a8fb7c0710171'] // Optional
  });

  for await (const events of stream) {
    events.forEach(event => {
      if (event.topic === erc20Events.Transfer.topic) {
        console.log("ERC20 transfer:", event);
      }

      if (event.topic === erc721Events.Transfer.topic) {
        console.log("ERC721 transfer", event);
      }
    });
  }
}

main()
```

## Adding more contract ABIs

Need to add support for a new contract? Here's how:

### 1. Generate .ts files from your ABI

```bash
# Generate TypeScript files from your ABI JSON
npx @sqd/evm-typegen src/abi path/to/your-contract-abi.json
```

### 2. Import and use your contract events

```typescript
import { events as yourContractEvents } from './abi/your-contract';
import { events as erc20Events } from './abi/erc20';

// Create a pipe that decodes both your contract events and ERC20 events
const pipe = new EventDecodingPipe(
  "https://portal.sqd.dev/datasets/ethereum-mainnet",
  [yourContractEvents, erc20Events]
);

// Stream the events
const stream = await pipe.stream({ 
  startBlock: 15_000_000,
  contractAddresses: ['0xYourContractAddress', '0xSomeERC20Address']
});
```

## Filtering Options

The `stream()` method accepts these filtering options:

```typescript
interface Filters {
  startBlock: number;           // Block to start from (required)
  endBlock?: number;            // Optional end block
  contractAddresses?: string[]; // Optional list of contract addresses
  from?: string;                // Filter by transaction sender
  to?: string;                  // Filter by transaction recipient
}
```
