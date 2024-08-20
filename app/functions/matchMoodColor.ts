import { moodMapping } from "../lib/moodMap";
import { DEFAULT_BACKGROUND } from "../lib/utils";

export interface MoodMapping {
    [key: string]: {
      words: string[];
      color: string;
    };
  }
  
  export interface MoodMatchResult {
    matched: boolean;
    gradientFound: string;
    moodFound: string;
    colorFound: string;
  }
  
  export const matchMoodColor = (prompt: string): MoodMatchResult => {
    const lowercasedPrompt = prompt.toLowerCase();
    let matched = false;
    let moodFound = '';
    let gradientFound = DEFAULT_BACKGROUND;
    let colorFound = '';

    for (const [mood, { words, color, gradient }] of Object.entries(moodMapping)) {
      if (words.some((word) => lowercasedPrompt.includes(word.toLowerCase()))) {
        matched = true;
        moodFound = mood;   
        gradientFound = gradient;    
        colorFound = color;    
        break;
      }
    }

    if (!matched) {
        console.log('No matching mood category found.')
      }
      return { matched, gradientFound, moodFound, colorFound };
  };
  