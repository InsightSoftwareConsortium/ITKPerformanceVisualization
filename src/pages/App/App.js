import React, { Component } from 'react';
import Button from '../../Components/Button';
import NavBar from '../../Components/NavBar';
import '../../static/scss/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <NavBar></NavBar>
          <div>
            <Button color="Green">Marc</Button>
            <Button color="Blue">Jake M</Button>
            <Button color="Red">Parker</Button>
            <Button color="Yellow">Jake S</Button>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
