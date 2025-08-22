import React from 'react';
import CodingMode from './CodingMode';

const TestCodingMode = () => {
  return (
    <div>
      <h1>Testing CodingMode Component</h1>
      <CodingMode onClose={() => console.log('CodingMode closed')} />
    </div>
  );
};

export default TestCodingMode; 