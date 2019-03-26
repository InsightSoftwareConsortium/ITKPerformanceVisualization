import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import "../../../src/static/scss/Checklist.css";

export default class Checklist extends Component {
  constructor(props){
    super(props);
    this.checkBoxClicked = this.checkBoxClicked.bind(this);
    Object.keys(_.groupBy(this.props.data, value => value[this.props.type])).sort().forEach((item) => {
      this.props.selection.push(item);
    });
    this.props.setParentState({selection: this.props.selection});
  }

  checkBoxClicked(value){
    var index = this.props.selection.indexOf(value);
    if (index > -1)
      this.props.selection.splice(index, 1);
    else
      this.props.selection.push(value);
    this.props.setParentState({selection: this.props.selection});
  }
  
  render() {
    return (
      <div id='container'>
        <h id='label'>{this.props.type}</h>
        <div id='listbox'>
          {Object.keys(_.groupBy(this.props.data, value => value[this.props.type])).sort().map((item) => {
              return <li key={item}><input id={item} onChange={()=>this.checkBoxClicked(item)} type="checkbox" 
                        checked={this.props.selection.indexOf(item) > -1}/><label for={item}>{item.slice(0,26)}</label></li>
          })}
        </div>
      </div>
    )
  }
}

Checklist.propTypes = {
  type: PropTypes.string,
  data: PropTypes.any,
  setParentState: PropTypes.func,
  selection: PropTypes.array
}