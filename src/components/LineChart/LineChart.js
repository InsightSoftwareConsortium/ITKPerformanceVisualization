import React, { Component } from 'react';
import 'canvas';
import vegaEmbed from 'vega-embed';
import PropTypes from 'prop-types';

/**
 * Component for linechart visualization for all Benchmarks
 * Accepted props:
 *    --dependentVar: dependent variable for boxplot, such as value
 *    --independentVar: independent variable for plot, such as commitHash
 *    --selected: optional, can specify a subset of selected instances of the 
 *                independent variable to chart (i.e. array of commitHashes).
 *                If not specified, all instances will be used
 *    --split: specifies how to split charts based on a particular field 
 */
export default class LineChart extends Component {
  static defaultProps = {
    dependentVar: "Value",
    independentVar: "CommitHash",
    split: "",
    color: ""
  }
  
  //generates spec for vega-lite heatmap visualization
  _spec() {
    return {
        "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
        "data": {"values": this.props.data},
        "mark": {
          "type": "line",
          "point": true,
          "size": 50,
          "interpolate": "monotone"
        },
        "transform": [{
          "calculate": "''",
          "as": "dummy"
        }],
        "columns": 1,
        "encoding": {
          "facet": {
            "field": (this.props.split === "")? "dummy":this.props.split, 
            "type": "nominal", 
            "header": {"title": this.props.split, "titleFontSize": 20, "labelFontSize": 10}
          },
          "x": {
            "field": this.props.independentVar, 
            "type": "ordinal",
          },
          "y": {
            "field": this.props.dependentVar,
            "aggregate": "median"
          },
          "color": {
            "field": this.props.color,
            "type": "nominal"
          }
        },
        "resolve": {
          "axis": {"x": "independent", "y": "independent"},
          "scale": {"y": "independent"}
        }
      };
  }

  componentDidMount() {
    this.spec = this._spec();
    vegaEmbed(this.refs.LineChartContainer, this.spec);
  }

  //re-render vega visualization if input has changed
  componentDidUpdate(prevProps) {
    this.spec = this._spec();
    vegaEmbed(this.refs.LineChartContainer, this.spec);
  }

  // Creates container div that vega-lite will embed into
  render() { 
    return (
      <div ref='LineChartContainer'/>
    );
  }
}

LineChart.propTypes = {
  dependentVar: PropTypes.oneOf(["Value"]),
  independentVar: PropTypes.oneOf(["ITKVersion", "NumThreads", "System", 
                  "OSPlatform", "OSRelease", "OSName", "CommitDate", 
                  "CommitHash"]),
  split: PropTypes.string
}