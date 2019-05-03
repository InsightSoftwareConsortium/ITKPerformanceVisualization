import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "../../static/scss/tabbar.css";

export default class Tab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editName:false,
      value: this.props.name
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleValueChange(e) {
    this.setState({
      value: e.target.value
    });
  }

  handleNameChange() {
    this.props.changeName(this.props.name, this.state.value);
    this.setState({
      editName:false
    });
  }

  render() {
    return (
      <div className={"tab tab--"+(this.props.selected ? "selected" : "unselected")} >
        <div onClick={()=>this.props.handleTabSelect(this.props.name)} onDoubleClick={()=>this.setState({editName:true})} onBlur={this.handleNameChange}>
          {this.state.editName && this.props.name !== "Default" ? 
            <input className="tab-edit-name" type="text" onChange={(e)=>this.handleValueChange(e)} placeholder={this.props.name}/>
            :
            <div>{this.props.name.length > 10 ? (this.props.name.slice(0,7)+"...") : this.props.name}</div>
          }
        </div>
          {(this.props.name !== "Default" && !this.state.editName) && 
              <i className="fas fa-times tab-exit" onClick={()=>this.props.handleTabRemove(this.props.name)}/>
          }
      </div>
    )
  }
}
 
Tab.propTypes = {
  handleTabSelect: PropTypes.func,
  handleTabRemove: PropTypes.func,
  changeName: PropTypes.func,
  name: PropTypes.string,
  selected: PropTypes.bool,
};