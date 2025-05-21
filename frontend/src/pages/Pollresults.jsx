// src/Results.js
import React, { useEffect, useState } from "react";

const POLL_ID = "7c39bb41-e03b-4bb5-8660-957142f6a1f9";

function Results() {
  const [results, setResults] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3001/poll/${POLL_ID}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("data",data.type);
      
      if (data.type === "update") {
        console.log("----- here data", data.options);
        
        setResults(data.options);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    if (results) {
      console.log("Results state updated:", results);
    }
  }, [results]);
  console.log("setResults", results);


  if (!results) return <div>Waiting for poll results...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Poll Results</h2>
      <ul>
        {results?.map((opt) => (
          <li key={opt.id}>
            {opt.text}: {opt.votes} votes
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Results;
