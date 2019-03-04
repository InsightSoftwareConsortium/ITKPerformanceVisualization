import React from 'react';
import SingleBoxplot from './SingleBoxplot';
import mockData from '../visualizationTestData.json';
import { render, cleanup } from 'react-testing-library'
import { expressionFunction } from 'vega';

afterEach(cleanup)

describe('Render SingleBoxplot', () => {
  it('renders correct SingleBoxplot component with given props', () => {
    const props = {
      data: mockData,
      independentVariable: "CommitHash",
      dependentVariable: "Value"
    }

    const SingleBoxplotComponent = render(<SingleBoxplot data={mockData}/>);
    expect(SingleBoxplotComponent).toBeDefined();
  });

  it('renders correct SingleBoxplot component without any given props', () => {
    const SingleBoxplotComponent = render(<SingleBoxplot/>);
    expect(SingleBoxplotComponent).toBeDefined();
  });
});
