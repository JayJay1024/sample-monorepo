import { ethers } from "ethers";

async function main() {
  try {
    // setup
    const provider = new ethers.JsonRpcProvider("https://ethereum.publicnode.com");

    // action
    const blockNumber = await provider.getBlockNumber();

    // output
    console.log("block number:", blockNumber);
  } catch (err) {
    console.error(err);
  }
}

main();
