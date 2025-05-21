// src/App.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const POLL_ID = "7c39bb41-e03b-4bb5-8660-957142f6a1f9"; // Replace with your actual static poll ID

function App() {
  const [token, setToken] = useState(null);
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [success, setSuccess] = useState(false);

  const getUserToken = () => {
try {
    const sessionToken = sessionStorage.getItem("token");
    if (!sessionToken) {
      axios.post("http://localhost:3001/auth/anon").then((res) => {
        sessionStorage.setItem("token", res.data.token);
        setToken(res.data.token);
      });
    } else {
      setToken(sessionToken);
    }
} catch (error) {
    console.log("ERROR",error);
    
}
  }

  useEffect(() => {
    getUserToken()
  }, []);

  useEffect(() => {
    if (token) {
      axios.get(`http://localhost:3001/poll/${POLL_ID}`).then((res) => {
        console.log('res',res);
        
        setPoll(res.data.data);
      });
    }
  }, [token]);

  const handleVote = () => {
    if (!selectedOption) return;
    axios.post(
      `http://localhost:3001/poll/${POLL_ID}/vote`,
      { optionId: selectedOption },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(()=>
        {setSelectedOption(null)
        setSuccess(true)}
    )
    
  };

  if (!poll) return <div>Loading poll...</div>;
  return (
    <div style={{ padding: 20 }}>
      <h2>{poll.question}</h2>
      <ul>
        {poll?.options?.rows?.map((option) => (
          <li key={option?.id}>
            <label>
              <input
                type="radio"
                name="pollOption"
                value={option.id}
                onChange={() => setSelectedOption(option.id)}
              />
              {option.text}
            </label>
          </li>
        ))}
      </ul>
      {success && !selectedOption && <p>Poll Successfull</p>}
      <button onClick={handleVote} disabled={!selectedOption}>
        Submit Vote
      </button>
      <button onClick={() => {
      window.location.href = "/results";
    }} >
        See Reults
      </button>
    </div>
  );
}

export default App;