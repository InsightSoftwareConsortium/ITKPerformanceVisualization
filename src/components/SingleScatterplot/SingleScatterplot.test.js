import React from 'react';
import SingleScatterplot from './SingleScatterplot';
import mockData from '../visualizationTestData.json';
import { render, cleanup } from 'react-testing-library'

afterEach(cleanup)

describe('Render SingleScatterplot', () => {
  it('renders correct SingleScatterplot component', () => {
    const SingleScatterplotComponent = render(<SingleScatterplot data={mockData}/>);
  });
});
