
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Category } from "@/services/api";
import { cn } from "@/lib/utils";
import { fadeIn } from "@/utils/animations";

interface CategoryCardProps {
  category: Category;
  className?: string;
  index?: number;
}

const CategoryCard = ({ category, className, index = 0 }: CategoryCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Card 
      className={cn(
        "overflow-hidden card-hover border border-gray-200 transition-standard group",
        fadeIn({ 
          direction: 'up', 
          staggerChildren: true, 
          delayMultiplier: 0.1, 
          index 
        }),
        className
      )}
    >
      <Link to={`/categoria/${category.slug}`} className="block">
        <div className="relative h-36 w-full bg-ruway-light overflow-hidden">
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
          )}
          <img
            src={category.image}
            alt={category.name}
            className={cn(
              "w-full h-full object-cover transition-all duration-500 group-hover:scale-105",
              !isImageLoaded ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setIsImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        <CardContent className="p-4 flex items-center justify-between">
          <h3 className="font-medium text-ruway-secondary group-hover:text-ruway-primary transition-colors">
            {category.name}
          </h3>
          <ChevronRight className="h-4 w-4 text-ruway-gray group-hover:text-ruway-primary transform group-hover:translate-x-1 transition-all" />
        </CardContent>
      </Link>
    </Card>
  );
};

export default CategoryCard;
