import React, { useState } from 'react';
import * as bip39 from "bip39";
import { HDKey } from 'micro-ed25519-hdkey';
import { Keypair } from '@solana/web3.js';
import { Buffer } from "buffer";
import bs58 from "bs58";

window.Buffer = Buffer;

const GetMnemonic = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [change, setChange] = useState("");
  const [wallets, setWallets] = useState([]);
  const [showPrivateKeyIndex, setShowPrivateKeyIndex] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  const generateMnemonic = () => {
    setMnemonic(bip39.generateMnemonic());
  };

  const generateMultipleWallets = () => {
    if(change==='')
    {
      alert("pls generate the mneomics")
    }
    else
    {
    const seed = bip39.mnemonicToSeedSync(change);
    const hd = HDKey.fromMasterSeed(seed.toString("hex"));
    const path = `m/44'/501'/${wallets.length}'/0'`;
    const keypair = Keypair.fromSeed(hd.derive(path).privateKey);
    const publicKey = keypair.publicKey.toBase58();
    const privateKeyArray = keypair.secretKey;
    const privateKey = bs58.encode(privateKeyArray);

    setWallets([...wallets, { publicKey, privateKey }]);

    // Show video after 3 seconds
    setTimeout(() => {
      setShowVideo(true);
    }, 3000);
  }
  };

  const handleTogglePrivateKey = (index) => {
    setShowPrivateKeyIndex(showPrivateKeyIndex === index ? null : index);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Web Wallet Solana</h1>
      
      <div className="mb-4 text-center">
        <p
          id="mnemo"
          className="cursor-pointer text-blue-500 hover:underline"
          onClick={() => {
            if (mnemonic !== "") {
              navigator.clipboard
                .writeText(mnemonic)
                .then(() => {
                  alert("Mnemonic copied to clipboard!");
                })
                .catch((err) => {
                  console.error("Failed to copy mnemonic: ", err);
                });
            }
          }}
        >
          {mnemonic ? mnemonic : "Click below button to generate mnemonic"}
        </p>
        <button
          onClick={generateMnemonic}
          className="mt-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Generate Mnemonic
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded shadow-lg">
        <h3 className="text-xl font-semibold mb-2">Multiple Wallet Generation</h3>
        <p>Step 1: Generate a mnemonic using the button above.</p>
        <p>Step 2: Paste the mnemonic in the input field below.</p>
        <input
          type="text"
          placeholder="Paste mnemonic here"
          onChange={(e) => setChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <button
          onClick={generateMultipleWallets}
          className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600"
        >
          Generate Wallets
        </button>
        <div className="mt-4 space-y-4">
          {wallets.map((wallet, index) => (
            <div key={index} className="p-4 bg-white shadow rounded border border-gray-200">
              <h4 className="text-lg font-semibold mb-2">Wallet {index + 1}</h4>
              <p className="text-sm"><strong>Public Key:</strong> {wallet.publicKey}</p>
              <button
                onClick={() => handleTogglePrivateKey(index)}
                className="mt-2 px-4 py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600"
              >
                {showPrivateKeyIndex === index ? "Hide Private Key" : "Show Private Key"}
              </button>
              {showPrivateKeyIndex === index && (
                <p className="mt-2 text-sm"><strong>Private Key:</strong> {wallet.privateKey}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Video Popup */}
      {showVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg w-full max-w-lg">
            <h4 className="text-lg font-semibold mb-2">congrats</h4>
            {/* <iframe
              width="100%"
              height="100%"
              src="src/assets/cel.mp4" // Replace with the actual YouTube embed URL
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe> */}
            {/* <video
              controls
              width="100%"
              src="src/assets/cel.mp4"// Path to your video file
            >
              Your browser does not support the video tag.
            </video> */}
            <button
              onClick={() => setShowVideo(false)}
              className="mt-2 px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetMnemonic;
