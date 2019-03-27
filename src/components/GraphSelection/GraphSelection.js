import React, { Component } from 'react';
import PropTypes from 'prop-types';
import heatmapsample from "../../static/img/heatmapsample.png";
import singleboxplotsample from "../../static/img/singleboxplotsample.png";
import multiboxplotsample from "../../static/img/multiboxplotsample.png";
import singlescatterplotsample from "../../static/img/singlescatterplotsample.png";
import "../../static/scss/GraphSelection.css";

export default class GraphSelection extends Component {
  render() {
    let image = "";
    if(this.props.vizType === "HeatMap")
      image = heatmapsample;
    else if(this.props.vizType === "SingleBoxplot")
      image = singleboxplotsample;
    else if(this.props.vizType === "MultiBoxplot")
      image = multiboxplotsample;
    else
      image = singlescatterplotsample
    return (
      <button className={this.props.vizType + 'Selection' + (this.props.selected ? " selected":"")} onClick={()=>this.props.changeTabData("vizType", this.props.vizType)}>
          {this.props.vizType}
          <img alt="" className="selection-image" src={image}/>
      </button>
    )
  }
}

GraphSelection.propTypes = {
  selected: PropTypes.bool,
  vizType:  PropTypes.oneOf(['HeatMap','SingleScatterplot','MultiBoxplot','SingleBoxplot']),
  changeVizType: PropTypes.func
}