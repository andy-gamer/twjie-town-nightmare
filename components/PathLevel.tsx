import React from 'react';
import { FlowerFieldBackground, GiantLily } from './SceneElements';

const PathLevel: React.FC = () => {
  return (
    <div className="absolute inset-0">
        <FlowerFieldBackground />
        <GiantLily x={50} />
    </div>
  );
};

export default PathLevel;