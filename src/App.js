import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import './app.css'
import Prompt from "./Prompt";
import Response from "./Response";


function App() {
  const [promptInput, setPromptInput] = useState('')
  const [prompt, setPrompt] = useState([])
  const [responses, setResponses] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const ArrowUp = () => (<svg className={isLoading ? 'icon isLoading' : 'icon' } xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000"><path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z"/></svg>)


  const bottomRef = useRef(null); 
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [responses]);


  const getResponse = async (text) => {
    if(text){
    setIsLoading(true)
    try {
      setPrompt(prevResponses => [...prevResponses, promptInput])
      setPromptInput(''); // Clear the input
      const response = await axios.post(
        'http://localhost:11434/api/chat',
        {
          model: "qwen:0.5b",
          messages: [
            {
              role: "system",
              content: "Your name is Mr. Robot"
            },
            {
              role: "user",
              content: text 
            }
          ],
          stream: false
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      setResponses(prevResponses => [...prevResponses, response.data.message.content]);
      setIsLoading(false)
    } catch (error) {
      setResponses(prevResponses => [...prevResponses, error.response?.data || error.message]);
      setIsLoading(false)
    }
  }
};
  

  const handelChange = e => {
    e.preventDefault()
    setPromptInput(e.target.value);
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      getResponse(promptInput); 
    }
  };

  return (
    <div className="App">
      <h1 className="header">Mr. Robot AI</h1>

      {/* fix the key issue in the mapping */}

      {
        prompt?.map((item, index)=>(
          <>
            <Prompt key={index} content={item} />
            <Response key={index * 500} content={responses[index]} />
          </>
        ))
      }

      <input onChange={handelChange} onKeyDown={handleKeyDown} className="input" value={promptInput} placeholder="Mr. Robot AI" />
      <div onClick={()=>getResponse(promptInput)} >
        <ArrowUp />
      </div>
       <div ref={bottomRef} /> {/* this is a component to track the bottom and move when a new component gets added */}
    </div>
  );
}

export default App;
