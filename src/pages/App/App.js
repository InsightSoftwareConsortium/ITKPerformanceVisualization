import React, { Component } from 'react';
import Button from '../../components/Button/Button';
import NavBar from '../../components/NavBar/NavBar';
import SideBar from "../../components/SideBar/SideBar";
import SingleScatterplot from "../../components/SingleScatterplot/SingleScatterplot.js";
import MultiBoxplot from "../../components/MultiBoxplot/MultiBoxplot";
import SingleBoxplot from "../../components/SingleBoxplot/SingleBoxplot";
import HeatMap from "../../components/HeatMap/HeatMap"
import TabBar from "../../components/TabBar/TabBar";
import Checklist from "../../components/Checklist/Checklist"
import ApiInstance from "../../api/api_wrapper.js";
import { GridLoader, PacmanLoader } from 'react-spinners';
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
      tabs: [
        {
          name:"Default", 
          vizType:"HeatMap",
          selection: [],
        }
      ],
      selectedTab: "Default",
      tabCounter: 1,
      data:null,
      loading: true,
      selection: [],
    }

    this.setParentState = this.setParentState.bind(this);
    this.handleTabSelect = this.handleTabSelect.bind(this);
    this.handleTabAdd = this.handleTabAdd.bind(this);
    this.handleTabRemove = this.handleTabRemove.bind(this);
    this.handleTabNameChange = this.handleTabNameChange.bind(this);
    this.changeVizType = this.changeVizType.bind(this);
    this.changeTabFilters = this.changeTabFilters.bind(this);
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

  changeTabFilters(selection) {
    let index = this.state.tabs.findIndex(tab => tab.name === this.state.selectedTab);
    this.state.tabs[index].selection = selection;
    this.setState({tabs:this.state.tabs});
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
    this.state.tabs.push({name: tabName, vizType:"HeatMap", selection:[]})
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
    let index = this.state.tabs.findIndex(tab => tab.name === this.state.selectedTab);
    this.state.tabs[index].vizType = vizType;
    this.setState({tabs:this.state.tabs});
  }

  getTabByName(tabName) {
    return this.state.tabs[this.state.tabs.findIndex(tab => tab.name === tabName)];
  }

  render() {
    return (
      <div className="app">
          <NavBar items={this.state.navbarItems}/>
            <SideBar setParentState = {this.setParentState} showSidebar = {this.state.showSidebar}>
              {!this.state.loading ?
              <div>
                <div style={{marginTop: "4vh"}}>
                  <GraphSelection vizType="HeatMap" changeVizType={this.changeVizType} selected={this.getTabByName(this.state.selectedTab).vizType === "HeatMap"}></GraphSelection>
                  <GraphSelection vizType="SingleScatterplot" changeVizType={this.changeVizType} selected={this.getTabByName(this.state.selectedTab).vizType === "SingleScatterplot"}></GraphSelection>
                </div>
                <div>
                  <GraphSelection vizType="MultiBoxplot" changeVizType={this.changeVizType} selected={this.getTabByName(this.state.selectedTab).vizType === "MultiBoxplot"}></GraphSelection>
                  <GraphSelection vizType="SingleBoxplot" changeVizType={this.changeVizType} selected={this.getTabByName(this.state.selectedTab).vizType === "SingleBoxplot"}></GraphSelection>
                </div>
                <Checklist data={this.state.data} type="CommitHash" changeTabFilters={this.changeTabFilters} selection={this.getTabByName(this.state.selectedTab).selection}></Checklist>
              </div>
              :
              <div className="loader-wrapper">
                <PacmanLoader/>
              </div>
              }
            </SideBar>
            <i onClick={()=>this.setState({showSidebar:true})} className={"sidebar-button-"+(this.state.showSidebar ? "hide":"show")+" sidebar-button--right fas fa-arrow-circle-right"}/>
          <div className={"app-content app-content--"+(this.state.showSidebar ? "sidebar" : "no-sidebar")}>
            {!this.state.loading && <TabBar handleTabNameChange={this.handleTabNameChange} selectedTab={this.state.selectedTab} tabCounter={this.state.tabCounter} tabs={this.state.tabs} handleTabRemove={this.handleTabRemove} handleTabSelect={this.handleTabSelect} handleTabAdd={this.handleTabAdd}/>}
            <div className="app-content-viz">
            {!this.state.loading ?
              <div>
                {
                (this.getTabByName(this.state.selectedTab).vizType === "HeatMap")?
                <HeatMap data={this.state.data} selected={this.getTabByName(this.state.selectedTab).selection} />
                :(this.getTabByName(this.state.selectedTab).vizType === "SingleScatterplot")?
                <SingleScatterplot data={this.state.data} selected={this.getTabByName(this.state.selectedTab).selection} />
                :(this.getTabByName(this.state.selectedTab).vizType === "MultiBoxplot")?
                <MultiBoxplot data={this.state.data} selected={this.getTabByName(this.state.selectedTab).selection} />
                :(this.getTabByName(this.state.selectedTab).vizType === "SingleBoxplot")?
                <SingleBoxplot data={this.state.data} selected={this.getTabByName(this.state.selectedTab).selection} />
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
