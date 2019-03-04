import React from 'react';
import MultiBoxplot from './MultiBoxplot';
import mockData from '../visualizationTestData.json';
import { render, cleanup } from 'react-testing-library'

afterEach(cleanup)

describe('Render MultiBoxplot', () => {
  it('renders correct MultiBoxplot component with given props', () => {
    const props = {
      data: mockData,
      independentVariable: "CommitHash",
      dependentVariable: "Value"
    }

    const MultiBoxplotComponent = render(<MultiBoxplot {...props}/>);
    expect(MultiBoxplotComponent).toBeDefined();
  });

  it('renders correct MultiBoxplot component without any given props', () => {
    const MultiBoxplotComponent = render(<MultiBoxplot/>);
    expect(MultiBoxplotComponent).toBeDefined();
  });
});
