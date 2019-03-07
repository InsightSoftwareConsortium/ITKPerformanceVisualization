import React from 'react';
import SingleScatterplot from './SingleScatterplot';
import mockData from '../visualizationTestData.json';
import { render, cleanup } from 'react-testing-library'
import { expressionFunction } from 'vega';

afterEach(cleanup)

describe('Render SingleScatterplot', () => {
  it('renders correct SingleScatterplot component with given props', () => {
    const props = {
      data: mockData,
      independentVariable: "CommitHash",
      dependentVariable: "Value"
    }

    const SingleScatterplotComponent = render(<SingleScatterplot {...props}/>);
    expect(SingleScatterplotComponent).toBeDefined();
  });

  it('renders SingleScatterplot component without any give props', () => {
    const SingleScatterplotComponent = render();
    expect(SingleScatterplotComponent).toBeDefined();
  });
});
