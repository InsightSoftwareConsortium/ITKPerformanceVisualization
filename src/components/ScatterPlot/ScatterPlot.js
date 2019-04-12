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
 *    --selectedBenchmark: optional, benchmark to create plot for
 *    --selected: optional, can specify a subset of selected instances of the 
 *                independent variable to chart (i.e. array of commitHashes).
 *                If not specified, all instances will be used
 */
export default class ScatterPlot extends Component {

	static defaultProps = {
    independentVar: "CommitHash",
    dependentVar: "Value",
    selectedBenchmark: "ThreadOverheadBenchmark",
  }

  //generates spec for vega-lite heatmap visualization
  _spec() {
    return {    
        "$schema": "https://vega.github.io/schema/vega-lite/v3.0.0-rc12.json",
        "data": {"values": this.props.data},
        "title": this.props.selectedBenchmark,
          "transform": [
              {"filter": {"field": this.props.independentVar, 
              "oneOf": isNullOrUndefined(this.props.selected) ? 
                Object.keys(_.groupBy(this.props.data, value => value[this.props.independentVar])) :
                this.props.selected}},
              {"filter": {"field": "BenchmarkName", "equal": this.props.selectedBenchmark}},
              {
                "joinaggregate": [
                  {"op": "median", "field": this.props.dependentVar, "as": "values"},
                ],
                "groupby": [this.props.independentVar]
              }
          ],
          "encoding": {
              "x": {
                "field": this.props.independentVar, 
                "type": "ordinal",
                "sort": {"op": "max", "field": "CommitDate"}
              }
          },
          "layer": [
            {
                "mark": {
                    "type": "point"
                },
                "encoding": {
                    "y": {
                      "field": this.props.dependentVar,
                      "type": "quantitative"
                    },
                  "color": {
                    "value": "#6d6460"
                  }
                },
            },
            {
                "mark": {
                    "type": "square",
                    "size": 50
                },
                "encoding": {
                  "y": {
                    "field": "values",
                    "aggregate": "median",
                  },
                  "color": {
                    "field": "values",
                    "type": "quantitative",
                    "scale": {"scheme": "blues"},
                    "legend": {
                      "title": "Median Value"
                    }
                  }
                }
            }
          ]
    };
  }

  componentDidMount() {
    this.spec = this._spec();
    vegaEmbed(this.refs.ScatterPlotContainer, this.spec);
  }

  //re-render vega visualization if input has changed
  componentDidUpdate(prevProps) {
    this.spec = this._spec();
    vegaEmbed(this.refs.ScatterPlotContainer, this.spec);
  }

  // Creates container div that vega-lite will embed into
  render() { 
    return (
      <div ref='ScatterPlotContainer'/>
    );
  }
}

ScatterPlot.propTypes = {
  dependentVar: PropTypes.oneOf(["Value"]),
  independentVar: PropTypes.oneOf(["ITKVersion", "NumThreads", "System", 
                  "OSPlatform", "OSRelease", "OSName", "CommitDate", "BenchmarkName",
                  "CommitHash"])
}