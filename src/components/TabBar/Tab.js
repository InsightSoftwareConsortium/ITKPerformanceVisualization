import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "../../static/scss/tabbar.css";

export default class Tab extends Component {
  render() {
    return (
      <div className={"tab tab--"+(this.props.selected ? "selected" : "unselected")} >
        <div onClick={()=>this.props.handleTabSelect(this.props.name)}>
          {this.props.name}
        </div>
          {this.props.name !== "Default" && 
              <i className="fas fa-times tab-exit" onClick={()=>this.props.handleTabRemove(this.props.name)}/>
          }
      </div>
    )
  }
}

Tab.propTypes = {
  handleTabSelect: PropTypes.func,
  handleTabRemove: PropTypes.func,
  name: PropTypes.string,
  selected: PropTypes.bool,
}