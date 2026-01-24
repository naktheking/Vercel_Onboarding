import { useEffect, useState } from 'react'
import './App.css'
import {InputBox} from "./elements/InputBox.jsx";
import {Quotes} from "./elements/Quotes.jsx";




function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/getMessage");
      const data = await res.json();
      setMessages(data);
    };
    load();
  }, []);


  return (
    <div>
      <InputBox setMessages={setMessages} />
      <Quotes messages={messages} />
    </div>
  )
}

export default App
