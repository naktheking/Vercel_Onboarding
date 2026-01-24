export function Quotes( { messages } ) {
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

