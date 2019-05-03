import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../../../src/static/scss/NavBar.css';

export default class NavBar extends Component {
  render() {
    let items = this.props.items;
    if(typeof items === 'undefined') {
      items = {
        left: [],
        center: [],
        right: [],
      };
    }

    let left = typeof items.left !== 'undefined' ? items.left : [];
    let center = typeof items.center !== 'undefined' ? items.center : [];
    let right = typeof items.right !== 'undefined' ? items.right : [];

    return (
      <div className="navbar">
        {left.map((item,i)=> {
          return <div className="navitem navitem-left" key={i}>{item}</div>;
        })}
        {center.map((item ,i)=> {
          return <div className="navitem" key={i}>{item}</div>;
        })}
        {right.map((item,i)=> {
          return <div className="navitem navitem-right" key={i}>{item}</div>;
        })}
      </div>
    );
  }
}

NavBar.propTypes = {
  items: PropTypes.shape({
    left: PropTypes.array,
    right: PropTypes.array,
    center: PropTypes.array,
  })
};
