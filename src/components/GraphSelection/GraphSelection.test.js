import React from 'react';
import GraphSelection from './GraphSelection';
import { render, cleanup } from 'react-testing-library'

afterEach(cleanup)

describe('Render GraphSelection component', () => {
  it('renders correct GraphSelection component', () => {
    const GraphSelectionComponent = render(<GraphSelection/>);
  });
});

