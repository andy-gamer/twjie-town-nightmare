
import React, { useEffect, useState, useRef } from 'react';
import { DialogueLine } from '../types';
import { ChevronRight } from 'lucide-react';
import { audioManager } from '../utils/AudioManager';

interface DialogueBoxProps {
  dialogue: DialogueLine | null;
  onNext: () => void;
  isEnd: boolean;
  forceShow: boolean;
  onTypingComplete: () => void;
}

const DialogueBox: React.FC<DialogueBoxProps> = ({ dialogue, onNext, isEnd, forceShow, onTypingComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (!dialogue) {
      setDisplayedText('');
      setCharIndex(0);
      return;
    }
    setDisplayedText('');
    setCharIndex(0);

    // Handle shake effect duration
    if (dialogue.effect === 'shake') {
        setIsShaking(true);
        const timer = setTimeout(() => setIsShaking(false), 500); // Shake for 0.5s then stop
        return () => clearTimeout(timer);
    } else {
        setIsShaking(false);
    }
  }, [dialogue]);

  // Handle Force Show (Skip typing)
  useEffect(() => {
      if (forceShow && dialogue && charIndex < dialogue.text.length) {
          setDisplayedText(dialogue.text);
          setCharIndex(dialogue.text.length);
          onTypingComplete();
      }
  }, [forceShow, dialogue, charIndex, onTypingComplete]);

  useEffect(() => {
    if (!dialogue) return;
    
    // If text is fully displayed
    if (charIndex >= dialogue.text.length) {
        if (displayedText === dialogue.text) {
             onTypingComplete();
        }
        return;
    }
    
    // If force show is on, stop the typing loop (handled by effect above)
    if (forceShow) return;

    const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + dialogue.text[charIndex]);
        setCharIndex((prev) => prev + 1);
        
        // Play typing sound sparingly
        if (charIndex % 3 === 0) {
            audioManager.playTypeSound();
        }

    }, 50); // Consistent typing speed
    return () => clearTimeout(timeout);
  }, [charIndex, dialogue, forceShow, onTypingComplete, displayedText]);

  if (!dialogue) return null;

  const isWhisper = dialogue.effect === 'whisper';
  const isTyping = charIndex < dialogue.text.length;

  return (
    <div className={`fixed bottom-0 left-0 w-full p-4 md:p-10 z-50 flex justify-center pointer-events-none ${isShaking ? 'shake-anim' : ''}`}>
      <div 
        className="pointer-events-auto relative w-full max-w-4xl bg-black/80 backdrop-blur-md border-y border-red-900/30 p-6 md:p-8 shadow-2xl text-gray-200 cursor-pointer group rounded-sm"
        onClick={onNext}
      >
        {/* Decorative thin lines */}
        <div className="absolute top-1 left-1 right-1 bottom-1 border border-white/5 pointer-events-none"></div>

        {/* Name Tag */}
        <div className="absolute -top-5 left-6 bg-gradient-to-r from-red-950 to-black px-6 py-1 border border-red-900/50 shadow-lg skew-x-[-12deg]">
          <span className="font-bold text-red-100 tracking-widest serif-font text-lg shadow-black drop-shadow-md skew-x-[12deg] inline-block">
            {dialogue.speaker}
          </span>
        </div>
        
        {/* Text Area */}
        <div className={`text-xl md:text-2xl leading-relaxed min-h-[4.5rem] serif-font tracking-wide mt-2 ${isWhisper ? 'italic text-gray-400' : 'text-gray-100'} drop-shadow-sm`}>
          {displayedText}
          <span className="animate-pulse text-red-500 font-bold ml-1 opacity-70">|</span>
        </div>

        {/* Next Indicator - Only visible when typing is done */}
        {!isTyping && (
            <div className="absolute bottom-4 right-4 flex items-center text-red-500/50 text-sm animate-pulse group-hover:text-red-400 transition-colors">
            {isEnd ? "結束 [ENTER]" : "繼續 [ENTER]"} <ChevronRight size={16} className="ml-1" />
            </div>
        )}
      </div>
    </div>
  );
};

export default DialogueBox;
