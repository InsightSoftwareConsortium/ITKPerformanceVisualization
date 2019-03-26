import React, { Component } from 'react';
import Button from '../../components/Button/Button';
import NavBar from '../../components/NavBar/NavBar';
import SideBar from "../../components/SideBar/SideBar";
import SingleScatterplot from "../../components/SingleScatterplot/SingleScatterplot.js";
import MultiBoxplot from "../../components/MultiBoxplot/MultiBoxplot";
import SingleBoxplot from "../../components/SingleBoxplot/SingleBoxplot";
import Dashboard from "../../components/Dashboard/Dashboard";
import HeatMap from "../../components/HeatMap/HeatMap"
import TabBar from "../../components/TabBar/TabBar";
import Checklist from "../../components/Checklist/Checklist"
import ApiInstance from "../../api/api_wrapper.js";
import { GridLoader } from 'react-spinners';
import '../../static/scss/App.css';
import GraphSelection from '../../components/GraphSelection/GraphSelection';

const Api = ApiInstance.instance;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      navbarItems: {
        right: [<Button color="blue">Upload Data</Button>,]
      },
      showSidebar:true,
      tabs: [],
      selectedTab: {},
      tabCounter: 1,
      data:null,
      loading: true,
      selection: [],
      vizType: "HeatMap"
    }

    this.setParentState = this.setParentState.bind(this);
    this.handleTabSelect = this.handleTabSelect.bind(this);
    this.handleTabAdd = this.handleTabAdd.bind(this);
    this.handleTabRemove = this.handleTabRemove.bind(this);
    this.handleTabNameChange = this.handleTabNameChange.bind(this);
    this.changeVizType = this.changeVizType.bind(this);
  }

  componentDidMount() {
    let _this = this;
    let onSuccess = function(response) {
      _this.setState({
        data: response,
        loading:false,
        tabs: [
          {
            name:"Default", 
            content: <Dashboard/>
          }
        ],
        selectedTab: "Default"
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
    this.state.tabs.push({name: tabName, content: <Dashboard/>})
    this.setState({
      tabs: this.state.tabs,
      tabCounter: this.state.tabCounter + 1,
    });
  }

  handleTabNameChange(previousName, newName) {
    let count = 0;
    for(let i = 0; i < this.state.tabs.length; i++) {
      if(newName === this.state.tabs[i].name) {
        count++;
      }
    }
    if(count === 0){
      let index = this.state.tabs.findIndex(tab => tab.name === previousName);
      let clone = this.state.tabs.slice(0);
      clone[index].name = newName;
      this.setState({
        tabs: clone,
        selectedTab: newName,
      });
    }
  }

  handleTabRemove(tabName) {
    let selectedTab = this.state.selectedTab;
    if(selectedTab.name === tabName) {
      selectedTab = this.state.tabs[this.state.tabs.findIndex(tab => tab.name === tabName)-1].name;
    }
    this.setState({
      tabs:this.state.tabs.filter(tab => tab.name !== tabName),
      selectedTab: selectedTab
    });
  }

  changeVizType(vizType){
    this.setState({vizType: vizType});
  }

  render() {
    return (
      <div className="app">
          <NavBar items={this.state.navbarItems}/>
            <SideBar setParentState = {this.setParentState} showSidebar = {this.state.showSidebar}>
              <div style={{marginTop: "4vh"}}>
                <GraphSelection vizType="HeatMap" changeVizType={this.changeVizType} selected={this.state.vizType === "HeatMap"}></GraphSelection>
                <GraphSelection vizType="SingleScatterplot" changeVizType={this.changeVizType} selected={this.state.vizType === "SingleScatterplot"}></GraphSelection>
              </div>
              <div>
                <GraphSelection vizType="MultiBoxplot" changeVizType={this.changeVizType} selected={this.state.vizType === "MultiBoxplot"}></GraphSelection>
                <GraphSelection vizType="SingleBoxplot" changeVizType={this.changeVizType} selected={this.state.vizType === "SingleBoxplot"}></GraphSelection>
              </div>
              {!this.state.loading ?
                <Checklist data={this.state.data} type="CommitHash" setParentState={this.setParentState} selection={this.state.selection}></Checklist>
                :
                null
              }
              </SideBar>
            <i onClick={()=>this.setState({showSidebar:true})} className={"sidebar-button-"+(this.state.showSidebar ? "hide":"show")+" sidebar-button--right fas fa-arrow-circle-right"}/>
          <div className={"app-content app-content--"+(this.state.showSidebar ? "sidebar" : "no-sidebar")}>
            {!this.state.loading && <TabBar handleTabNameChange={this.handleTabNameChange} selectedTab={this.state.selectedTab} tabCounter={this.state.tabCounter} tabs={this.state.tabs} handleTabRemove={this.handleTabRemove} handleTabSelect={this.handleTabSelect} handleTabAdd={this.handleTabAdd}/>}
            <div className="app-content-viz">
            {!this.state.loading ?
              <div>
                {
                (this.state.vizType === "HeatMap")?
                <HeatMap data={this.state.data} selected={this.state.selection} />
                :(this.state.vizType === "SingleScatterplot")?
                <SingleScatterplot data={this.state.data} selected={this.state.selection} />
                :(this.state.vizType === "MultiBoxplot")?
                <MultiBoxplot data={this.state.data} selected={this.state.selection} />
                :(this.state.vizType === "SingleBoxplot")?
                <SingleBoxplot data={this.state.data} selected={this.state.selection} />
                :<h>Invalid Graph Type</h>
                }
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
