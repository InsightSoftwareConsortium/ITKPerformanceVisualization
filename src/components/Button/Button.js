import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "../../../src/static/scss/Button.css";

export default class Button extends Component {
  render() {
    return (
      <button className={this.props.color + "-button"} onClick={this.props.onClick}>
          {this.props.children}
      </button>
    )
  }

}

Button.propTypes = {
  color:  PropTypes.oneOf(['blue', 'red', 'green', 'yellow'])
}

