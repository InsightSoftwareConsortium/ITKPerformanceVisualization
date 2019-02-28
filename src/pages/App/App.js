import React, { Component } from 'react';
import Button from '../../components/Button/Button';
import NavBar from '../../components/NavBar/NavBar';
import SideBar from "../../components/SideBar/SideBar";
import SingleScatterplot from "../../components/SingleScatterplot/SingleScatterplot.js";
import ApiInstance from "../../api/api_wrapper.js";
import '../../static/scss/App.css';

const Api = ApiInstance.instance;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      navbarItems: {
        right: [<Button color="blue">Upload Data</Button>,]
      },
      showSidebar:true,
      data:null,
      loading: true,
    }

    this.setParentState = this.setParentState.bind(this);
  }

  componentDidMount() {
    let _this = this;
    let onSuccess = function(response) {
      _this.setState({
        data: response,
        loading:false,
      });
    }
    Api.getFolder("5afa58368d777f0685798c5b", onSuccess);
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
          {!this.state.loading && 
            <div className={"app-content app-content--"+(this.state.showSidebar ? "sidebar" : "no-sidebar")}>
              <SingleScatterplot data={this.state.data} selectedBenchmark=".51.05_"
                independentVar="CommitHash"/>
            </div>
          }
      </div>
    );
  }
}

export default App;
