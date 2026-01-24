import { useState } from 'react'
import clockImg from "../assets/clock_image.png"

export function InputBox( {setMessages} ) {
  const [inputText, setInputText] = useState("");
  const [inputPerson, setInputPerson] = useState("");
  const [showClock, setShowClock] = useState(false);


  const insertMessage = async (message, person) => {
    const res = await fetch("http://localhost:3000/api/sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, person}),
  });

    const data = await res.json();
    console.log("Inserted:", data);
  };

  const sendMessage = async () => {
    if (inputText.trim() === "") return;
    const personToSend = inputPerson.trim() === "" ? "Unknown" : inputPerson;
    
    // show clock
    setShowClock(true);
    // hide it after animation finishes (match CSS duration)
    window.setTimeout(() => setShowClock(false), 700);
   
    if (setMessages) {
      const temp = {
        _id: crypto.randomUUID(),
        message: inputText,
        person: personToSend,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [temp, ...prev]);
    }

    await insertMessage(inputText, personToSend);

    setInputText("")
    setInputPerson("")
  };

  return (
    <div style={{position: "relative"}}>
      <h1>You just got clocked</h1>
      <h4>Type the quote and the person that said it </h4>

      <input 
        id="text_button"
        type="text" 
        placeholder="Quote..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      
      <input 
        id="person_button"
        type="text" 
        placeholder="Person..."
        value={inputPerson}
        onChange={(e) => setInputPerson(e.target.value)}
      />
  

      <button onClick={sendMessage}> Submit </button>

      {showClock && (
        <img
        src={clockImg}
        alt="clock"
        className="clock-pop"
        onAnimationEnd={() => setShowClock(false)}
        />
      )}
    </div>
  );
  
}