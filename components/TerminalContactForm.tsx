"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { SOYAL_DATA } from "@/config/personalConfig";
import { submitContactForm } from "@/app/actions/contact";

type Step = 'name' | 'email' | 'message' | 'uploading' | 'success' | 'error';

/**
 * Improved email validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default function TerminalContactForm() {
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [csrfToken, setCSRFToken] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Initialize CSRF token on mount
  useEffect(() => {
    // In a real app, fetch CSRF token from server
    // For now, generate a simple one client-side
    setCSRFToken(Math.random().toString(36).substring(2));
  }, []);

  const handleTerminalClick = () => {
    if (step !== 'uploading' && step !== 'success' && step !== 'error') {
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    // Only focus on step changes AFTER initial mount, not on initial 'name' step
    if (step !== 'name') {
      handleTerminalClick();
    }
  }, [step]);

  const handleInputFocus = useCallback(() => {
    // On mobile, don't scroll immediately - let keyboard animation finish
    // Use requestAnimationFrame to sync with browser layout
    if (typeof window === "undefined") return;
    
    requestAnimationFrame(() => {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) return; // Only scroll on mobile
      
      const formElement = formContainerRef.current;
      if (!formElement) return;

      // Use a small delay for iOS keyboard animation
      const delay = /iPhone|iPad|iPod/.test(navigator.userAgent) ? 300 : 100;
      
      setTimeout(() => {
        const input = inputRef.current;
        if (!input) return;

        // Scroll input into view with minimal offset
        const scrollOptions: ScrollIntoViewOptions = {
          behavior: 'smooth',
          block: 'end' as const, // Align to bottom to avoid keyboard covering
        };

        input.scrollIntoView(scrollOptions);
      }, delay);
    });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Improved validation for each step
      if (step === 'name') {
        if (name.trim().length < 2) {
          setErrorMessage("Name must be at least 2 characters.");
          return;
        }
        setErrorMessage("");
        setStep('email');
      } else if (step === 'email') {
        if (!isValidEmail(email)) {
          setErrorMessage("Please enter a valid email address.");
          return;
        }
        setErrorMessage("");
        setStep('message');
      } else if (step === 'message') {
        if (message.trim().length < 10) {
          setErrorMessage("Message must be at least 10 characters.");
          return;
        }
        if (message.length > 2000) {
          setErrorMessage("Message is too long (max 2000 characters).");
          return;
        }
        setErrorMessage("");
        setStep('uploading');
        simulateUpload();
      }
    }
  };

  const currentInput = step === 'name' ? name : step === 'email' ? email : message;
  const setCurrentInput = (val: string) => {
    setErrorMessage(""); // Clear error when user starts typing
    if (step === 'name') setName(val);
    if (step === 'email') setEmail(val);
    if (step === 'message') setMessage(val);
  };

  const simulateUpload = async () => {
    setProgress(0);
    
    // Start animated progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const jump = Math.floor(Math.random() * 20) + 10;
        if (prev + jump >= 90) {
          return 90; // Pause at 90% until server responds
        }
        return prev + jump;
      });
    }, 300);

    try {
      // Call server action with CSRF token
      const result = await submitContactForm(name, email, message, csrfToken);
      
      clearInterval(interval);
      
      if (result.success) {
        setProgress(100);
        setTimeout(() => setStep('success'), 600);
      } else {
        // Server-side validation error
        setErrorMessage(result.error || "Failed to send message.");
        clearInterval(interval);
        setProgress(0);
        setStep('error');
      }
    } catch (error) {
      clearInterval(interval);
      setErrorMessage("Network error. Please check your connection and try again.");
      setProgress(0);
      setStep('error');
      console.error("Form submission error:", error);
    }
  };

  const handleRetry = () => {
    setErrorMessage("");
    setStep('message');
    setProgress(0);
  };

  const Prefix = () => <span className="text-graphite mr-3 inline-block select-none">root@data-core:~#</span>;

  return (
    <div 
      ref={formContainerRef}
      onClick={handleTerminalClick}
      className="w-full max-w-3xl bg-[#000000] border border-white/10 rounded-xl p-8 font-mono text-sm md:text-base cursor-text relative overflow-hidden shadow-[0_0_50px_rgba(0,245,255,0.05)] mx-auto text-left"
      style={{
        // Prevent iOS from zooming on input focus
        paddingBottom: 'max(2rem, env(safe-area-inset-bottom))'
      }}
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
        {(step === 'message' || step === 'uploading' || step === 'success' || step === 'error') && (
          <div className="text-white">
            <Prefix /> <span className="text-datacyan">UPDATE</span> contacts <span className="text-datacyan">SET</span> email='{email}';
            <br/><span className="text-graphite text-xs ml-[140px]">Query OK, 1 row affected.</span>
          </div>
        )}
        {(step === 'uploading' || step === 'success' || step === 'error') && (
          <div className="text-white">
            <Prefix /> <span className="text-datacyan">UPDATE</span> contacts <span className="text-datacyan">SET</span> message='{message}';
            <br/><span className="text-graphite text-xs ml-[140px]">Query OK, 1 row affected.</span>
          </div>
        )}

        {/* Error Message Display */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
            <span className="text-datacyan">ERROR:</span> {errorMessage}
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

        {/* Error State with Retry */}
        {step === 'error' && (
          <div className="mt-8 text-white text-center border border-red-500/30 p-4 bg-red-500/5">
            <span className="text-red-400 font-bold tracking-widest text-lg block mb-2">TRANSACTION FAILED.</span>
            <span className="text-graphite text-xs block mb-4">{errorMessage}</span>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-datacyan/20 border border-datacyan text-datacyan text-xs rounded hover:bg-datacyan/30 transition-colors"
            >
              [RETRY]
            </button>
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

      {/* Hidden Mobile Native Input */}
      {(step === 'name' || step === 'email' || step === 'message') && (
        <input 
          ref={inputRef}
          type={step === "email" ? "email" : "text"}
          className="opacity-0 h-0 w-full overflow-hidden border-0 p-0 m-0 block absolute"
          autoFocus={false}
          autoComplete={step === "email" ? "email" : step === "name" ? "name" : "off"}
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            fontSize: '16px',
            left: '-9999px',
          }}
        />
      )}
    </div>
  );
}
