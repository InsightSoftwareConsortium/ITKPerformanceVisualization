import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import "../../../src/static/scss/Checklist.css";

export default class Checklist extends Component {
  constructor(props){
    super(props);

    this.selection = [];
    Object.keys(_.groupBy(this.props.data, value => value[this.props.type])).sort().forEach((item) => {
      this.selection.push(item);
    });
    
    this.props.changeTabData("selection", this.selection);
    this.searchItems = Object.keys(_.groupBy(this.props.data, value => value[this.props.type])).sort();

    this.checkBoxClicked = this.checkBoxClicked.bind(this);
    this.searchBoxChanged = this.searchBoxChanged.bind(this);
    this.checkAllClicked = this.checkAllClicked.bind(this);
    this.uncheckAllClicked = this.uncheckAllClicked.bind(this);
  }

  searchBoxChanged(event){
    this.searchItems = Object.keys(_.groupBy(this.props.data, value => value[this.props.type])).sort().filter(item => event.target.value === "" || item.includes(event.target.value));
    this.forceUpdate();
  }

  checkBoxClicked(value){
    var index = this.selection.indexOf(value);
    if (index > -1)
      this.selection.splice(index, 1);
    else
      this.selection.push(value);
    this.props.changeTabData("selection", this.selection);
  }

  checkAllClicked(value){
    for (var index in this.searchItems)
      if (!this.selection.includes(this.searchItems[index]))
        this.selection.push(this.searchItems[index])
    this.props.changeTabData("selection", this.selection);
  }
  
  uncheckAllClicked(value){
    for (var index in this.searchItems)
      if (this.selection.includes(this.searchItems[index]))
        this.selection.splice(this.selection.indexOf(this.searchItems[index]), 1);
    this.props.changeTabData("selection", this.selection);
  }

  render() {
    return (
      <div id='checklist-container'>
        <h id='checklist-label'>{this.props.type}</h>
        <div id='filter-menu'>
          <input id='search-box' onChange={this.searchBoxChanged} type="text"/>
          <button id='check-all-button' onClick={this.checkAllClicked}>Check All</button>
          <button id='uncheck-all-button' onClick={this.uncheckAllClicked}>Uncheck All</button>
        </div>
        <div id='checklist-box'>
          {this.searchItems.map((item) => {
              return <li key={item}><input id={item} onChange={()=>this.checkBoxClicked(item)} type="checkbox" 
                        checked={this.selection.includes(item)}/><label for={item}>{item.substring(0,7)}</label></li>;
          })}
        </div>
      </div>
    )
  }
}

Checklist.propTypes = {
  type: PropTypes.string,
  data: PropTypes.any,
  changeTabData: PropTypes.func
}