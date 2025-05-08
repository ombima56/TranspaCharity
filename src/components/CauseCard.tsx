import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Progress } from "./ui/progress";
import { Heart } from "lucide-react";

export interface CauseProps {
  id: number;
  title: string;
  organization: string;
  description: string;
  image_url: string;
  raised_amount: number;
  goal_amount: number;
  category: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

const CauseCard = ({ cause }: { cause: CauseProps }) => {
  const progress = (cause.raised_amount / cause.goal_amount) * 100;

  return (
    <Link to={`/cause/${cause.id}`}>
      <Card className="overflow-hidden card-hover">
        <div className="relative">
          <img
            src={cause.image_url}
            alt={cause.title}
            className="w-full h-48 object-cover"
          />
          {cause.featured && (
            <div className="absolute top-3 left-3 bg-coral-400 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Heart size={12} />
              <span>Featured</span>
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white/90 text-gray-700 text-xs px-2 py-1 rounded-full">
            {cause.category}
          </div>
        </div>

        <CardContent className="pt-4 pb-2">
          <h3 className="font-heading font-semibold text-lg line-clamp-1">
            {cause.title}
          </h3>
          <p className="text-sm text-gray-500 mb-2">by {cause.organization}</p>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {cause.description}
          </p>

          <Progress value={progress} className="h-2 bg-gray-100" />

          <div className="flex justify-between mt-2 text-sm">
            <span className="font-medium">
              ${cause.raised_amount.toLocaleString()} raised
            </span>
            <span className="text-gray-500">
              ${cause.goal_amount.toLocaleString()} goal
            </span>
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50 pt-3">
          <button className="w-full text-center text-teal-600 font-medium text-sm py-1 hover:text-teal-700 transition-colors">
            Donate Now
          </button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CauseCard;
