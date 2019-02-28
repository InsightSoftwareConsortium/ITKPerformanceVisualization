import React from 'react';
import TabBar from './TabBar';
import { render, cleanup } from 'react-testing-library'

afterEach(cleanup)

describe('Render TabBar', () => {
  it('renders correct TabBar component', () => {
    const TabBarComponent = render(<TabBar/>);
  });
});

