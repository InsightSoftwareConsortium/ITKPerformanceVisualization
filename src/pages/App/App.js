import React, { Component } from 'react';
import LocalCommitAlert from '../../components/LocalCommitAlert/LocalCommitAlert';
import Alert from "react-bootstrap/Alert";
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
import FilterBox from '../../components/FilterBox/FilterBox';
import LineChart from '../../components/LineChart/LineChart';
// import { AST_ObjectKeyVal } from 'terser';

const Api = ApiInstance.instance;
const defaultTabConfig = {
  vizType:"HeatMap", 
  splitVariable:"OSName",
  xAxisVariable:"CommitDate", 
  yAxisVariable:"Value", 
  colorVariable:"",
  selectedBenchmark:"",
  filters:{}
}
const quickCompareTabConfig = {
  vizType:"BoxPlot", 
  splitVariable:"BenchmarkName", 
  xAxisVariable:"CommitHash", 
  yAxisVariable:"Value",
  colorVariable:"",
  selectedBenchmark:"", 
  filters:{}
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      navbarItems: {
        left: [<img src={itkvizlogo} alt="ITK Vizualization Tool" className="nav-logo"/>,],
        right: [<UploadDataButton addLocalData={this.addLocalData}><i className="fas fa-file-upload"/></UploadDataButton>, <Button onClick={this.showQuickCompare} color="yellow">Quick Compare &nbsp; <i className="fas fa-exchange-alt"/></Button>]
      },
      showSidebar: true,
      tabs: [],
      selectedTab: "",
      tabCounter: 1,
      data: null,
      filteredData: null,
      changed: true,
      loading: true,
      error: false,
      errorMessage: "",
      loadingMessage: "Fetching Data... 0 Folder(s)",
      quickComparePopup: false,
      quickCompareHash1: "",
      quickCompareHash2: "",
    }
    this.node = null;
    this.setParentState = this.setParentState.bind(this);
    this.handleTabSelect = this.handleTabSelect.bind(this);
    this.handleTabAdd = this.handleTabAdd.bind(this);
    this.handleTabRemove = this.handleTabRemove.bind(this);
    this.handleTabNameChange = this.handleTabNameChange.bind(this);
    this.changeTabData = this.changeTabData.bind(this);
    this.showQuickCompare = this.showQuickCompare.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.loadViz = this.loadViz.bind(this);
    this.getAttributeSelection = this.getAttributeSelection.bind(this);
    this.getAttributeValues = this.getAttributeValues.bind(this);
    this.getDataAttributes = this.getDataAttributes.bind(this);
    this.updateFilterSelection = this.updateFilterSelection.bind(this);
    this.updateAttributeSelection = this.updateAttributeSelection.bind(this);
    this.deleteFilterSelection = this.deleteFilterSelection.bind(this);
    this.filterExists = this.filterExists.bind(this);
    this.handleQuickCompareSubmit = this.handleQuickCompareSubmit.bind(this);
    this.flipAxes = this.flipAxes.bind(this);
    this.updateSelectedBenchmark = this.updateSelectedBenchmark.bind(this);

    this.handleTabAdd("Default");
  }

  componentDidMount() {
    this.handleTabAdd("Default");
    let _this = this;
    let onSuccess = function(folders) {
      let folderIds = [];
      /* Folder Selection here */
      folders = folders.slice(folders.length - 6, folders.length - 1);
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

  componentWillMount() {
    document.addEventListener('mousedown', this.handleOutsideClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutsideClick, false);
  }

  handleOutsideClick(event) {
    if(this.node !== null) 
      if(!this.node.contains(event.target)) 
        this.setState({
          quickComparePopup:false,
        })
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

  showQuickCompare = () => {
    this.setState({
      quickComparePopup: true,
    })
  }

  handleQuickCompareSubmit() {
    if((this.state.quickCompareHash1.length !== 7 && this.state.quickCompareHash1.length !== 14) || (this.state.quickCompareHash2.length !== 7 && this.state.quickCompareHash2.length !== 14)) {
      this.setState({
        error: true,
        errorMessage: "Please enter valid commit hashes to compare",
        quickComparePopup: false,
      })
    } else {
      this.handleTabAdd("Quick Compare "+ this.state.tabCounter, "quickCompare");
      this.setState({
        quickComparePopup:false,
      });
     }
  }

  changeTabData(property, data) {
    let index = this.state.tabs.findIndex(tab => tab.name === this.state.selectedTab);
    let clone = this.state.tabs.slice(0);
    clone[index][property] = data;
    this.setState({tabs:clone, changed: true});
  }

  setParentState(state) {
    this.setState(state);
  }

  handleTabSelect(tabName) { 
    this.setState({
      selectedTab:tabName,
      changed: true
    });
  }

  handleTabAdd(tabName, configType) {
    let clone = this.state.tabs.slice(0);
    let configObj = configType === "quickCompare" ? quickCompareTabConfig : defaultTabConfig;
    let configClone = JSON.parse(JSON.stringify(configObj));
    configClone['name'] = tabName;
    clone.push(configClone);
    this.setState({
      tabs: clone,
      tabCounter: this.state.tabCounter + 1,
      selectedTab: tabName,
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

  getCurrentTab() {
    return this.getTabByName(this.state.selectedTab);
  }

  flipAxes() {
    this.changeTabData("valuesOnYAxis", !this.getCurrentTab().valuesOnYAxis);
  }

  loadViz() {
    // this.setState({data: mySqlRemote.query("select * from myDataTable where {apply filters}")});
    this.setState({filteredData: this.filterData(), changed: false});
  }

  getDataAttributes(){
    // return mySqlRemote.query("select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = N'myDataTable'");
    return Object.keys(this.state.data[0]).sort();
  }

  getAttributeValues(attr){
    // return mySqlRemote.query("select distinct " + attr + " from myDataTable");
    return Object.keys(_.groupBy(this.state.data, value => value[attr])).sort();
  }

  getAttributeSelection(attr){
    return this.getCurrentTab().filters[attr];
  }

  updateAttributeSelection(oldAttr, attr, selection){
    this.deleteFilterSelection(oldAttr);
    this.updateFilterSelection(attr, selection);
  }

  updateFilterSelection(attr, selection){
    if (attr !== "")
      this.getCurrentTab().filters[attr] = selection;
    this.setState({changed: true});
  }

  deleteFilterSelection(attr){
    delete this.getCurrentTab().filters[attr];
    this.setState({changed: true});
  }

  filterExists(attr){
    return Object.keys(this.getCurrentTab().filters).includes(attr) && this.getCurrentTab().filters[attr] != null;
  }

  filterData(){
    let filteredData = this.state.data.slice(0);
    Object.keys(this.getCurrentTab().filters).forEach((filter) => {
      filteredData = filteredData.filter((elem) => this.getCurrentTab().filters[filter].includes(elem[filter].toString()));
    });
    if (this.getCurrentTab().xAxisVariable !== "BenchmarkName" && 
        this.getCurrentTab().splitVariable !== "BenchmarkName" && 
        !(this.getCurrentTab().vizType === "HeatMap" && this.getCurrentTab().yAxisVariable === "BenchmarkName") &&
        !(this.getCurrentTab().vizType !== "HeatMap" && this.getCurrentTab().colorVariable === "BenchmarkName"))
      filteredData = filteredData.filter((elem) => this.getCurrentTab().selectedBenchmark === elem["BenchmarkName"]);
    return filteredData;
  }

  updateSelectedBenchmark(event){
    this.changeTabData("selectedBenchmark", event.target.value);
  }

  render() {
    return (
      <div className="app">
          <NavBar items={this.state.navbarItems}/>
          {this.state.quickComparePopup &&
            <div className="quick-compare-popup" ref={node=>this.node=node}>
              <div className="quick-compare-input-wrapper">
                <i className="fas fa-info-circle quick-compare-info" title="Enter 7 character or full commit hash"></i>
                <input type="text" value={this.state.quickCompareHash1} onChange={(e)=>{this.setState({quickCompareHash1:e.target.value})}} placeholder="Commit Hash 1" className="quick-compare-input"/>
                <input type="text" value={this.state.quickCompareHash2} onChange={(e)=>{this.setState({quickCompareHash2:e.target.value})}} placeholder="Commit Hash 2" className="quick-compare-input"/>
              </div>
              <Button color="green" isDisabled={this.state.loading} className="quick-compare-button" onClick={this.handleQuickCompareSubmit}>Compare  <i className="fas fa-exchange-alt"/></Button>
            </div>
            }
            <SideBar setParentState = {this.setParentState} showSidebar = {this.state.showSidebar}>
              {!this.state.loading ?
              <div style={{marginTop: "4vh"}}>
                <h className="box-title">Graph Type</h>
                <div className="graph-selection-box">
                <table style={{marginLeft: "1vw"}}>
                  <tbody>
                    <tr>
                      <td>
                      <GraphSelection vizType="HeatMap" changeTabData={this.changeTabData} selected={this.getCurrentTab().vizType === "HeatMap"}></GraphSelection>
                      </td>
                      <td>
                      <GraphSelection vizType="ScatterPlot" changeTabData={this.changeTabData} selected={this.getCurrentTab().vizType === "ScatterPlot"}></GraphSelection>
                      </td>
                    </tr>
                    <tr>
                      <td>
                      <GraphSelection vizType="BoxPlot" changeTabData={this.changeTabData} selected={this.getCurrentTab().vizType === "BoxPlot"}></GraphSelection>
                      </td>
                      <td>
                      <GraphSelection vizType="LineChart" changeTabData={this.changeTabData} selected={this.getCurrentTab().vizType === "LineChart"}></GraphSelection>
                      </td>
                    </tr>
                  </tbody>
                </table>
                </div>
                <h className="box-title">Parameters</h>
                <div className="graph-selection-box">
                <div className="param-container">
                <h className="param-label">Split</h>
                <Dropdown options={[""].concat(this.getDataAttributes().filter((option) => !Object.keys(this.getCurrentTab().filters).includes(option) || option === this.getCurrentTab().splitVariable))} 
                          selection={this.getCurrentTab().splitVariable} 
                          getAttributeValues={this.getAttributeValues} 
                          getAttributeSelection={this.getAttributeSelection} 
                          updateAttributeSelection={(oldAttr, attr, selection) => {this.changeTabData("splitVariable", attr); this.updateAttributeSelection(oldAttr, attr, selection);}}
                          updateFilterSelection={this.updateFilterSelection}
                          filterExists={this.filterExists}
                ></Dropdown>
                </div>
                {(this.getCurrentTab().vizType !== "HeatMap")?
                <div className="param-container">
                <h className="param-label">Color</h>
                <Dropdown options={[""].concat(this.getDataAttributes().filter((option) => !Object.keys(this.getCurrentTab().filters).includes(option) || option === this.getCurrentTab().colorVariable))} 
                          selection={this.getCurrentTab().colorVariable} 
                          getAttributeValues={this.getAttributeValues} 
                          getAttributeSelection={this.getAttributeSelection} 
                          updateAttributeSelection={(oldAttr, attr, selection) => {this.changeTabData("colorVariable", attr); this.updateAttributeSelection(oldAttr, attr, selection);}}
                          updateFilterSelection={this.updateFilterSelection}
                          filterExists={this.filterExists}
                ></Dropdown>
                </div>
                :
                <div className="param-container">
                <h className="param-label">{this.getCurrentTab().valuesOnYAxis?"Y":"X"}-axis</h>
                <Dropdown options={this.getDataAttributes().filter((option) => !Object.keys(this.getCurrentTab().filters).includes(option) || option === this.getCurrentTab().yAxisVariable)} 
                          selection={this.getCurrentTab().yAxisVariable} 
                          getAttributeValues={this.getAttributeValues} 
                          getAttributeSelection={this.getAttributeSelection} 
                          updateAttributeSelection={(oldAttr, attr, selection) => {this.changeTabData("yAxisVariable", attr); this.updateAttributeSelection(oldAttr, attr, selection);}}
                          updateFilterSelection={this.updateFilterSelection}
                          filterExists={this.filterExists}
                ></Dropdown>
                </div>
                }
                <div className="param-container">
                <h className="param-label">{this.getCurrentTab().valuesOnYAxis?"X":"Y"}-axis</h>
                <Dropdown options={this.getDataAttributes().filter((option) => !Object.keys(this.getCurrentTab().filters).includes(option) || option === this.getCurrentTab().xAxisVariable)} 
                          selection={this.getCurrentTab().xAxisVariable} 
                          getAttributeValues={this.getAttributeValues} 
                          getAttributeSelection={this.getAttributeSelection} 
                          updateAttributeSelection={(oldAttr, attr, selection) => {this.changeTabData("xAxisVariable", attr); this.updateAttributeSelection(oldAttr, attr, selection);}}
                          updateFilterSelection={this.updateFilterSelection}
                          filterExists={this.filterExists}
                ></Dropdown>
                </div>
                {(this.getCurrentTab().xAxisVariable !== "BenchmarkName" && this.getCurrentTab().splitVariable !== "BenchmarkName" && this.getCurrentTab().extraVariable !== "BenchmarkName")?
                  <div className="param-container">
                  <h className="benchmark-param-label">Benchmark</h>
                  <select className="benchmark-selector" onChange={this.updateSelectedBenchmark}>
                    {this.getAttributeValues("BenchmarkName").map((item) => {
                      return <option key={item} value={item} selected={item === this.getCurrentTab().selectedBenchmark}>{item.split("Benchmark")[0]}</option>
                    })}
                  </select>
                  </div>
                  :
                  null
                }
                <Button className="flip-axes-button" color="blue" onClick={this.flipAxes}> Flip Axes </Button>
                </div>
                <h className="box-title">Filters</h>
                <div className="filter-selection-box">
                <FilterBox filters={this.getCurrentTab().filters}
                           options={this.getDataAttributes()}
                           exclude={[this.getCurrentTab().xAxisVariable, this.getCurrentTab().yAxisVariable, this.getCurrentTab().splitVariable, this.getCurrentTab().colorVariable]}
                           getAttributeValues={this.getAttributeValues} 
                           getAttributeSelection={this.getAttributeSelection} 
                           updateAttributeSelection={this.updateAttributeSelection}
                           updateFilterSelection={this.updateFilterSelection}
                           deleteFilterSelection={this.deleteFilterSelection}
                           filterExists={this.filterExists}
                 ></FilterBox>
                 </div>
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
              <Alert variant="error">
                <ul>{this.state.errorMessage}</ul>
              </Alert>   
            }
            {!this.state.loading ?
              !this.state.changed ? 
              <div>
                <div>
                  <LocalCommitAlert data={this.state.data}></LocalCommitAlert>
                </div>
                {
                (this.getCurrentTab().vizType === "HeatMap")?
                <HeatMap independentVar={this.getCurrentTab().xAxisVariable} 
                         data={this.state.filteredData} 
                         split={this.getCurrentTab().splitVariable}
                         valuesOnYAxis={this.getCurrentTab().valuesOnYAxis} />
                :(this.getCurrentTab().vizType === "ScatterPlot")?
                <ScatterPlot independentVar={this.getCurrentTab().xAxisVariable} 
                             data={this.state.filteredData} 
                             split={this.getCurrentTab().splitVariable}
                             selectedBenchmark={this.getCurrentTab().selectedBenchmark}
                             valuesOnYAxis={this.getCurrentTab().valuesOnYAxis} />
                :(this.getCurrentTab().vizType === "BoxPlot")?
                <BoxPlot independentVar={this.getCurrentTab().xAxisVariable} 
                         data={this.state.filteredData} 
                         split={this.getCurrentTab().splitVariable}
                         valuesOnYAxis={this.getCurrentTab().valuesOnYAxis}
                         selectedBenchmark={this.getCurrentTab().selectedBenchmark} />
                :(this.getCurrentTab().vizType === "LineChart")?
                <LineChart independentVar={this.getCurrentTab().xAxisVariable}
                           data={this.state.filteredData}
                           split={this.getCurrentTab().splitVariable}
                           selectedBenchmark={this.getCurrentTab().selectedBenchmark}
                           valuesOnYAxis={this.getCurrentTab().valuesOnYAxis}
                           color={this.getCurrentTab().colorVariable} />
                :<h>Invalid Graph Type</h>
                }
              </div>
              :
              <Button color="green" onClick={this.loadViz}>Reload Visualization</Button>
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
