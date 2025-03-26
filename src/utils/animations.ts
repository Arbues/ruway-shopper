
import { cn } from "@/lib/utils";

// Direction: 'up' | 'down' | 'left' | 'right'
type Direction = 'up' | 'down' | 'left' | 'right';
type StaggerChildren = boolean;
type DelayMultiplier = number;

interface AnimationProps {
  direction?: Direction;
  staggerChildren?: StaggerChildren;
  delayMultiplier?: DelayMultiplier;
  className?: string;
  index?: number;
  delay?: number; // Add the delay property
}

export const fadeIn = ({ 
  direction = 'up', 
  staggerChildren = false, 
  delayMultiplier = 0.1, 
  className = '', 
  index = 0,
  delay = 0 // Add default value
}: AnimationProps) => {
  const baseStyles = "opacity-0";
  const animationStyles = {
    'up': 'animate-slide-up',
    'down': 'animate-slide-down',
    'left': 'transform translate-x-[-20px] animate-fade-in',
    'right': 'transform translate-x-[20px] animate-fade-in',
  };

  // Use the delay parameter to calculate the total delay
  const delayValue = staggerChildren ? `delay-[${(index * delayMultiplier) + delay}s]` : delay > 0 ? `delay-[${delay}s]` : '';
  
  return cn(
    baseStyles,
    animationStyles[direction],
    delayValue,
    className
  );
};

export const staggerContainer = (staggerChildren: boolean = true, delayChildren: number = 0.1) => {
  return {
    staggerChildren,
    delayChildren
  };
};
