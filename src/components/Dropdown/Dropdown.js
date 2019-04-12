import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "../../../src/static/scss/Dropdown.css";
import Checklist from '../Checklist/Checklist';
import _ from 'lodash';

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
    if(this.props.name === "x_axis") {
      this.props.changeTabData("x_axisSelection", Object.keys(_.groupBy(this.props.data, value => value[event.target.value])).sort());
    }
    this.setState({
      selection: event.target.value
    });
  }

  filterButtonClicked(){
    this.setState({
      filterOpen: !this.state.filterOpen
    })
  }
  
  render() {
    return (
      <div className='dropdown-container'>
        <div className='dropdown-label'>{this.props.name}</div>
        <select className='dropdown-box' onChange={this.selectionChanged} defaultValue={this.props.default}>
          {Object.keys(this.props.data[0]).map((item) => {
              return <option key={item} value={item}>{item}</option>
          })}
        </select>
        <button className='filter-button' onClick={this.filterButtonClicked}><i className="fas fa-sort-amount-down "></i></button>
        {this.state.filterOpen ?
          <Checklist name={this.props.name} type={this.state.selection} data={this.props.data} hideChecklist={()=>{this.setState({filterOpen:false})}} changeTabData={this.props.changeTabData}></Checklist>
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