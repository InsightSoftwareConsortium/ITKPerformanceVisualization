import React, { Component } from 'react';
import 'canvas';
import vegaEmbed from 'vega-embed';
import PropTypes from 'prop-types';

/**
 * Component for boxplot visualization for all Benchmarks
 * Accepted props:
 *    --dependentVar: dependent variable for boxplot, such as value
 *    --independentVar: independent variable for plot, such as commitHash
 *    --selected: optional, can specify a subset of selected instances of the 
 *                independent variable to chart (i.e. array of commitHashes).
 *                If not specified, all instances will be used
 *    --split: specifies how to split charts based on a particular field 
 */
export default class BoxPlot extends Component {
  static defaultProps = {
    dependentVar: "Value",
    independentVar: "CommitHash",
    color: "",
    split: "",
    valuesOnYAxis: true
  };
  
  //generates spec for vega-lite heatmap visualization
  _spec() {
    let v1 = this.props.valuesOnYAxis?"x":"y",
        v2 = this.props.valuesOnYAxis?"y":"x";

    let resolveOption = (this.props.split !== "")?
        {
          "axis": {[v1]: "independent", [v2]: "independent"},
          "scale": {[v2]: "independent"}
        }:{};

    return {
      "$schema": "https://vega.github.io/schema/vega-lite/v3.0.0-rc13.json",
      "description": "Box plots for each benchmark",
      "data": {"values": this.props.data},
      "mark": {
        "type": "boxplot",
        "extent": "min-max"
      },
      "transform": [{
        "calculate": (this.props.color === "")? "datum." + this.props.independentVar:"toString(datum." + this.props.independentVar + ") + ' - ' + toString(datum." + this.props.color + ")",
        "as": "adjIndVar"
      }],
      "columns": 1,
      "encoding": {
        "facet": {
          "field": this.props.split, 
          "type": "nominal", 
          "header": {"title": this.props.split, "titleFontSize": 20, "labelFontSize": 10}
        },
        [v1]: {
          "field": "adjIndVar",
          "type": "ordinal"
        },
        [v2]: {
          "field": this.props.dependentVar,
          "type": "quantitative",
        },
        "color": (this.props.color === "")? {"value": "#99badd"}:{
          "field": this.props.color,
          "type": "nominal"
        }
      },
      "resolve": resolveOption
    };
  }

  componentDidMount() {
    this.spec = this._spec();
    vegaEmbed(this.refs.BoxPlotContainer, this.spec);
  }

  //re-render vega visualization if input has changed
  componentDidUpdate(prevProps) {
    this.spec = this._spec();
    vegaEmbed(this.refs.BoxPlotContainer, this.spec);
  }

  // Creates container div that vega-lite will embed into
  render() { 
    return (
      <div ref='BoxPlotContainer'/>
    );
  }
}

BoxPlot.propTypes = {
  dependentVar: PropTypes.oneOf(["Value"]),
  independentVar: PropTypes.oneOf(["ITKVersion", "NumThreads", "System", 
                  "OSPlatform", "OSRelease", "OSName", "CommitDate", 
                  "CommitHash"]),
  split: PropTypes.string,
  color: PropTypes.string,
  valuesOnYAxis: PropTypes.bool
};