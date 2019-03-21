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
      tabs: [],
      selectedTab: {},
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


  render() {
    return (
      <div className="app">
          <NavBar items={this.state.navbarItems}/>
            <SideBar setParentState = {this.setParentState} showSidebar = {this.state.showSidebar}/>
            <i onClick={()=>this.setState({showSidebar:true})} className={"sidebar-button-"+(this.state.showSidebar ? "hide":"show")+" sidebar-button--right fas fa-arrow-circle-right"}/>
          <div className={"app-content app-content--"+(this.state.showSidebar ? "sidebar" : "no-sidebar")}>
            {!this.state.loading && <TabBar handleTabNameChange={this.handleTabNameChange} selectedTab={this.state.selectedTab} tabCounter={this.state.tabCounter} tabs={this.state.tabs} handleTabRemove={this.handleTabRemove} handleTabSelect={this.handleTabSelect} handleTabAdd={this.handleTabAdd}/>}
            <div className="app-content-viz">
            {!this.state.loading ?
              <div>
                <SingleScatterplot data={this.state.data}
                  independentVar="CommitHash"/>
                <SingleScatterplot data={this.state.data}
                  independentVar="ITKVersion"/>
                <MultiBoxplot selected={["d92873e33e8a54e933e445b92151191f02feab42", "edfefcf84611084ecd9c5c3f96e71972b7b7ae4f"]} independentVar="CommitHash" data={this.state.data}/>
                <MultiBoxplot independentVar="CommitHash" data={this.state.data}/>
                <SingleBoxplot data={this.state.data} selected={["4.13.0"]}
                  independentVar="ITKVersion"/>
                <SingleBoxplot data={this.state.data}
                  independentVar="ITKVersion"/>
                <HeatMap data={this.state.data} />
                <HeatMap data={this.state.data} selected={["d92873e33e8a54e933e445b92151191f02feab42", "edfefcf84611084ecd9c5c3f96e71972b7b7ae4f"]} />
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
