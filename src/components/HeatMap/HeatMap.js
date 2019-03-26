import React, { Component } from 'react';
import 'canvas';
import vegaEmbed from 'vega-embed';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { isNullOrUndefined } from 'util';

/**
 * Component for heatmap visualization for all benchmarks
 * Accepted props:
 *    --dependentVar: dependent variable for plot, such as value
 *    --independentVar: independent variable for plot, such as commitHash
 *    --selected: optional, can specify a subset of selected instances of the 
 *                independent variable to chart in the form of an array
 *                (i.e. array of commitHashes).
 *                If not specified, all instances will be used
 */
export default class HeatMap extends Component {

  static defaultProps = {
    dependentVar: "Value",
    independentVar: "CommitHash",
    selected: []
  }

  //generates spec for vega-lite heatmap visualization
  _spec() {
    return {
      "$schema": "https://vega.github.io/schema/vega-lite/v3.0.0-rc13.json",
      "title": "Normalized runtimes",
      "data": {"values": this.props.data},
      "selection": {
          "benchmarks": {
            "type": "single",
            "fields": ["BenchmarkName"],
            /*"bind": {
              "input": "select", 
              "options": Object.keys(_.groupBy(this.props.data, value => 
                value.BenchmarkName)).sort(),
              }*/
          },
          "grid": {
              "type": "interval", "bind": "scales"
          }
      },
      "transform": [
        {"filter": {"field": this.props.independentVar, 
        "oneOf": isNullOrUndefined(this.props.selected) ? 
          Object.keys(_.groupBy(this.props.data, value => value[this.props.independentVar])).sort() :
          this.props.selected}},
        {
          "sort": [{"field": this.props.dependentVar}],
          "joinaggregate": [
            {"op": "mean", "field": this.props.dependentVar, "as": "meanBenchmarkValue"},
            {"op": "stdev", "field": this.props.dependentVar, "as": "stdevBenchmarkValue"}
          ],
          "groupby": ["BenchmarkName"]
        },
        {
          "joinaggregate": [
            {"op": "mean", "field": this.props.dependentVar, "as": "specificMeanBenchmarkValue"}
          ],
          "groupby": ["BenchmarkName", this.props.independentVar]
        },
        {
          "calculate": 
            "(datum.specificMeanBenchmarkValue-datum.meanBenchmarkValue)/(datum.stdevBenchmarkValue)", 
            "as": "ZScore"
        }
      ],
      "mark": "rect",
        "encoding": {
          "y": {
            "field": "BenchmarkName", 
            "type": "nominal", 
            "axis": {"title": "Benchmark"},
            "sort": {"field": "meanBenchmarkValue", "order": "descending"}
          },
          "x": {
            "field": this.props.independentVar, 
            "type": "ordinal"
          },
          "color": {
              "condition": {
                  "selection": "benchmarks",
                  "field": "ZScore",
                  "type": "quantitative",
                  "sort": "descending",
                  "axis": {"title": this.props.dependentVar + " Z-Score"},
              },
              "value": "white",
          }
        },
        "config": {
          "range": {
            "heatmap": {
              "scheme": "redblue"
            }
          },
          "view": {
            "stroke": "transparent"
          }
        }
      };
  }

  componentDidMount() {
    this.spec = this._spec();
    vegaEmbed(this.refs.HeatMapContainer, this.spec);
  }

  componentDidUpdate(prevProps) {
    this.spec = this._spec();
    vegaEmbed(this.refs.HeatMapContainer, this.spec);
  }

  // Creates container div that vega-lite will embed into
  render() { 
    return (
      <div ref='HeatMapContainer'/>
    );
  }
}

HeatMap.propTypes = {
  dependentVar:  PropTypes.oneOf(["Value", "StandardDeviation", "Mean"]),
  independentVar: PropTypes.oneOf(["ITKVersion", "NumThreads", "System", 
                  "OSPlatform", "OSRelease", "OSName", "CommitDate", 
                  "CommitHash"]),
  selected: PropTypes.array
}
