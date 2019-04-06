import React, { Component } from 'react';
import Button from '../../components/Button/Button';
import NavBar from '../../components/NavBar/NavBar';
import SideBar from "../../components/SideBar/SideBar";
import ScatterPlot from "../../components/ScatterPlot/ScatterPlot.js";
import BoxPlot from "../../components/BoxPlot/BoxPlot";
import HeatMap from "../../components/HeatMap/HeatMap";
import TabBar from "../../components/TabBar/TabBar";
import Checklist from "../../components/Checklist/Checklist"
import ApiInstance from "../../api/api_wrapper.js";
import { GridLoader, PacmanLoader } from 'react-spinners';
import '../../static/scss/App.css';
import GraphSelection from '../../components/GraphSelection/GraphSelection';
import Dropdown from '../../components/Dropdown/Dropdown';

const Api = ApiInstance.instance;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      navbarItems: {
        left: [<h style={{marginLeft: "3vh", fontSize: "4vh"}}>ITK Performance Visualization</h>,],
        right: [<Button color="blue">Upload Data</Button>,]
      },
      showSidebar:true,
      tabs: [
        {
          name:"Default", 
          vizType:"HeatMap",
          selection: [],
          split: null,
          x_axis:"CommitHash",
          y_axis:"Value"
        }
      ],
      selectedTab: "Default",
      tabCounter: 1,
      data:null,
      loading: true
    }

    this.setParentState = this.setParentState.bind(this);
    this.handleTabSelect = this.handleTabSelect.bind(this);
    this.handleTabAdd = this.handleTabAdd.bind(this);
    this.handleTabRemove = this.handleTabRemove.bind(this);
    this.handleTabNameChange = this.handleTabNameChange.bind(this);
    this.changeTabData = this.changeTabData.bind(this);
  }

  componentDidMount() {
    let _this = this;
    let onSuccess = function(response) {
      _this.setState({
        data: response,
        loading:false,
      });
    }
    let ids = ["5afa58368d777f0685798c5b", "5c7aed3a8d777f072b766625", "5c82f0cf8d777f072b8abef3", "5c7b52c88d777f072b76a33b","5c8d51d48d777f072badc387","5c8e711a8d777f072bb224bc"];
    Api.getFolders(ids, onSuccess);
  }

  changeTabData(property, data) {
    let index = this.state.tabs.findIndex(tab => tab.name === this.state.selectedTab);
    let clone = this.state.tabs.slice(0);
    clone[index][property] = data;
    this.setState({tabs:clone});
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
    this.state.tabs.push({name: tabName, vizType:"HeatMap", selection:[], x_axis:"CommitHash", y_axis:"Value"})
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
    if(selectedTab === tabName) {
      selectedTab = this.state.tabs[this.state.tabs.findIndex(tab => tab.name === tabName)-1].name;
    }
    this.setState({
      tabs:this.state.tabs.filter(tab => tab.name !== tabName),
      selectedTab: selectedTab
    });
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
              <div style={{marginTop: "4vh"}}>
                <table style={{marginTop:'4vh'}}>
                  <tr>
                    <td>
                    <GraphSelection vizType="HeatMap" changeTabData={this.changeTabData} selected={this.getTabByName(this.state.selectedTab).vizType === "HeatMap"}></GraphSelection>
                    </td>
                    <td>
                    <GraphSelection vizType="ScatterPlot" changeTabData={this.changeTabData} selected={this.getTabByName(this.state.selectedTab).vizType === "ScatterPlot"}></GraphSelection>
                    </td>
                  </tr>
                  <tr>
                    <td>
                    <GraphSelection vizType="BoxPlot" changeTabData={this.changeTabData} selected={this.getTabByName(this.state.selectedTab).vizType === "BoxPlot"}></GraphSelection>
                    </td>
                  </tr>
                </table>
                <Dropdown name="split" default={this.getTabByName(this.state.selectedTab).split} data={this.state.data} changeTabData={this.changeTabData}></Dropdown>
                <Dropdown name="x_axis" default={this.getTabByName(this.state.selectedTab).x_axis} data={this.state.data} changeTabData={this.changeTabData}></Dropdown>
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
                <HeatMap independentVar={this.getTabByName(this.state.selectedTab).x_axis} data={this.state.data} selected={this.getTabByName(this.state.selectedTab).selection} split={this.getTabByName(this.state.selectedTab).split} />
                :(this.getTabByName(this.state.selectedTab).vizType === "ScatterPlot")?
                <ScatterPlot independentVar={this.getTabByName(this.state.selectedTab).x_axis} data={this.state.data} selected={this.getTabByName(this.state.selectedTab).selection} split={this.getTabByName(this.state.selectedTab).split} />
                :(this.getTabByName(this.state.selectedTab).vizType === "BoxPlot")?
                <BoxPlot independentVar={this.getTabByName(this.state.selectedTab).x_axis} data={this.state.data} selected={this.getTabByName(this.state.selectedTab).selection} split={this.getTabByName(this.state.selectedTab).split} />
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
