import React from 'react';
import MultiBoxplot from './MultiBoxplot';
import mockData from '../visualizationTestData.json';
import { render, cleanup } from 'react-testing-library'

afterEach(cleanup)

describe('Render MultiBoxplot', () => {
  it('renders correct MultiBoxplot component', () => {
    const MultiBoxplotComponent = render(<MultiBoxplot data={mockData}/>);
  });
});
