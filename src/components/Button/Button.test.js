import React from 'react';
import Button from './Button';
import { render, cleanup } from 'react-testing-library';

afterEach(cleanup);

describe('Render Button', () => {
  it('renders correct Button component', () => {
    const ButtonComponent = render(<Button color={'red'}/>);
  });
});

