import React, { Component } from 'react';
import PropTypes from 'prop-types';
import heatmapsample from "../../static/img/heatmapsample.png";
import boxplotsample from "../../static/img/boxplotsample.png";
import scatterplotsample from "../../static/img/scatterplotsample.png";
import linechartsample from "../../static/img/linechartsample.png";
import "../../static/scss/GraphSelection.css";

export default class GraphSelection extends Component {
  render() {
    let image = "";
    if(this.props.vizType === "HeatMap")
      image = heatmapsample;
    else if(this.props.vizType === "BoxPlot")
      image = boxplotsample;
    else if(this.props.vizType === "ScatterPlot")
      image = scatterplotsample
    else if(this.props.vizType === "LineChart")
      image = linechartsample;
    else
      image = null;
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
  vizType:  PropTypes.oneOf(['HeatMap','ScatterPlot','BoxPlot','LineChart']),
  changeVizType: PropTypes.func
}