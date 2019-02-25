import React, { Component } from 'react';
import vegaEmbed from 'vega-embed';
import _ from 'lodash';

export default class HeatMap extends Component {

  static defaultProps = {
    dependentVar: "ZScore",
    independentVar: "ITKVersion"
  }

  //generates spec for vega-lite heatmap visualization
  _spec() {
    return {
      "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
      "data": {"values": this.props.data},
      "selection": {
          "benchmarks": {
            "type": "single",
            "fields": ["BenchmarkName"],
            "title:": "Isolate benchmark:",
            "bind": {"input": "select", "options": 
            Object.keys(_.groupBy(this.props.data, value => 
              value.BenchmarkName)).sort()}
          },
          "grid": {
              "type": "interval", "bind": "scales"
          }
      },
      "mark": "rect",
        "encoding": {
          "y": {
            "field": "BenchmarkName", 
            "type": "nominal", "axis": {"title": "Benchmark"}
          },
          "x": {
            "field": this.props.independentVar, 
            "type": "ordinal"
          },
          "color": {
              "condition": {
                  "selection": "benchmarks",
                  "field": this.props.dependentVar,
                  "type": "quantitative",
                  "axis": {"title": this.props.dependentVar}
              },
              "value": "white"
          }
        }
      };
  }

  componentDidMount() {
    this.spec = this._spec();
    vegaEmbed(this.refs.HeatMapContainer, this.spec);
  }

  componentDidUpdate(prevProps) {
    if(this.props.data !== prevProps.data
      || this.props.independentVar !== prevProps.independentVar
      || this.props.dependentVar !== prevProps.dependentVar) {
        this.spec = this._spec();
        vegaEmbed(this.refs.HeatMapContainer, this.spec);
    }
  }

  // Creates container div that vega-lite will embed into
  render() { 
    return (
      <div ref='HeatMapContainer'/>
    );
  }
}

