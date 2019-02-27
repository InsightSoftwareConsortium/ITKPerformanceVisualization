import React, { Component } from 'react';
import 'canvas';
import vegaEmbed from 'vega-embed';
import PropTypes from 'prop-types';
export default class MultiBoxplot extends Component {

  static defaultProps = {
    dependentVar: "Value",
    independentVar: "ITKVersion"
  }
  
  //generates spec for vega-lite heatmap visualization
  _spec() {
    return {
      "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
      "description": "Box plots for each benchmark",
      "data": {"values": this.props.data},
      "facet": {"column": {"field": "BenchmarkName", "type": "nominal"}},
      "spec": {
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
      }
    };
  }

  componentDidMount() {
    this.spec = this._spec();
    vegaEmbed(this.refs.MultiBoxplotContainer, this.spec);
  }

  //re-render vega visualization if input has changed
  componentDidUpdate(prevProps) {
    if(this.props.data !== prevProps.data
      || this.props.independentVar !== prevProps.independentVar
      || this.props.dependentVar !== prevProps.dependentVar) {
        this.spec = this._spec();
        vegaEmbed(this.refs.MultiBoxplotContainer, this.spec);
    }
  }

  // Creates container div that vega-lite will embed into
  render() { 
    return (
      <div ref='MultiBoxplotContainer'/>
    );
  }
}

MultiBoxplot.propTypes = {
  dependentVar: PropTypes.oneOf(["Value"]),
  independentVar: PropTypes.oneOf(["ITKVersion", "NumThreads", "System", 
                  "OSPlatform", "OSRelease", "OSName", "CommitDate", 
                  "CommitHash"])
}