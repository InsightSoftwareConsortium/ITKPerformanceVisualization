import React from 'react';
import SingleBoxplot from './SingleBoxplot';
import mockData from '../visualizationTestData.json';
import { render, cleanup } from 'react-testing-library'

afterEach(cleanup)

describe('Render SingleBoxplot', () => {
  it('renders correct SingleBoxplot component', () => {
    const SingleBoxplotComponent = render(<SingleBoxplot data={mockData}/>);
  });
});
