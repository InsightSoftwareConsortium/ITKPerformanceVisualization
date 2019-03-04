import React, { Component } from 'react';
import Button from '../../components/Button/Button';
import NavBar from '../../components/NavBar/NavBar';
import SideBar from "../../components/SideBar/SideBar";
import SingleScatterplot from "../../components/SingleScatterplot/SingleScatterplot.js";
import MultiBoxplot from "../../components/MultiBoxplot/MultiBoxplot";
import SingleBoxplot from "../../components/SingleBoxplot/SingleBoxplot";
import HeatMap from "../../components/HeatMap/HeatMap"
import TabBar from "../../components/TabBar/TabBar";
import ApiInstance from "../../api/api_wrapper.js";
import { GridLoader } from 'react-spinners';
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
      tabs:["Default"],
      selectedTab: "Default",
      tabCounter: 1,
      data:null,
      loading: true,
    }

    this.setParentState = this.setParentState.bind(this);
    this.handleTabSelect = this.handleTabSelect.bind(this);
    this.handleTabAdd = this.handleTabAdd.bind(this);
    this.handleTabRemove = this.handleTabRemove.bind(this);
    this.handleTabNameChange = this.handleTabNameChange.bind(this);
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

  handleTabSelect(tabName) { 
    this.setState({
      selectedTab:tabName
    });
  }

  handleTabAdd(tabName) {
    this.state.tabs.push(tabName)
    this.setState({
      tabs: this.state.tabs,
      tabCounter: this.state.tabCounter + 1,
    });
  }

  handleTabNameChange(previousName, newName) {
    let count = 0;
    for(let i = 0; i < this.state.tabs.length; i++) {
      if(newName === this.state.tabs[i]) {
        count++;
      }
    }
    if(count === 0){
      let index = this.state.tabs.indexOf(previousName);
      let clone = this.state.tabs.slice(0);
      clone[index] = newName;
      this.setState({
        tabs: clone,
        selectedTab: newName,
      });
    }
  }

  handleTabRemove(tabName) {
    let selectedTab = this.state.selectedTab;
    if(selectedTab === tabName) {
      selectedTab = this.state.tabs[this.state.tabs.indexOf(tabName)-1];
    }
    this.setState({
      tabs:this.state.tabs.filter(item => item !== tabName),
      selectedTab: selectedTab
    });
  }


  render() {
    return (
      <div className="app">
          <NavBar items={this.state.navbarItems}/>
            <SideBar setParentState = {this.setParentState} showSidebar = {this.state.showSidebar}/>
            <i onClick={()=>this.setState({showSidebar:true})} className={"sidebar-button-"+(this.state.showSidebar ? "hide":"show")+" sidebar-button--right fas fa-arrow-circle-right"}/>
          <div className={"app-content app-content--"+(this.state.showSidebar ? "sidebar" : "no-sidebar")}>
            <TabBar handleTabNameChange={this.handleTabNameChange} selectedTab={this.state.selectedTab} tabCounter={this.state.tabCounter} tabs={this.state.tabs} handleTabRemove={this.handleTabRemove} handleTabSelect={this.handleTabSelect} handleTabAdd={this.handleTabAdd}/>
            <div className="app-content-viz">
            {!this.state.loading ?
              <div>
                <SingleScatterplot data={this.state.data}
                  independentVar="CommitHash"/>
                <MultiBoxplot independentVar="CommitHash" data={this.state.data}/>
                <SingleBoxplot data={this.state.data}
                  independentVar="CommitHash"/>
                <HeatMap data={this.state.data} />
              </div>
              :
              <div className="loader-wrapper">
                <GridLoader/>
              </div>
             }
             </div>
          </div>

      </div>
    );
  }
}

export default App;
