import { useState } from "react";

function Bank() {
  return (
    <div className="page">
      <h1>Game Dashboard</h1>
      <iframe 
        src="/bank.html" 
        width="100%" 
        height="500px" 
        title="Games"
        style={{ border: "none" }}
      ></iframe>
    </div>
  );
}

export default Bank;
