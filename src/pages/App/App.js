import React, { Component } from 'react';
import LocalCommitAlert from '../../components/LocalCommitAlert/LocalCommitAlert';
import UploadDataButton from '../../components/UploadDataButton/UploadDataButton';
import Button from "../../components/Button/Button";
import NavBar from '../../components/NavBar/NavBar';
import SideBar from "../../components/SideBar/SideBar";
import ScatterPlot from "../../components/ScatterPlot/ScatterPlot.js";
import BoxPlot from "../../components/BoxPlot/BoxPlot";
import HeatMap from "../../components/HeatMap/HeatMap";
import TabBar from "../../components/TabBar/TabBar";
import ApiInstance from "../../api/ApiWrapper/ApiWrapper.js";
import { GridLoader } from 'react-spinners';
import '../../static/scss/App.css';
import GraphSelection from '../../components/GraphSelection/GraphSelection';
import Dropdown from '../../components/Dropdown/Dropdown';
import itkvizlogo from "../../static/img/itkvizlogo.png";
import _ from 'lodash';

const Api = ApiInstance.instance;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      navbarItems: {
        left: [<img src={itkvizlogo} alt="ITK Vizualization Tool" className="nav-logo"/>,],
        right: [<UploadDataButton addLocalData={this.addLocalData}><i className="fas fa-file-upload"/></UploadDataButton>, <Button color="yellow">Quick Compare &nbsp; <i className="fas fa-exchange-alt"/></Button>]
      },
      showSidebar:true,
      tabs: [
        {
          name:"Default", 
          vizType:"ScatterPlot",
          split: "BenchmarkName",
          splitSelection: [],
          x_axis:"CommitHash",
          x_axisSelection: [],
          y_axis:"Value"
        }
      ],
      selectedTab: "Default",
      tabCounter: 1,
      data:null,
      loading: true,
      loadingMessage: "Fetching Data...0 Folder(s)",
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
    let onSuccess = function(folders) {
      let folderIds = [];
      /* Folder Selection here */
      folders = folders.slice(folders.length - 5, folders.length - 1);
      for (let folder in folders) {
        folderIds.push(folders[folder]["_id"]);
      }
      _this.collectData(folderIds);
    }
    let onFailure = function(response) {
      _this.setState({
        error: true,
        errorMessage: response
      })
    }
    Api.getFoldersFromParent(null, onSuccess, onFailure);
  }

  collectData(folderIds) {
    let _this = this;
    let onSuccess = function(response) {
      _this.changeTabData("x_axisSelection", Object.keys(_.groupBy(response, value => value["CommitHash"])).sort());
      _this.setState({
        data: response,
        loading: false,
      });
    }
    let onFailure = function(response) {
      _this.setState({
        error: true,
        errorMessage: response,
        data: null,
        loading: false
      });
    }
    let updateLoader = function(message) {
      _this.setState({
          loadingMessage: message
      });
    }

    Api.getBenchmarkDataFromMultipleFolders(folderIds, onSuccess, onFailure, updateLoader);
  }

  addLocalData = (localData) => {
    let current = this.state.data.concat(localData);
    this.setState({
      data: current
    })
    console.log(this.state.data);
    console.log("Local Data Added");
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
    this.state.tabs.push({name: tabName, vizType:"HeatMap", splitSelection:[], x_axisSelection:[], x_axis:"CommitHash", y_axis:"Value"})
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
                  <tbody>
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
                  </tbody>
                </table>
                <Dropdown name="split" default={this.getTabByName(this.state.selectedTab).split} data={this.state.data} changeTabData={this.changeTabData}></Dropdown>
                <Dropdown name="x_axis" default={this.getTabByName(this.state.selectedTab).x_axis} data={this.state.data} changeTabData={this.changeTabData}></Dropdown>
                </div>
              :
              <div className="loader-wrapper">
                <GridLoader/>
              </div>
              }
            </SideBar>
            <i onClick={()=>this.setState({showSidebar:true})} className={"sidebar-button-"+(this.state.showSidebar ? "hide":"show")+" sidebar-button--right fas fa-arrow-circle-right"}/>
          <div className={"app-content app-content--"+(this.state.showSidebar ? "sidebar" : "no-sidebar")}>
            {!this.state.loading && <TabBar handleTabNameChange={this.handleTabNameChange} selectedTab={this.state.selectedTab} tabCounter={this.state.tabCounter} tabs={this.state.tabs} handleTabRemove={this.handleTabRemove} handleTabSelect={this.handleTabSelect} handleTabAdd={this.handleTabAdd}/>}
            <div className="app-content-viz">
            {this.state.error &&
              <div>
                Error: {this.state.errorMessage}
              </div>
            }
            {!this.state.loading ?
              <div>
                <div>
                  <LocalCommitAlert data={this.state.data}></LocalCommitAlert>
                </div>
                {
                (this.getTabByName(this.state.selectedTab).vizType === "HeatMap")?
                <HeatMap independentVar={this.getTabByName(this.state.selectedTab).x_axis} data={this.state.data} selected={this.getTabByName(this.state.selectedTab).x_axisSelection} split={this.getTabByName(this.state.selectedTab).split} />
                :(this.getTabByName(this.state.selectedTab).vizType === "ScatterPlot")?
                <ScatterPlot independentVar={this.getTabByName(this.state.selectedTab).x_axis} data={this.state.data} selected={this.getTabByName(this.state.selectedTab).x_axisSelection} split={this.getTabByName(this.state.selectedTab).split} />
                :(this.getTabByName(this.state.selectedTab).vizType === "BoxPlot")?
                <BoxPlot independentVar={this.getTabByName(this.state.selectedTab).x_axis} data={this.state.data} selected={this.getTabByName(this.state.selectedTab).x_axisSelection} split={this.getTabByName(this.state.selectedTab).split} />
                :<h>Invalid Graph Type</h>
                }
              </div>
              :
              <div style={{width: "100%"}}>
                <div className="loader-wrapper">
                  <GridLoader/>
                </div>
                <div className="loader-text">
                  {this.state.loadingMessage}
                </div>
              </div>
             }
             </div>
          </div>

      </div>
    );
  }
}

export default App;
