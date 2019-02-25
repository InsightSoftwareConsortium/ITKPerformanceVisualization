import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../static/scss/SideBar.css';

export default class SideBar extends Component {
  render() {
    return (
      <div className={"sidebar sidebar-"+(this.props.showSidebar ? "show": "hide")}>
        <i onClick = {() => this.props.setParentState({showSidebar:false})} className="sidebar-button--left fas fa-arrow-circle-left"></i>
      </div>
    )
  }
}

SideBar.propTypes = {
  toggleSidebar: PropTypes.bool,
  setParentState: PropTypes.func,
}
