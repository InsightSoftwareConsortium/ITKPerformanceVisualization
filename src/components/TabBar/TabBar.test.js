import React from 'react';
import TabBar from './TabBar';
import Dashboard from "../Dashboard/Dashboard";
import { render, cleanup } from 'react-testing-library';

afterEach(cleanup);


let tabs = [
  {
    name: "Default",
    content: <Dashboard/>
  }
];

let tabCounter = 0;

describe('Render TabBar', () => {
  
  it('renders correct TabBar component', () => {
    
    const TabBarComponent = render(<TabBar tabs={tabs} tabCounter={tabCounter}/>);
  });
});

