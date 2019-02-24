import React, { Component } from 'react';
import Button from '../../components/Button';
import NavBar from '../../components/NavBar';
import SideBar from "../../components/SideBar";
import '../../static/scss/App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      navbarItems: {
        left: [],
        center: [],
        right: [<Button color="blue">Upload Data</Button>,]
      },
      showSidebar:true,
    }
  }

  render() {
    return (
      <div className="app">
          <NavBar items={this.state.navbarItems}/>
          {this.state.showSidebar &&
            <SideBar/>
          }
          <div className="app-content">
            
          </div>
      </div>
    );
  }
}

export default App;
