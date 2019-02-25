import React from 'react';
import HeatMap from './HeatMap';
import mockData from './heatmapTestingData.json';
import { render, cleanup } from 'react-testing-library'

afterEach(cleanup)

describe('Render Heatmap', () => {
  it('renders correct HeatMap component', () => {
    const HeatMapComponent = render(<HeatMap data={mockData}/>);
  });
});
