import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Button from "../Button/Button";
import "../../../src/static/scss/Checklist.css";

export default class Checklist extends Component {
  constructor(props){
    super(props);
    this.state = {
      selection: Object.keys(_.groupBy(this.props.data, value => value[this.props.type])).sort(),
      searchItems: Object.keys(_.groupBy(this.props.data, value => value[this.props.type])).sort()
    }
    
    this.props.changeTabData(this.props.name+"Selection", this.state.selection);
    this.checkBoxClicked = this.checkBoxClicked.bind(this);
    this.searchBoxChanged = this.searchBoxChanged.bind(this);
    this.checkAllClicked = this.checkAllClicked.bind(this);
    this.uncheckAllClicked = this.uncheckAllClicked.bind(this);
  }

  searchBoxChanged(event){
    this.setState({
      searchItems: Object.keys(_.groupBy(this.props.data, value => value[this.props.type])).sort().filter(item => event.target.value === "" || item.includes(event.target.value))
    });
  }

  checkBoxClicked(value){
    var index = this.state.selection.indexOf(value);
    if (index > -1)
      this.state.selection.splice(index, 1);
    else
      this.state.selection.push(value);
    this.setState({
      selection: this.state.selection
    })
    this.props.changeTabData(this.props.name+"Selection", this.state.selection);
  }

  checkAllClicked(value){
    for (var index in this.state.searchItems)
      if (!this.state.selection.includes(this.state.searchItems[index]))
        this.state.selection.push(this.state.searchItems[index])
    this.setState({
      selection: this.state.selection
    })
    this.props.changeTabData(this.props.name+"Selection", this.state.selection);
  }
  
  uncheckAllClicked(value){
    for (var index in this.state.searchItems)
      if (this.state.selection.includes(this.state.searchItems[index]))
        this.state.selection.splice(this.state.selection.indexOf(this.state.searchItems[index]), 1);
    this.setState({
      selection: this.state.selection
    })
    this.props.changeTabData(this.props.name+"Selection", this.state.selection);
  }

  render() {
    return (
      <div class='checklist-container'>
        <div id='filter-menu'>
          <input class='search-box' placeholder={"Search " + this.props.type} onChange={this.searchBoxChanged} type="text"/><i className="fas fa-search search-box-icon"/>
          <div className="check-buttons-wrapper">
            <Button color="blue" onClick={this.checkAllClicked}>Check All</Button>
            <Button color="red" onClick={this.uncheckAllClicked}>Uncheck All</Button>
          </div>
        </div>
        <div id='checklist-box'>
          {this.state.searchItems.map((item) => {
              return <div key={item} className="checklist-row"><input id={item} onChange={()=>this.checkBoxClicked(item)} type="checkbox" 
                        checked={this.state.selection.includes(item)}/><label for={item}>{item.substring(0,7)}</label></div>;
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