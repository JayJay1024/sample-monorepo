import { ethers } from "ethers";

async function main() {
  try {
    // setup
    const provider = new ethers.JsonRpcProvider("https://ethereum.publicnode.com");

    // action
    const blockNumber = await provider.getBlockNumber();
    const feeData = await provider.getFeeData();

    // output
    console.log("block number:", blockNumber);
    console.log("fee data:", feeData.toJSON());
  } catch (err) {
    console.error(err);
  }
}

main();
