import React, { Component } from 'react';
import 'canvas';
import vegaEmbed from 'vega-embed';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { isNullOrUndefined } from 'util';

/**
 * Component for boxplot visualization for all Benchmarks
 * Accepted props:
 *    --dependentVar: dependent variable for boxplot, such as value
 *    --independentVar: independent variable for plot, such as commitHash
 *    --selected: optional, can specify a subset of selected instances of the 
 *                independent variable to chart (i.e. array of commitHashes).
 *                If not specified, all instances will be used
 */
export default class MultiBoxplot extends Component {
  static defaultProps = {
    dependentVar: "Value",
    independentVar: "CommitHash",
  }
  
  //generates spec for vega-lite heatmap visualization
  _spec() {
    return {
      "$schema": "https://vega.github.io/schema/vega-lite/v3.0.0-rc13.json",
      "description": "Box plots for each benchmark",
      "data": {"values": this.props.data},
      "transform": [
        {"filter": {"field": this.props.independentVar, 
        "oneOf": isNullOrUndefined(this.props.selected) ? 
          Object.keys(_.groupBy(this.props.data, value => value[this.props.independentVar])).sort() :
          this.props.selected}}
      ],
      "mark": {
        "type": "boxplot",
        "extent": "min-max"
      },
      "columns": 5,
      "encoding": {
        "facet": {
          "field": "BenchmarkName", 
          "type": "nominal", 
          "header": {"title": "Benchmark", "titleFontSize": 20, "labelFontSize": 10}
        },
        "x": {
          "field": this.props.independentVar,
          "type": "ordinal"
        },
        "y": {
          "field": this.props.dependentVar,
          "type": "quantitative",
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