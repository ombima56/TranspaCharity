import React from 'react';
import { Link } from 'react-router-dom';
import { Cause } from '@/data/causes';

type CauseCardProps = {
  cause: Cause;
};

const CauseCard = ({ cause }: CauseCardProps) => {
  // Calculate percentage raised
  const percentRaised = Math.min(Math.round((cause.raised / cause.goal) * 100), 100);
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm card-hover">
      <div className="h-48 overflow-hidden">
        <img 
          src={cause.image} 
          alt={cause.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      
      <div className="p-6">
        <div className="mb-2">
          <span className="text-xs font-medium bg-teal-50 text-teal-600 px-2 py-1 rounded-full">
            {cause.category}
          </span>
        </div>
        
        <h3 className="font-heading font-semibold text-xl mb-2 line-clamp-2">{cause.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{cause.description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">${cause.raised.toLocaleString()} raised</span>
            <span className="text-gray-500">${cause.goal.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full">
            <div 
              className="h-full bg-teal-500 rounded-full" 
              style={{ width: `${percentRaised}%` }}
            ></div>
          </div>
          <div className="text-right text-xs text-gray-500 mt-1">
            {percentRaised}% of goal
          </div>
        </div>
        
        <Link 
          to={`/cause/${cause.id}`}
          className="block text-center bg-teal-500 text-white rounded-md py-2 font-medium hover:bg-teal-600 transition-colors"
        >
          Donate Now
        </Link>
      </div>
    </div>
  );
};

export default CauseCard;
