import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "../../../src/static/scss/Dropdown.css";
import Checklist from '../Checklist/Checklist';

export default class Dropdown extends Component {
    constructor(props){
      super(props);
      this.state = {
        filterOpen: false
      }

      if (!this.props.filterExists(this.props.selection))
        this.props.updateFilterSelection(this.props.selection, this.props.getAttributeValues(this.props.selection));
      this.selectionChanged = this.selectionChanged.bind(this);
      this.filterButtonClicked = this.filterButtonClicked.bind(this);
    }
  
  componentDidUpdate() {
    if (!this.props.filterExists(this.props.selection))
      this.props.updateFilterSelection(this.props.selection, this.props.getAttributeValues(this.props.selection));
  }
  
  selectionChanged(event){
    this.props.updateAttributeSelection(this.props.selection, event.target.value, this.props.getAttributeValues(event.target.value));
  }

  filterButtonClicked(){
    this.setState({
      filterOpen: !this.state.filterOpen
    })
  }
  
  render() {
    return (
      <div className='dropdown-container' style={this.props.style}>
        <select className='dropdown-box' value={this.props.selection} onChange={this.selectionChanged}>
          {this.props.options.map((item) => {
              return <option key={item} value={item}>{item}</option>
          })}
        </select>
        <button className='filter-button' onClick={this.filterButtonClicked}><i className="fas fa-sort-amount-down "></i></button>
        {this.state.filterOpen ?
          <Checklist name={this.props.selection} 
                     options={this.props.getAttributeValues(this.props.selection)} 
                     default={this.props.getAttributeSelection(this.props.selection)} 
                     updateFilterSelection={this.props.updateFilterSelection}
                     hideChecklist={() => {this.setState({filterOpen: false})}}
          ></Checklist>
          :null
        }
      </div>
    )
  }
}

Dropdown.propTypes = {
  selection: PropTypes.string,
  options: PropTypes.string,
  getAttributeValues: PropTypes.func,
  getAttributeSelection: PropTypes.func,
  updateAttributeSelection: PropTypes.func,
  updateFilterSelection: PropTypes.func,
  filterExists: PropTypes.func
}