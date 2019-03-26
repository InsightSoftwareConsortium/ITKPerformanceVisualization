import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import "../../../src/static/scss/Checklist.css";

export default class Checklist extends Component {
  constructor(){
    super();
    this.checkBoxClicked = this.checkBoxClicked.bind(this);
  }

  checkBoxClicked(value){
    var index = this.props.selection.indexOf(value);
    if (index > -1)
      this.props.selection.splice(index, 1);
    else
      this.props.selection.push(value);
  }
  
  render() {
    return (
      <div id='container'>
        <h id='label'>{this.props.type}</h>
        <div id='listbox'>
          {Object.keys(_.groupBy(this.props.data, value => value[this.props.type])).sort().map((item) => {
              return <li key={item}><input onChange={()=>this.checkBoxClicked(item)} type="checkbox" name={item} value={item}/><label>{item.slice(0,17) + '...'}</label></li>
          })}
        </div>
      </div>
    )
  }
}

Checklist.propTypes = {
  type: PropTypes.string,
  data: PropTypes.any,
  selection: PropTypes.array
}