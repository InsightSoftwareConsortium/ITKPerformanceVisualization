import React from 'react';
import NavBar from './NavBar';
import { render, cleanup } from 'react-testing-library'

afterEach(cleanup)

describe('Render NavBar', () => {
  it('renders correct Navbar component', () => {
    const NavBarComponent = render(<NavBar/>);
  });
});

