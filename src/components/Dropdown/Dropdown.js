import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "../../../src/static/scss/Dropdown.css";
import Checklist from '../Checklist/Checklist';

export default class Dropdown extends Component {
    constructor(props){
      super(props);
      this.state = {
        filterOpen: false,
        selection: this.props.default
      }
      this.selectionChanged = this.selectionChanged.bind(this);
      this.filterButtonClicked = this.filterButtonClicked.bind(this);
    }
  
  selectionChanged(event){
    this.props.changeTabData(this.props.name, event.target.value);
    this.setState({
      selection: event.target.value
    })
  }

  filterButtonClicked(event){
    this.setState({
      filterOpen: !this.state.filterOpen
    })
  }
  
  render() {
    return (
      <div className='dropdown-container'>
        <div className='dropdown-label'>{this.props.name}</div>
        <select className='dropdown-box' onChange={this.selectionChanged}>
          {Object.keys(this.props.data[0]).map((item) => {
              return <option value={item} selected={item === this.props.default}>{item}</option>
          })}
        </select>
        <button className='filter-button' onClick={this.filterButtonClicked}><i className="fas fa-sort-amount-down "></i></button>
        {this.state.filterOpen ?
          <Checklist type={this.state.selection} data={this.props.data} changeTabData={this.props.changeTabData}></Checklist>
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