import React, { Component } from 'react';
import 'canvas';
import vegaEmbed from 'vega-embed';
import PropTypes from 'prop-types';

/**
 * Component for heatmap visualization for all benchmarks
 * Accepted props:
 *    --dependentVar: dependent variable for plot, such as value
 *    --independentVar: independent variable for plot, such as commitHash
 *    --selected: optional, can specify a subset of selected instances of the
 *                independent variable to chart in the form of an array
 *                (i.e. array of commitHashes).
 *                If not specified, all instances will be used
 *    --split: specifies how to split charts based on a particular field
 */
export default class HeatMap extends Component {

  static defaultProps = {
    dependentVar: 'Value',
    independentVar: 'CommitHash',
    valuesOnYAxis: true,
    selectedBenchmark: 'BinaryAddBenchmark'
  };

  //generates spec for vega-lite heatmap visualization
  _spec() {
    let v1 = this.props.valuesOnYAxis?'x':'y',
      v2 = this.props.valuesOnYAxis?'y':'x';

    return {
      '$schema': 'https://vega.github.io/schema/vega-lite/v3.0.0-rc13.json',
      'title': (this.props.useRawValues)? 'Runtimes':'Normalized runtimes',
      'data': {'values': this.props.data},
      'selection': {
        'benchmarks': {
          'type': 'single',
          'fields': ['BenchmarkName']
        },
        'grid': {
          'type': 'interval', 'bind': 'scales'
        }
      },
      'columns': 1,
      'transform': [
        {
          'sort': [{'field': this.props.dependentVar}],
          'joinaggregate': [
            {'op': 'mean', 'field': this.props.dependentVar, 'as': 'meanBenchmarkValue'},
            {'op': 'stdev', 'field': this.props.dependentVar, 'as': 'stdevBenchmarkValue'}
          ],
          'groupby': (this.props.split === '')? ['BenchmarkName']:['BenchmarkName', this.props.split]
        },
        {
          'joinaggregate': [
            {'op': 'mean', 'field': this.props.dependentVar, 'as': 'specificMeanBenchmarkValue'}
          ],
          'groupby': (this.props.split === '')? ['BenchmarkName', this.props.independentVar]:['BenchmarkName', this.props.independentVar, this.props.split]
        },
        {
          'calculate':
            '(datum.specificMeanBenchmarkValue-datum.meanBenchmarkValue)/(datum.stdevBenchmarkValue)',
          'as': 'ZScore'
        }
      ],
      'mark': 'rect',
      'encoding': {
        'facet': {
          'field': this.props.split,
          'type': 'nominal',
          'header': {'title': this.props.split, 'titleFontSize': 20, 'labelFontSize': 10}
        },
        [v1]: {
          'field': this.props.independentVar,
          'type': 'ordinal',
          'sort': {'op': 'max', 'field': 'CommitDate'}
        },
        [v2]: {
          'field': 'BenchmarkName',
          'type': 'nominal',
          'axis': {'title': 'Benchmark'},
          'sort': {'field': 'meanBenchmarkValue', 'order': 'descending'}
        },
        'color': {
          'condition': {
            'selection': 'benchmarks',
            'field': (this.props.useRawValues)? 'specificMeanBenchmarkValue':'ZScore',
            'type': 'quantitative',
            'sort': 'descending',
            'axis': {'title': (this.props.useRawValues)? 'Mean Probe Time':'Mean Probe Time Z-Score'},
          },
          'value': 'white',
        }
      },
      'config': {
        'range': {
          'heatmap': {
            'scheme': 'redblue'
          }
        },
        'view': {
          'stroke': 'transparent'
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
  dependentVar:  PropTypes.oneOf(['Value', 'StandardDeviation', 'Mean']),
  independentVar: PropTypes.oneOf(['ITKVersion', 'NumThreads', 'System',
    'OSPlatform', 'OSRelease', 'OSName', 'CommitDate',
    'CommitHash']),
  valuesOnYAxis: PropTypes.bool,
  useRawValues: PropTypes.bool,
  selectedBenchmark: PropTypes.string
};
