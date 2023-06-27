import { Web3Button } from "@web3modal/react";

import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { arbitrum, mainnet, polygon } from "wagmi/chains";

import { BigNumber, providers, utils } from "ethers";
import { useState } from "react";

export const Walletconnect = () => {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [balance, setBalannce] = useState<BigNumber>(BigNumber.from(0));
  const [blockNumber, setBlockNumber] = useState(-1);

  const handleClick = async () => {
    const p = await EthereumProvider.init({
      projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID, // REQUIRED your projectId
      chains: [arbitrum.id, mainnet.id, polygon.id], // REQUIRED chain ids
      // optionalChains, // OPTIONAL chains
      showQrModal: true, // REQUIRED set to "true" to use @walletconnect/modal
      methods: [
        "eth_requestAccounts",
        "eth_signTypedData",
        "eth_signTypedData_v4",
        "eth_sign",
        "eth_sendTransaction",
        "eth_signTransaction",
        "personal_sign",
      ], // REQUIRED ethereum methods
      // optionalMethods, // OPTIONAL ethereum methods
      events: ["chainChanged", "accountsChanged"], // REQUIRED ethereum events
      // optionalEvents, // OPTIONAL ethereum events
      // rpcMap, // OPTIONAL rpc urls for each chain
      // metadata, // OPTIONAL metadata of your app
      // qrModalOptions, // OPTIONAL - `undefined` by default, see https://docs.walletconnect.com/2.0/web3modal/options
    });

    // ISSUE: unable to use browser installed MetaMask
    await p.connect();
    const accs = await await p.enable();
    setAccounts(accs);

    const provider = new providers.Web3Provider(p);
    setBlockNumber(await provider.getBlockNumber());
    if (accs.length) {
      setBalannce(await provider.getBalance(accs[0]));
    }
  };

  return (
    <div style={{ marginBottom: "4rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", marginBottom: "1rem" }}>
        <Web3Button />
        <button onClick={handleClick}>Test Provider</button>
      </div>

      <ul>
        <li style={{ textAlign: "start" }}>
          <strong>Account:&nbsp;</strong>
          <span>{accounts.at(0) || "-"}</span>
        </li>
        <li style={{ textAlign: "start" }}>
          <strong>Block Number:&nbsp;</strong>
          <span>{blockNumber}</span>
        </li>
        <li style={{ textAlign: "start" }}>
          <strong>Balance:&nbsp;</strong>
          <span>{utils.formatEther(balance)}</span>
        </li>
      </ul>
    </div>
  );
};
