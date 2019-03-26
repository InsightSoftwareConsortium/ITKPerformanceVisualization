import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "../../../src/static/scss/GraphSelection.css";

export default class GraphSelection extends Component {
  render() {
    return (
      <button className={this.props.vizType + 'Selection'} onClick={()=>this.props.changeVizType(this.props.vizType)}>
          {this.props.vizType}
      </button>
    )
  }
}

GraphSelection.propTypes = {
  vizType:  PropTypes.oneOf(['HeatMap','SingleScatterplot','MultiBoxplot','SingleBoxplot']),
  changeVizType: PropTypes.func
}