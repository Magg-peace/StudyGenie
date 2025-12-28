import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { EnhancedAICharacter, getCharacterForUser } from './EnhancedAICharacter';

interface RobotCharacterProps {
  mood: 'happy' | 'excited' | 'thinking' | 'celebrating' | 'encouraging' | 'magical';
  size: 'sm' | 'md' | 'lg' | 'xl';
  isAnimating?: boolean;
  isListening?: boolean;
  onInteract?: () => void;
  userProfile?: {
    name: string;
    age: number;
    gender?: 'boy' | 'girl';
    language?: string;
  };
}

export function RobotCharacter({
  mood,
  size,
  isAnimating = true,
  isListening = false,
  onInteract,
  userProfile
}: RobotCharacterProps) {
  const [characterGender, setCharacterGender] = useState<'boy' | 'girl'>('boy');

  useEffect(() => {
    if (userProfile) {
      const detectedGender = getCharacterForUser(userProfile.age, userProfile.gender);
      setCharacterGender(detectedGender);
    }
  }, [userProfile]);

  return (
    <EnhancedAICharacter
      gender={characterGender}
      mood={mood}
      size={size}
      isAnimating={isAnimating}
      isListening={isListening}
      onInteract={onInteract}
      userName={userProfile?.name}
      userAge={userProfile?.age}
      language={userProfile?.language || 'en'}
    />
  );
}