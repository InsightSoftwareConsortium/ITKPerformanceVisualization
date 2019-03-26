import React, { Component } from 'react';
import 'canvas';
import vegaEmbed from 'vega-embed';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { isNullOrUndefined } from 'util';

/**
 * Component for scatterplot visualization for a single benchmark
 * Accepted props:
 *    --dependentVar: dependent variable for plot, such as value
 *    --independentVar: independent variable for plot, such as commitHash
 *    --selectedBenchmark: benchmark to create plot for
 *    --selected: optional, can specify a subset of selected instances of the 
 *                independent variable to chart (i.e. array of commitHashes).
 *                If not specified, all instances will be used
 */
export default class SingleScatterplot extends Component {

	static defaultProps = {
    independentVar: "CommitHash",
    dependentVar: "Value",
    selectedBenchmark: "ThreadOverheadBenchmark"
  }

  //generates spec for vega-lite heatmap visualization
  _spec() {
    return {    
        "$schema": "https://vega.github.io/schema/vega-lite/v3.0.0-rc12.json",
        "title": this.props.selectedBenchmark,
        "data": {"values": this.props.data},
        "transform": [
            {"filter": {"field": "BenchmarkName", "equal": this.props.selectedBenchmark}},
            {"filter": {"field": this.props.independentVar, 
            "oneOf": isNullOrUndefined(this.props.selected) ? 
              Object.keys(_.groupBy(this.props.data, value => value[this.props.independentVar])).sort() :
              this.props.selected}}
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
                      "aggregate": "mean"
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
                        "type": "quantitative"
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
    this.spec = this._spec();
    vegaEmbed(this.refs.SingleScatterplotContainer, this.spec);
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
                  "OSPlatform", "OSRelease", "OSName", "CommitDate", "BenchmarkName",
                  "CommitHash"])
}