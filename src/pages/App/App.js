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

    this.setParentState = this.setParentState.bind(this);
  }

  setParentState(state) {
    this.setState(state);
  }

  render() {
    return (
      <div className="app">
          <NavBar items={this.state.navbarItems}/>
            <SideBar setParentState = {this.setParentState} showSidebar = {this.state.showSidebar}/>
            <i onClick={()=>this.setState({showSidebar:true})} className={"sidebar-button-"+(this.state.showSidebar ? "hide":"show")+" sidebar-button--right fas fa-arrow-circle-right"}/>
          <div className={"app-content app-content--"+(this.state.showSidebar ? "sidebar" : "no-sidebar")}>
            <Button color="red">test</Button>
          </div>
      </div>
    );
  }
}

export default App;
