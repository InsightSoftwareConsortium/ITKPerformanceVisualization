import React from 'react';
import ScatterPlot from './ScatterPlot';
import mockData from '../visualizationTestData.json';
import { render, cleanup } from 'react-testing-library'
import { expressionFunction } from 'vega';

afterEach(cleanup)

describe('Render ScatterPlot', () => {
  it('renders correct ScatterPlot component with given props', () => {
    const props = {
      data: mockData,
      independentVariable: "CommitHash",
      dependentVariable: "Value"
    }

    const ScatterPlotComponent = render(<ScatterPlot {...props}/>);
    expect(ScatterPlotComponent).toBeDefined();
  });

  it('renders ScatterPlot component without any give props', () => {
    const ScatterPlotComponent = render();
    expect(ScatterPlotComponent).toBeDefined();
  });
});
