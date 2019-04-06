import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import "../../../src/static/scss/Dropdown.css";
import Checklist from '../Checklist/Checklist';

export default class Dropdown extends Component {
    constructor(props){
      super(props);
      this.selectionChanged = this.selectionChanged.bind(this);
      this.filterButtonClicked = this.filterButtonClicked.bind(this);
      this.filterOpen = false;
      this.selection = this.props.default;
    }
  
  selectionChanged(event){
    this.props.changeTabData(this.props.name, event.target.value);
    this.selection = event.target.value;
  }

  filterButtonClicked(event){
    this.filterOpen = !this.filterOpen;
    this.forceUpdate();
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
        <button id='filter-button' onClick={this.filterButtonClicked}>Filter</button>
        {this.filterOpen ?
          <Checklist type={this.selection} data={this.props.data} changeTabData={this.props.changeTabData}></Checklist>
          :null
        }
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