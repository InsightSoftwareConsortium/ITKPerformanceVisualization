import React, { Component } from 'react';
import 'canvas';
import vegaEmbed from 'vega-embed';
import PropTypes from 'prop-types';

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
	  independentVar: 'CommitHash',
	  dependentVar: 'Value',
	  valuesOnYAxis: true
	};

	//generates spec for vega-lite heatmap visualization
	_spec() {
	  let v1 = this.props.valuesOnYAxis?'x':'y',
	    v2 = this.props.valuesOnYAxis?'y':'x';

	  return {
	    '$schema': 'https://vega.github.io/schema/vega-lite/v3.0.0-rc12.json',
	    'data': {'values': this.props.data},
	    'title': (this.props.split === '' && this.props.color === '')? this.props.selectedBenchmark: '',
	    'transform': [
	      {
	        'joinaggregate': [
	          {'op': 'median', 'field': this.props.dependentVar, 'as': 'values'},
	        ],
	        'groupby': [this.props.independentVar]
	      }
	    ],
	    'encoding': ((this.props.split === '' && this.props.color === '')?
	      {
	        [v1]: {
	          'field': this.props.independentVar,
	          'type': 'ordinal',
	          'sort': {'op': 'max', 'field': 'CommitDate'}
	        }
	      }:
	      {
	        [v1]: {
	          'field': this.props.independentVar,
	          'type': 'ordinal',
	          'sort': {'op': 'max', 'field': 'CommitDate'}
	        },
	        'facet': {
	          'field': this.props.split,
	          'type': 'nominal'
	        },
	        [v2]: {
	          'field': this.props.dependentVar,
	          'aggregate': 'median'
	        },
	        'color': {
	          'field': this.props.color,
	          'type': 'nominal'
	        }
	      }),
	    'columns': 1,
	    [(this.props.split === '' && this.props.color === '')?'layer':'mark']:
          ((this.props.split === '' && this.props.color === '')?
            [
              {
                'mark': {
                  'type': 'point'
                },
                'encoding': {
                  [v2]: {
                    'field': this.props.dependentVar,
                    'type': 'quantitative'
                  },
                  'color': {
                    'value': '#6d6460'
                  }
                },
              },
              {
                'mark': {
                  'type': 'square',
                  'size': 50
                },
                'encoding': {
                  [v2]: {
                    'field': 'values',
                    'aggregate': 'median',
                  },
                  'color': {
                    'field': 'values',
                    'type': 'quantitative',
                    'scale': {'scheme': 'blues'},
                    'legend': {
                      'title': 'Median Value'
                    }
                  }
                }
              }
            ]
            : {
              'type': 'point',
              'filled': 'true',
              'size': 50
            }),
	    'resolve': (this.props.split === '' && this.props.color === '')? null:{
	      'axis': {'x': 'independent', 'y': 'independent'},
	      'scale': {'y': 'independent'}
	    }
	  };
	}

	componentDidMount() {
	  this.spec = this._spec();
	  vegaEmbed(this.refs.ScatterPlotContainer, this.spec);
	}

	//re-render vega visualization if input has changed
	componentDidUpdate(prevProps) {
	  this.spec = this._spec();
	  console.log(this.spec);
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
  dependentVar: PropTypes.oneOf(['Value']),
  independentVar: PropTypes.oneOf(['ITKVersion', 'NumThreads', 'System',
    'OSPlatform', 'OSRelease', 'OSName', 'CommitDate', 'BenchmarkName',
    'CommitHash']),
  valuesOnYAxis: PropTypes.bool
};
