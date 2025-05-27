import React, { useState, useEffect } from "react";

const RAM_SIZE = 64;
const SECRET = "password=1234";

function App() {
  const [ram, setRam] = useState(new Array(RAM_SIZE).fill("0"));
  const [log, setLog] = useState([]);
  const [powered, setPowered] = useState(true);
  const [decayStrength, setDecayStrength] = useState(30);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const [decayingBits, setDecayingBits] = useState([]);
  const [showInfo, setShowInfo] = useState(true);

  const logAction = (msg) => setLog((prev) => [msg, ...prev]);

  const initRAM = () => {
    const newRam = new Array(RAM_SIZE).fill("0");
    const start = 20;
    for (let i = 0; i < SECRET.length; i++) {
      newRam[start + i] = SECRET[i];
    }
    setRam(newRam);
    setHighlightIndex(-1);
    logAction("[INIT] RAM initialized with secret.");
  };

  const powerOff = () => {
    setPowered(false);
    logAction("[POWER OFF] System powered off. RAM frozen.");
  };

  const decayRAM = () => {
    if (powered) {
      logAction("[ERROR] Cannot decay RAM while system is on.");
      return;
    }

    const decayed = [...ram];
    const decaying = [];

    for (let i = 0; i < RAM_SIZE; i++) {
      if (Math.random() * 100 < decayStrength && decayed[i] !== "0") {
        decaying.push(i);
      }
    }

    setDecayingBits(decaying);

    setTimeout(() => {
      for (let i of decaying) {
        decayed[i] = String.fromCharCode(33 + Math.floor(Math.random() * 94));
      }
      setRam(decayed);
      setDecayingBits([]);
      logAction(`[DECAY] RAM decayed with strength: ${decayStrength}%`);
    }, 500); // Delay to simulate animation
  };

  const recoverSecret = () => {
    const ramString = ram.join("");
    const idx = ramString.indexOf("password=");
    if (idx !== -1) {
      setHighlightIndex(idx);
      const recovered = ramString.substring(idx, idx + 13);
      const extractedPassword = recovered.split("=")[1];
      setPassword(extractedPassword);
      setShowLogin(true);
      logAction(`[RECOVERY] Extracted password: ${extractedPassword}`);
    } else {
      setHighlightIndex(-1);
      logAction("[RECOVERY] No recognizable secret found.");
    }
  };

  const secureWipe = () => {
    const wiped = new Array(RAM_SIZE).fill("0");
    setRam(wiped);
    setHighlightIndex(-1);
    logAction("[WIPE] RAM securely wiped.");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-mono flex flex-col md:flex-row gap-6">
      <div className="flex-1 max-w-full">
        <h1 className="text-2xl font-bold mb-4">🧊 Cold Boot Attack Simulator</h1>

        {showLogin && !loggedIn && (
          <div className="bg-gray-800 p-4 mb-6 rounded shadow-lg max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-2">🔐 Simulated Login</h2>
            <input
              type="text"
              placeholder="Username"
              className="w-full mb-2 p-2 rounded bg-gray-900 text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-2 p-2 rounded bg-gray-900 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full"
              onClick={() => {
                if (password === "1234") {
                  setLoggedIn(true);
                  setShowLogin(false);
                  logAction("[LOGIN] Successfully logged in.");
                } else {
                  logAction("[LOGIN FAILED] Incorrect password.");
                }
              }}
            >
              Login
            </button>
            <p className="text-sm mt-2 text-gray-400">
              Hint: Try cold boot recovery if you forgot the password!
            </p>
          </div>
        )}

        {loggedIn && (
          <div className="bg-green-800 text-white p-4 rounded shadow mb-4 text-center font-bold">
            ✅ Access Granted — Welcome, {username || "User"}!
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-xl mb-2">Simulated RAM</h2>
            <div className="grid grid-cols-32 gap-1 overflow-x-auto text-sm border border-gray-700 p-2 bg-gray-800 rounded">
              {ram.map((cell, idx) => {
                let cellClass = "bg-gray-600 text-white";
                if (highlightIndex !== -1 && idx >= highlightIndex && idx < highlightIndex + SECRET.length) {
                  cellClass = "bg-green-400 text-black";
                } else if (cell !== "0") {
                  cellClass = "bg-yellow-400 text-black";
                }
                if (decayingBits.includes(idx)) {
                  cellClass += " animate-pulse";
                }

                return (
                  <div
                    key={idx}
                    className={`w-6 h-6 flex items-center justify-center rounded font-bold shadow ${cellClass}`}
                    title={`0x${idx.toString(16).padStart(2, "0").toUpperCase()}`}
                  >
                    {cell}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-xl mb-2">Controls</h2>
            <div className="flex flex-col gap-2">
              <button className="bg-green-600 hover:bg-green-700 p-2 rounded" onClick={initRAM}>
                Initialize RAM
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded" onClick={powerOff}>
                Power Off
              </button>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={decayStrength}
                  onChange={(e) => setDecayStrength(Number(e.target.value))}
                />
                <span>Decay: {decayStrength}%</span>
              </div>
              <button className="bg-yellow-600 hover:bg-yellow-700 p-2 rounded" onClick={decayRAM}>
                Decay RAM
              </button>
              <button className="bg-red-600 hover:bg-red-700 p-2 rounded" onClick={secureWipe}>
                Secure Wipe
              </button>
              <button className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded" onClick={recoverSecret}>
                Recover Secret
              </button>
              <button
                className="mt-4 bg-gray-700 hover:bg-gray-600 p-2 rounded"
                onClick={() => setShowInfo((prev) => !prev)}
              >
                {showInfo ? "Hide Info Panel" : "Show Info Panel"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl mb-2">Log Output</h2>
          <div className="bg-gray-800 p-4 rounded max-h-60 overflow-y-auto text-sm">
            {log.map((entry, idx) => (
              <div key={idx}>{entry}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Educational Info Panel */}
      {showInfo && (
        <aside className="w-full md:w-96 bg-gray-800 p-4 rounded shadow text-sm overflow-y-auto max-h-[80vh]">
          <h2 className="text-xl font-bold mb-4">📚 Educational Info</h2>
          <section className="mb-4">
            <h3 className="font-semibold mb-1">What’s Happening?</h3>
            <p>
              This demo simulates a <strong>Cold Boot Attack</strong> where data stored in RAM can be
              recovered after powering off the system. Normally, RAM loses data quickly, but when
              cooled or immediately accessed, remnants of sensitive info (like passwords) remain.
            </p>
          </section>

          <section className="mb-4">
            <h3 className="font-semibold mb-1">Attack Scenario</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>User logs in, secret password stored in RAM.</li>
              <li>System powers off, RAM data 'freezes' temporarily.</li>
              <li>RAM bits start to <em>decay</em> gradually, corrupting data.</li>
              <li>Attacker recovers RAM contents via physical access and finds leftover secrets.</li>
              <li>Recovered password allows bypassing authentication.</li>
            </ol>
          </section>

          <section className="mb-4">
            <h3 className="font-semibold mb-1">Real-World Use</h3>
            <p>
              Cold boot attacks have been used to extract encryption keys from memory of powered-off
              computers, especially when attackers had physical access. These attacks can defeat
              full disk encryption if keys are in RAM.
            </p>
          </section>

          <section className="mb-4">
            <h3 className="font-semibold mb-1">Limitations</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>RAM data decays quickly after power loss, so timing is critical.</li>
              <li>Attack requires physical access to the machine.</li>
              <li>Modern systems use memory scrambling to mitigate this.</li>
            </ul>
          </section>

          <section className="mb-4">
            <h3 className="font-semibold mb-1">Protection Tips</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Use full disk encryption and protect keys with TPM hardware.</li>
              <li>Implement memory scrambling and encryption techniques.</li>
              <li>Clear sensitive data from RAM immediately after use.</li>
              <li>Power down machines securely and avoid cold boot scenarios.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-1">Learn More</h3>
            <p>
              For more on cold boot attacks, see the original research by <a
                href="https://citp.princeton.edu/research/memory/" target="_blank" rel="noreferrer"
                className="underline text-blue-400">Princeton CITP</a>.
            </p>
          </section>
        </aside>
      )}
    </div>
  );
}

export default App;
