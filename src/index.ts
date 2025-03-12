import { events as erc721Events } from "./abi/erc721";
import { events as erc20Events } from "./abi/erc20";
import { EventDecodingPipe } from "./event-decoding-pipe";

async function main() {
  const pipe = new EventDecodingPipe(
    "https://portal.sqd.dev/datasets/base-mainnet",
    [erc721Events, erc20Events]
  );

  const stream = await pipe.stream({
      startBlock: 26597646,
      contractAddresses: ['0xd4554bea546efa83c1e6b389ecac40ea999b3e78']
  });

  for await (const events of stream) {
    events.forEach((event) => {
      if (event.topic === erc20Events.Transfer.topic) {
        console.log("Transfer event", event);
      }

      if (event.topic === erc721Events.Transfer.topic) {
        console.log("ERC721 Transfer event", event);
      }
    });
  }
}

main();
