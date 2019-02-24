import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "../../src/static/scss/NavBar.css";

export default class NavBar extends Component {
  render() {
    return (
      <div className="navbar">
          {this.props.items.left.map((item,i)=> {
            return <div className="navitem navitem-left" key={i}>{item}</div>;
          })}
          {this.props.items.center.map((item ,i)=> {
            return <div className="navitem" key={i}>{item}</div>;
          })}
          {this.props.items.right.map((item,i)=> {
            return <div className="navitem navitem-right" key={i}>{item}</div>;
          })}
      </div>
    )
  }
}

NavBar.propTypes = {
  items: PropTypes.shape({
    left: PropTypes.array,
    right: PropTypes.array,
    center: PropTypes.array,
  })
}
