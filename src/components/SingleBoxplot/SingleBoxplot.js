import React, { Component } from 'react';
import 'canvas';
import vegaEmbed from 'vega-embed';
import PropTypes from 'prop-types';

export default class SingleBoxplot extends Component {

  static defaultProps = {
    dependentVar: "Value",
    independentVar: "CommitHash",
    selectedBenchmark: "LevelSetBenchmark"
  }
  
  //generates spec for vega-lite heatmap visualization
  _spec() {
    return {
      "$schema": "https://vega.github.io/schema/vega-lite/v3.0.0-rc13.json",
      "description": "Box plots for each benchmark",
      "data": {"values": this.props.data},
      "title": this.props.selectedBenchmark,
      "transform": [
        {"filter": {"field": "BenchmarkName", "equal": this.props.selectedBenchmark}}
      ],
      "mark": {
        "type": "boxplot",
        "extent": "min-max"
      },
      "encoding": {
        "x": {
          "field": this.props.independentVar,
          "type": "ordinal"
        },
        "y": {
          "field": this.props.dependentVar,
          "type": "quantitative",
        }
      }
    };
  }

  componentDidMount() {
    this.spec = this._spec();
    vegaEmbed(this.refs.SingleBoxplotContainer, this.spec);
  }

  //re-render vega visualization if input has changed
  componentDidUpdate(prevProps) {
    if(this.props.data !== prevProps.data
      || this.props.independentVar !== prevProps.independentVar
      || this.props.dependentVar !== prevProps.dependentVar) {
        this.spec = this._spec();
        vegaEmbed(this.refs.SingleBoxplotContainer, this.spec);
    }
  }

  // Creates container div that vega-lite will embed into
  render() { 
    return (
      <div ref='SingleBoxplotContainer'/>
    );
  }
}

SingleBoxplot.propTypes = {
  dependentVar: PropTypes.oneOf(["Value"]),
  independentVar: PropTypes.oneOf(["ITKVersion", "NumThreads", "System", 
                  "OSPlatform", "OSRelease", "OSName", "CommitDate", 
                  "CommitHash"])
}