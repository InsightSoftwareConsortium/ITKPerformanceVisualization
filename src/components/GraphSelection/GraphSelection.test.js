import React from 'react';
import GraphSelection from './GraphSelection';
import { render, cleanup } from 'react-testing-library'

afterEach(cleanup)

function changeVizType() {}

describe('Render GraphSelection component', () => {
  it('renders correct GraphSelection component', () => {
    const GraphSelectionComponent = render(<GraphSelection changeVizType={changeVizType} vizType={'HeatMap'}/>);
  });
});

