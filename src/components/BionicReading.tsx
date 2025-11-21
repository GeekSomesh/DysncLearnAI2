import { useEffect, useState, useRef } from 'react';
import { estimateWordTimings, getHighlightedWord, WordTiming } from '../services/wordTimingService';

interface BionicReadingProps {
  text: string;
  isPlaying: boolean;
  audioElement: HTMLAudioElement | null;
  className?: string;
}

/**
 * BionicReading component displays text with word-by-word highlighting synchronized to audio playback.
 * Uses text-vide-like styling with bold first letters and word highlighting on playback.
 */
export const BionicReading = ({
  text,
  isPlaying,
  audioElement,
  className = ''
}: BionicReadingProps) => {
  const [wordTimings, setWordTimings] = useState<WordTiming[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize word timings when audio metadata loads
  useEffect(() => {
    if (!audioElement || !isPlaying) return;

    const updateTimings = () => {
      if (audioElement.duration && !isNaN(audioElement.duration)) {
        const timings = estimateWordTimings(text, audioElement.duration * 1000);
        setWordTimings(timings);
      }
    };

    // Try to get duration immediately
    if (audioElement.duration && !isNaN(audioElement.duration)) {
      updateTimings();
    } else {
      // Wait for metadata to load
      audioElement.addEventListener('loadedmetadata', updateTimings);
      return () => audioElement.removeEventListener('loadedmetadata', updateTimings);
    }
  }, [audioElement, isPlaying, text]);

  // Sync current word highlight to audio playback
  useEffect(() => {
    if (!isPlaying || !audioElement || wordTimings.length === 0) {
      setCurrentWordIndex(-1);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const updateCurrentWord = () => {
      const currentTimeMs = audioElement.currentTime * 1000;
      const highlighted = getHighlightedWord(wordTimings, currentTimeMs);
      if (highlighted) {
        const idx = wordTimings.indexOf(highlighted);
        setCurrentWordIndex(idx);
      } else {
        setCurrentWordIndex(-1);
      }
      animationFrameRef.current = requestAnimationFrame(updateCurrentWord);
    };

    animationFrameRef.current = requestAnimationFrame(updateCurrentWord);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, audioElement, wordTimings]);

  // Split into tokens preserving whitespace so rendering matches original spacing/punctuation.
  const tokens = text.match(/\S+|\s+/g) || [];

  // (timing estimation uses whitespace-split words elsewhere) - render tokens below

  // Render tokens while mapping visible word tokens to the timingWords index.
  let visibleWordIndex = -1;

  const renderToken = (token: string, tokenIdx: number) => {
    // Preserve whitespace exactly
    if (/^\s+$/.test(token)) {
      return (
        <span key={`ws-${tokenIdx}`} className="whitespace-pre">
          {token}
        </span>
      );
    }

    // Try to extract core word (letters/numbers/apostrophes/hyphens) and surrounding punctuation
    const match = token.match(/^(\W*)([\p{L}\p{N}'’\-]+)(\W*)$/u);
    const leadingPunct = match ? match[1] : '';
    const core = match ? match[2] : token;
    const trailingPunct = match ? match[3] : '';

    // If core contains letters/numbers then it's counted as a timing word; otherwise (e.g., "—") skip counting
    const isCountedWord = /[\p{L}\p{N}]/u.test(core);
    if (isCountedWord) visibleWordIndex += 1;

    const isCurrent = visibleWordIndex === currentWordIndex;

    // Bionic lead length
    const coreLen = core.length;
    let highlightCount = 1;
    if (coreLen <= 2) highlightCount = 1;
    else if (coreLen <= 4) highlightCount = Math.ceil(coreLen * 0.5);
    else highlightCount = Math.ceil(coreLen * 0.4);

    const lead = core.slice(0, highlightCount);
    const rest = core.slice(highlightCount);

    return (
      <span key={`t-${tokenIdx}`} className={`bionic-word ${isCurrent ? 'bionic-active' : ''}`}>
        {leadingPunct}
        <span className="bionic-lead">
          <span className="font-bold">{lead}</span>
        </span>
        {rest}
        {trailingPunct}
      </span>
    );
  };

  return <div className={`bionic-reading ${className}`}>{tokens.map((t, i) => renderToken(t, i))}</div>;
};
