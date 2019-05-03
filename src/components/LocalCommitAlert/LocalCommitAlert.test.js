import React from 'react';
import LocalCommitAlert from './LocalCommitAlert';
import mockData from '../visualizationTestData.json';
import { render, cleanup } from 'react-testing-library'

afterEach(cleanup);


describe('Render LocalCommitAlert', () => {
  it('renders correct LocalCommitAlert component with given props', () => {
    const props = {
      data: mockData,
    };
    const LocalCommitAlertComponent = render(<LocalCommitAlert {...props}/>);
    expect(LocalCommitAlertComponent).toBeDefined();
  });
});
