
import React from 'react';

const PlannerHeader = () => {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <img 
          src="/lovable-uploads/73e4c415-eb5f-48db-a438-94ea38c84838.png" 
          alt="Flex Logo" 
          className="h-10 w-auto"
        />
        <h1 className="text-3xl font-bold text-flex-text bg-clip-text text-transparent bg-flex-gradient">
          AI Personalized Planner
        </h1>
      </div>
      <p className="text-muted-foreground font-medium">
        Let our AI create a customized schedule based on your preferences
      </p>
    </div>
  );
};

export default PlannerHeader;
