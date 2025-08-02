"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Msg { id:string; sender:'user'|'ai'; content:string; }

export default function TransactionChat() {
  const [messages,setMessages]=useState<Msg[]>([]);
  const [input,setInput]=useState('');
  const [loading,setLoading]=useState(false);
  const endRef=useRef<HTMLDivElement>(null);

  const scroll=()=> endRef.current?.scrollIntoView({behavior:"smooth"});
  useEffect(scroll,[messages]);

  const send=async()=>{
    if(!input.trim()||loading) return;
    const userMsg:{id:string,sender:'user',content:string}={id:Date.now()+"",sender:'user',content:input};
    setMessages(prev=>[...prev,userMsg]);
    setInput('');
    setLoading(true);
    try{
      const endpoint = `https://transaction-ai-bot.onrender.com/analyze?merchant_query=${encodeURIComponent(input)}`;
      const res = await fetch(endpoint);
      if(!res.ok){ throw new Error('API error'); }
      const raw = await res.text();
      let formatted = raw;
      try {
        const obj = JSON.parse(raw);
        if (obj.final_answer) {
          formatted = obj.final_answer;
        }
        if (obj.graph_link) {
          formatted += `\n\n![graph](${obj.graph_link})`;
        }
      } catch {
        // not JSON, leave as-is
      }
      const aiMsg:Msg={id:Date.now()+1+"",sender:'ai',content:formatted};
      setMessages(prev=>[...prev,aiMsg]);
    }catch(e){
      setMessages(prev=>[...prev,{id:Date.now()+2+"",sender:'ai',content:'Error contacting AI'}]);
    }finally{setLoading(false);}  };

  const onKey=(e:React.KeyboardEvent)=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); send(); } };

  return (
    <div className="flex flex-col h-[80vh] border rounded-2xl bg-white shadow-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m=> (
          <div key={m.id} className={`flex ${m.sender==='user'?'justify-end':'justify-start'}`}>
            {m.sender==='ai' ? (
              (()=>{
                let txt=m.content;
                let img: string | null=null;
                const imgMatch=txt.match(/!\[[^\]]*\]\((.*?)\)/);
                if(imgMatch){ img=imgMatch[1]; txt=txt.replace(imgMatch[0],''); }
                const html=txt
                  .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
                  .replace(/\n/g,'<br/>');
                return (
                  <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2 max-w-[70%]">
                    <div dangerouslySetInnerHTML={{__html:html}} />
                    {img && <img src={img} alt="graph" className="mt-3 rounded-lg border"/>}
                  </div>
                );
              })()
            ) : (
              <div className="rounded-lg px-4 py-2 max-w-[70%] bg-pink-600 text-white">{m.content}</div>
            )}
          </div>
        ))}
        {loading&&<p className="text-sm text-gray-500">AI is typing…</p>}
        <div ref={endRef}/>
      </div>
      <div className="border-t p-4 space-x-2 flex">
        <Textarea className="flex-1 resize-none" rows={2} placeholder="Ask anything about your transactions…" value={input} onKeyDown={onKey} onChange={e=>setInput(e.target.value)}/>
        <Button disabled={!input.trim()||loading} onClick={send} className="bg-pink-600 hover:bg-pink-700 text-white"><Send className="w-4 h-4"/></Button>
      </div>
    </div>
  );
} 