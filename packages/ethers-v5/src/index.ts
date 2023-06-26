"use strict";

import { providers, utils } from "ethers";

export const parseBalance = (ether: string) => utils.parseEther(ether);

async function main() {
  try {
    const provider = new providers.JsonRpcProvider("https://pangolin-rpc.darwinia.network");
    console.log(await provider.getNetwork());
  } catch (err) {
    console.error(err);
  }
}

main();
