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
    color: "",
    selectedBenchmark: "BinaryAddBenchmark",
    valuesOnYAxis: true
  }
  
  //generates spec for vega-lite heatmap visualization
  _spec() {
    let v1 = this.props.valuesOnYAxis?"x":"y",
        v2 = this.props.valuesOnYAxis?"y":"x";

    return {
        "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
        "data": {"values": this.props.data},
        "mark": {
          "type": "line",
          "interpolate": "monotone" //"step-after"
        },
        "columns": 4,
        "encoding": {
          "facet": {
            "field": this.props.split, 
            "type": "nominal", 
            "header": {"title": this.props.split, "titleFontSize": 20, "labelFontSize": 10}
          },
          [v1]: {
            "field": this.props.independentVar, 
            "type": "ordinal",
            // "sort": {"op": "max", "field": "CommitDate"}
          },
          [v2]: {
            "field": this.props.dependentVar,
            "aggregate": "median"
          },
          "color": {
            "field": this.props.color,
            "type": "nominal"
          }
        },
        "resolve": {
          "axis": {[v1]: "independent", [v2]: "independent"},
          "scale": {[v2]: "independent"}
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
  split: PropTypes.string,
  valuesOnYAxis: PropTypes.bool,
  selectedBenchmark: PropTypes.string
}