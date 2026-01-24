import { useEffect, useState } from 'react'

export function Quotes( { messages } ) {
    // const [messages, setMessages] = useState([]);

    // const getMessage = async () => {
    //     const res = await fetch("http://localhost:3000/api/getMessage");
    //     const data = await res.json();
    //     setMessages(data);
    // };

    // useEffect(() => {
    //     getMessage();
    // }, []);
    // runs this function when it renders and never again

  return (
    <div>
      <div>
        <h2>Past Quotes</h2> 
        <p> <i>Quote Count: {messages.length}</i></p>
      </div>
      {messages.map((msg) => (
        <div key={msg._id}>
          <p>{msg.message} - <b>{msg.person}</b></p>
        </div>
      ))}
      
    </div>
  );
  
}

