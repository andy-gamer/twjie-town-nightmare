
import { useEffect, useRef, useCallback } from 'react';

export const useGameInput = (isActive: boolean) => {
  const keysPressed = useRef<Set<string>>(new Set());

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive) return;
    keysPressed.current.add(e.key);
  }, [isActive]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressed.current.delete(e.key);
  }, []);

  // Mobile/Touch Handlers
  const addKey = useCallback((key: string) => {
    keysPressed.current.add(key);
  }, []);

  const removeKey = useCallback((key: string) => {
    keysPressed.current.delete(key);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return { keysPressed, addKey, removeKey };
};
