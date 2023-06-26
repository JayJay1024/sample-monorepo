import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import { GraphQLClient, ClientContext, useManualQuery } from "graphql-hooks";
import { providers, Contract, utils, BigNumber } from "ethers";
import lnbridgeAbi from "./abis/lnbridgeAbi.json";

const client = new GraphQLClient({
  url: "https://apollo-test.helixbridge.app/graphql",
});
const contractAddress = "0xBfbCe15bb38a28add41f3Bf1B80E579ae7B7a4c0";

const GET_RELAYERS_INFO = `
  query sortedLnv20RelayInfos($amount: BigInt, $decimals: BigInt) {
    sortedLnv20RelayInfos(amount: $amount, decimals: $decimals) {
      providerKey,
      margin
    }
  }
`;

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>

      <ClientContext.Provider value={client}>
        <LnBridgeV2 />
      </ClientContext.Provider>
    </>
  );
}

const LnBridgeV2 = () => {
  const [fetchRelayersInfo] = useManualQuery(GET_RELAYERS_INFO);

  const handleClick = async () => {
    const provider = new providers.Web3Provider(window.ethereum);
    const contract = new Contract(contractAddress, lnbridgeAbi, provider.getSigner());

    const [account] = await provider.send("eth_requestAccounts", []);
    const recipient = account;
    // const sender = account;

    const transferAmount = utils.parseEther("0.000005");
    const { data: relayersInfo } = await fetchRelayersInfo({
      variables: {
        amount: transferAmount.toNumber(),
        decimals: 1000000000000000000,
      },
    });

    if (relayersInfo?.sortedLnv20RelayInfos.length) {
      const providerKey = Number(relayersInfo.sortedLnv20RelayInfos[0].providerKey);
      const depositedMargin = BigNumber.from(relayersInfo.sortedLnv20RelayInfos[0].margin);

      const [providerInfo, totalFee] = await Promise.all([
        contract.lnProviders(providerKey),
        contract.totalFee(providerKey, transferAmount),
      ]);
      const transferId = providerInfo?.lastTransferId as string | undefined;

      const receipt = await contract.transferAndLockMargin(
        [providerKey, transferId, depositedMargin, totalFee],
        transferAmount,
        recipient,
        { gasLimit: 1000000 }
      );

      console.info("receipt:", receipt);
    } else {
      console.warn("relayersInfo:", relayersInfo);
    }
  };

  return <button onClick={handleClick}>Click</button>;
};

export default App;
