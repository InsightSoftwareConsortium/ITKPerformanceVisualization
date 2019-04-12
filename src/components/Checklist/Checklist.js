import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Button from "../Button/Button";
import "../../../src/static/scss/Checklist.css";

export default class Checklist extends Component {
  constructor(props){
    super(props);
    this.state = {
      selection: this.props.default,
      searchItems: this.props.options
    }
    
    this.checkBoxClicked = this.checkBoxClicked.bind(this);
    this.searchBoxChanged = this.searchBoxChanged.bind(this);
    this.checkAllClicked = this.checkAllClicked.bind(this);
    this.uncheckAllClicked = this.uncheckAllClicked.bind(this);
  }

  searchBoxChanged(event){
    this.setState({
      searchItems: this.props.options.filter(item => event.target.value === "" || item.toLowerCase().includes(event.target.value.toLowerCase()))
    });
  }

  checkBoxClicked(value){
    var index = this.state.selection.indexOf(value);
    if (index > -1)
      this.state.selection.splice(index, 1);
    else
      this.state.selection.push(value);
    this.updateSelection();
  }

  checkAllClicked(value){
    for (var index in this.state.searchItems)
      if (!this.state.selection.includes(this.state.searchItems[index]))
        this.state.selection.push(this.state.searchItems[index])
    this.updateSelection();
  }
  
  uncheckAllClicked(value){
    for (var index in this.state.searchItems)
      if (this.state.selection.includes(this.state.searchItems[index]))
        this.state.selection.splice(this.state.selection.indexOf(this.state.searchItems[index]), 1);
    this.updateSelection();
  }

  updateSelection() {
    this.setState({
      selection: this.state.selection
    })
    this.props.updateFilterSelection(this.props.name, this.state.selection);
  }

  render() {
    return (
      <div class='checklist-container'>
        <div id='filter-menu'>
          <input class='search-box' placeholder={"Search " + this.props.name} onChange={this.searchBoxChanged} type="text"/><i className="fas fa-search search-box-icon"/>
          <div className="check-buttons-wrapper">
            <h>{this.state.selection.length + " item" + ((this.state.selection.length === 1)?"":"s") + " selected"}</h>
            <Button color="blue" onClick={this.checkAllClicked}>Check All</Button>
            <Button color="red" onClick={this.uncheckAllClicked}>Uncheck All</Button>
          </div>
        </div>
        <div id='checklist-box'>
          {this.state.searchItems.map((item) => {
              return <div key={item} className="checklist-row"><input id={item} onChange={()=>this.checkBoxClicked(item)} type="checkbox" 
                        checked={this.state.selection.includes(item)}/><label for={item}>{item}</label></div>;
          })}
        </div>
      </div>
    )
  }
}

Checklist.propTypes = {
  name: PropTypes.string,
  options: PropTypes.array,
  default: PropTypes.array,
  updateFilterSelection: PropTypes.func
}