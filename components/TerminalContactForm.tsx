"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { SOYAL_DATA } from "@/config/personalConfig";
import { submitContactForm } from "@/app/actions/contact";

type Step = 'name' | 'email' | 'message' | 'uploading' | 'success';

export default function TerminalContactForm() {
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

  const handleTerminalClick = () => {
    if (step !== 'uploading' && step !== 'success') {
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    handleTerminalClick();
  }, [step]);

  // Fix 3: Scroll the form into view when the mobile keyboard opens
  const handleInputFocus = useCallback(() => {
    // Small delay lets the keyboard animation start before we scroll
    setTimeout(() => {
      formContainerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 100);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (step === 'name' && name.trim()) setStep('email');
      else if (step === 'email' && email.includes('@')) setStep('message');
      else if (step === 'message' && message.trim()) {
        setStep('uploading');
        simulateUpload();
      }
    }
  };

  const currentInput = step === 'name' ? name : step === 'email' ? email : message;
  const setCurrentInput = (val: string) => {
    if (step === 'name') setName(val);
    if (step === 'email') setEmail(val);
    if (step === 'message') setMessage(val);
  };

  const simulateUpload = async () => {
    setProgress(0);
    
    // Fire the async server action off in the background while the UI loads
    const actionPromise = submitContactForm(name, email, message);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const jump = Math.floor(Math.random() * 20) + 10;
        if (prev + jump >= 90) {
          // Pause visual progress at 90% until backend server resolves
          return 90; 
        }
        return prev + jump;
      });
    }, 300);

    // Wait absolutely for the network layer
    await actionPromise;
    clearInterval(interval);
    
    // Fulfill UI requirement upon successful handshake
    setProgress(100);
    setTimeout(() => setStep('success'), 600);
  };

  const Prefix = () => <span className="text-graphite mr-3 inline-block select-none">root@data-core:~#</span>;

  return (
    <div 
      ref={formContainerRef}
      onClick={handleTerminalClick}
      className="w-full max-w-3xl bg-[#000000] border border-white/10 rounded-xl p-8 font-mono text-sm md:text-base cursor-text relative overflow-hidden shadow-[0_0_50px_rgba(0,245,255,0.05)] mx-auto text-left keyboard-safe"
    >
      {/* OS Style Top Bar */}
      <div className="absolute top-0 left-0 w-full h-8 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
        <div className="w-3 h-3 rounded-full bg-white/20"></div>
        <div className="w-3 h-3 rounded-full bg-white/20"></div>
        <div className="w-3 h-3 rounded-full bg-white/20"></div>
        <span className="text-[10px] text-graphite ml-4 tracking-widest uppercase">SQL_TERMINAL_V9.2.1</span>
      </div>

      <div className="mt-8 relative z-10 flex flex-col gap-3 h-[300px] overflow-y-auto w-full scrollbar-hide">
        <div className="text-graphite opacity-50 mb-4 whitespace-pre-line leading-relaxed flex flex-col gap-1">
          <span>{`// ESTABLISHING SECURE HANDSHAKE...`}</span>
          <span>{`// VERIFYING CONNECTION... [OK]`}</span>
          <span className="text-datacyan">{`// TARGET HOST: ${SOYAL_DATA.name.toUpperCase()} <${SOYAL_DATA.email}>`}</span>
          <span>{`// LOCATION NET: ${SOYAL_DATA.address} | TIER-1 ROUTE: ${SOYAL_DATA.phone}`}</span>
          <span>{`// READY FOR DATA INGESTION.`}</span>
          <span>{`// PRESS [ENTER] TO COMMIT EACH ROW.`}</span>
        </div>

        {/* Execution Log */}
        {(step !== 'name') && (
          <div className="text-white">
            <Prefix /> <span className="text-datacyan">INSERT INTO</span> contacts (name) <span className="text-datacyan">VALUES</span> ('{name}');
            <br/><span className="text-graphite text-xs ml-[140px]">Query OK, 1 row affected.</span>
          </div>
        )}
        {(step === 'message' || step === 'uploading' || step === 'success') && (
          <div className="text-white">
            <Prefix /> <span className="text-datacyan">UPDATE</span> contacts <span className="text-datacyan">SET</span> email='{email}';
            <br/><span className="text-graphite text-xs ml-[140px]">Query OK, 1 row affected.</span>
          </div>
        )}
        {(step === 'uploading' || step === 'success') && (
          <div className="text-white">
            <Prefix /> <span className="text-datacyan">UPDATE</span> contacts <span className="text-datacyan">SET</span> message='{message}';
            <br/><span className="text-graphite text-xs ml-[140px]">Query OK, 1 row affected.</span>
          </div>
        )}

        {/* Current Active Step Input */}
        {(step === 'name' || step === 'email' || step === 'message') && (
          <div className="text-white flex">
            <Prefix /> 
            <div className="flex-1 min-w-0 flex flex-wrap break-all">
              <span className="text-datacyan mr-2 whitespace-nowrap">
                {step === 'name' ? '> INPUT NAME_:' : step === 'email' ? '> INPUT EMAIL_:' : '> INPUT MSG_:'}
              </span>
              <span className="text-white inline-block">
                {currentInput}
                <motion.span 
                  animate={{ opacity: [1, 0, 1] }} 
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-2.5 bg-datacyan h-5 ml-1 align-middle translate-y-[-1px]"
                />
              </span>
            </div>
          </div>
        )}

        {/* Progress Bar Injection */}
        {step === 'uploading' && (
          <div className="mt-6 flex flex-col gap-2 text-datacyan w-full max-w-md mx-auto">
            <div className="flex justify-between text-xs tracking-widest">
              <span>DATA UPLOAD PROGRESS</span>
              <span>[{Math.min(progress, 100)}%]</span>
            </div>
            
            <div className="w-full h-1 bg-white/10 mt-1 relative overflow-hidden">
               <motion.div 
                 className="absolute top-0 left-0 h-full bg-datacyan"
                 initial={{ width: "0%" }}
                 animate={{ width: `${Math.min(progress, 100)}%` }}
                 transition={{ ease: "circOut" }}
               />
            </div>
            <span className="text-xs text-graphite blink mt-1 tracking-widest uppercase">{"Uploading data packets -> server.io"}</span>
          </div>
        )}

        {/* Final Output */}
        {step === 'success' && (
          <div className="mt-8 text-white text-center border border-datacyan/30 p-4 bg-datacyan/5">
            <span className="text-datacyan font-bold tracking-widest text-lg block mb-2">TRANSACTION COMMITTED.</span>
            <span className="text-graphite text-xs">{"// Your data packet has been delivered successfully. I will connect shortly."}</span>
          </div>
        )}
      </div>

      {/* Hidden Mobile Native Input — positioned in-flow but visually invisible
          so scrollIntoView works correctly. The opacity-0/h-0 approach keeps it
          part of the layout flow while remaining invisible. */}
      {(step === 'name' || step === 'email' || step === 'message') && (
        <input 
          ref={inputRef}
          type={step === "email" ? "email" : "text"}
          className="opacity-0 h-0 w-full overflow-hidden border-0 p-0 m-0 block"
          autoFocus
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
        />
      )}
    </div>
  );
}
