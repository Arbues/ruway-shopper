
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
}

export const fadeIn = ({ 
  direction = 'up', 
  staggerChildren = false, 
  delayMultiplier = 0.1, 
  className = '', 
  index = 0 
}: AnimationProps) => {
  const baseStyles = "opacity-0";
  const animationStyles = {
    'up': 'animate-slide-up',
    'down': 'animate-slide-down',
    'left': 'transform translate-x-[-20px] animate-fade-in',
    'right': 'transform translate-x-[20px] animate-fade-in',
  };

  const delay = staggerChildren ? `delay-[${index * delayMultiplier}s]` : '';
  
  return cn(
    baseStyles,
    animationStyles[direction],
    delay,
    className
  );
};

export const staggerContainer = (staggerChildren: boolean = true, delayChildren: number = 0.1) => {
  return {
    staggerChildren,
    delayChildren
  };
};
