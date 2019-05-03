import React from 'react';
import SideBar from './SideBar';
import { render, cleanup } from 'react-testing-library'

afterEach(cleanup);

describe('Render SideBar', () => {
  it('renders correct SideBar component', () => {
    const SideBarComponent = render(<SideBar/>);
  });
});

