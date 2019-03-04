import React from 'react';
import HeatMap from './HeatMap';
import mockData from '../visualizationTestData.json';
import { render, cleanup } from 'react-testing-library'

afterEach(cleanup)

describe('Render Heatmap', () => {
  it('renders correct HeatMap component with specified components', () => {
    const props = {
      data: mockData,
      independentVariable: "CommitHash",
      dependentVariable: "Value"
    }
    const HeatMapComponent = render(<HeatMap {...props}/>);
    
    const independentVariableNode =  getByText(props.independentVariable)

    expect(independentVariableNode).toBeDefined()
  });
});
