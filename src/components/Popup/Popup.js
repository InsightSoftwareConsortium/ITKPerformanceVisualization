import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "../../../src/static/scss/Popup.css";

export default class Popup extends Component {

  
  render() {
    return (
      <div className={'popup-container popup-'+this.props.type } style={this.props.style}>
            {this.props.children}
	    <div className="popup-exit" onClick={this.props.hidePopup}>X</div>
      </div>
    )
  }
}

Popup.propTypes = {
  style: PropTypes.string,
  type: PropTypes.string
};
