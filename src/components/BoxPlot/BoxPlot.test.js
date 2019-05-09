import React from 'react';
import BoxPlot from './BoxPlot';
import mockData from '../visualizationTestData.json';
import { render, cleanup } from 'react-testing-library';

afterEach(cleanup);

describe('Render BoxPlot', () => {
  it('renders correct BoxPlot component with given props', () => {
    const props = {
      data: mockData,
      independentVariable: 'CommitHash',
      dependentVariable: 'Value'
    };

    const BoxPlotComponent = render(<BoxPlot {...props}/>);
    expect(BoxPlotComponent).toBeDefined();
  });

  it('renders correct BoxPlot component without any given props', () => {
    const BoxPlotComponent = render(<BoxPlot/>);
    expect(BoxPlotComponent).toBeDefined();
  });
});
