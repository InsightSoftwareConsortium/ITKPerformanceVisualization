import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tab from "./Tab";
import "../../static/scss/tabbar.css";

export default class TabBar extends Component {
  constructor(props) {
      super(props);
      this.addTab = this.addTab.bind(this);
  }

  addTab() {
    let tabName = "Tab "+(this.props.tabCounter);
    this.props.handleTabAdd(tabName);
  }

  render() {

    return (
      <div className="tabbar">
        {this.props.tabs.map((tab)=> {
            return <Tab name={tab} key={tab} handleTabRemove={this.props.handleTabRemove} handleTabSelect={this.props.handleTabSelect} selected={this.props.selectedTab === tab}/>
        })}
        <i className="fas fa-plus tabbar-plus" onClick={this.addTab}/>
      </div>
    )
  }
}

TabBar.propTypes = {
  handleTabAdd: PropTypes.func,
  handleTabRemove: PropTypes.func,
  handleTabSelect: PropTypes.func,
  selectedTab: PropTypes.string,
  tabCounter: PropTypes.number,
  tabs: PropTypes.array,
}