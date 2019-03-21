import React from 'react';
import Tab from './Tab';
import { render, cleanup } from 'react-testing-library'

afterEach(cleanup)

describe('Render Tab', () => {
  it('renders correct Tab component', () => {
    const TabComponent = render(<Tab {...props}/>);
  });
});

