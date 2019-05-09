import React from 'react';
import HeatMap from './HeatMap';
import mockData from '../visualizationTestData.json';
import { render, cleanup } from 'react-testing-library';

afterEach(cleanup);


describe('Render Heatmap', () => {
  it('renders correct Heatmap component with given props', () => {
    const props = {
      data: mockData,
      independentVariable: 'CommitHash',
      dependentVariable: 'Value'
    };

    const vegaEmbedNode = render(<HeatMap {...props}/>);
    expect(vegaEmbedNode).toBeDefined();
  });

  it('renders correct component without specified props', () => {
    const vegaEmbedNode = render(<HeatMap/>);
    expect(vegaEmbedNode).toBeDefined();
  });
});
