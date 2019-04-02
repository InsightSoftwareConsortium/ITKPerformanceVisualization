import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import "../../../src/static/scss/Dropdown.css";

export default class Dropdown extends Component {
    constructor(){
      super();
      this.selectionChanged = this.selectionChanged.bind(this);
    }
  
  selectionChanged(event){
    this.props.changeTabData(this.props.name, event.target.value);
    if (this.props.name === "x_axis")
      this.props.changeTabData("selection", Object.keys(_.groupBy(this.props.data, value => value[event.target.value])).sort());
  }
  
  render() {
    return (
      <div id='dropdown-container'>
        <h id='dropdown-label'>{this.props.name}</h>
        <select id='dropdown-box' onChange={this.selectionChanged}>
          {Object.keys(this.props.data[0]).map((item) => {
              return <option value={item} selected={item === this.props.default}>{item}</option>
          })}
        </select>
      </div>
    )
  }
}

Dropdown.propTypes = {
  default: PropTypes.string,
  name: PropTypes.string,
  data: PropTypes.any,
  changeTabData: PropTypes.func
}