import React, { Component } from 'react';
import vegaEmbed from 'vega-embed';
import PropTypes from 'prop-types';
export default class SingleScatterplot extends Component {

	static defaultProps = {
    independentVar: "ITKVersion",
    dependentVar: "Value",
    selectedBenchmark: "DemonsRegistration"
  }

  //generates spec for vega-lite heatmap visualization
  _spec() {
    return {
        "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
        "data": {"values": this.props.data},
        "transform": [
            {"filter": {"field": "BenchmarkName", "equal": this.props.selectedBenchmark}}
        ],
        "encoding": {
            "x": {"field": this.props.independentVar, "type": "ordinal"}
        },
        "layer": [
            {
                "mark": {
                    "type": "point",
                    "filled": "true"
                },
                "encoding": {
                    "y": {
                      "field": this.props.dependentVar,
                      "type": "quantitative",
                      "aggregate": "mean",
                    },
                  "color": {"value": "black"}
                },
            },
            {
                "mark": {
                    "type": "errorbar",
                    "extent": "stdev"
                },
                "encoding": {
                    "y": {
                        "field": this.props.dependentVar,
                        "type": "quantitative",
                    }
                }
            }
        ]
    };
  }

  componentDidMount() {
    this.spec = this._spec();
    vegaEmbed(this.refs.SingleScatterplotContainer, this.spec);
  }

  //re-render vega visualization if input has changed
  componentDidUpdate(prevProps) {
    if(this.props.data !== prevProps.data
      || this.props.independentVar !== prevProps.independentVar
      || this.props.dependentVar !== prevProps.dependentVar
      || this.props.selectedBenchmark !== prevProps.selectedBenchmark) {
        this.spec = this._spec();
        vegaEmbed(this.refs.SingleScatterplotContainer, this.spec);
    }
  }

  // Creates container div that vega-lite will embed into
  render() { 
    return (
      <div ref='SingleScatterplotContainer'/>
    );
  }
}

SingleScatterplot.propTypes = {
  dependentVar: PropTypes.oneOf(["Value"]),
  independentVar: PropTypes.oneOf(["ITKVersion", "NumThreads", "System", 
                  "OSPlatform", "OSRelease", "OSName", "CommitDate", 
                  "CommitHash"])
}