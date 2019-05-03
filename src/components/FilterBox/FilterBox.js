import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropdown from '../Dropdown/Dropdown';
import Button from '../Button/Button';
import '../../../src/static/scss/FilterBox.css';

export default class FilterBox extends Component {
  constructor(props){
    super(props);
    this.state = {filterAdded: false};
    this.addButtonClicked = this.addButtonClicked.bind(this);
  }

  addButtonClicked(event){
    let selection = this.props.options.find((item) => {return !Object.keys(this.props.filters).includes(item);});
    this.props.filters[selection] = null;
    this.setState({filterAdded: true});
    this.forceUpdate();
  }

  componentDidUpdate(){
    if (this.state.filterAdded){
      let scrollBox = document.getElementsByClassName('filter-box-container')[0];
      scrollBox.scrollTop = scrollBox.scrollHeight;
      this.setState({filterAdded: false});
    }
  }

  render() {
    return (
      <div className="filter-box-container">
        <Button color='green' className="add-filter-button" onClick={this.addButtonClicked}> + </Button>
        {Object.keys(this.props.filters).filter((item) => !this.props.exclude.includes(item)).length === 0 ?
          <div className="no-filters-msg">No Filters Applied</div>
          :
          <div>
            {Object.keys(this.props.filters).filter((item) => !this.props.exclude.includes(item)).map((item) => {
              return <div className='filterbox-item'>
                <Dropdown selection={item}
                  options={this.props.options.filter((option) => !Object.keys(this.props.filters).includes(option) || option === item)}
                  getAttributeValues={this.props.getAttributeValues}
                  getAttributeSelection={this.props.getAttributeSelection}
                  updateAttributeSelection={this.props.updateAttributeSelection}
                  updateFilterSelection={this.props.updateFilterSelection}
                  filterExists={this.props.filterExists}
                  style={{display:'inline-block'}}
                ></Dropdown>
                <Button color='red' className="circle-filter-button" onClick={() => {this.props.deleteFilterSelection(item);}}> - </Button>
              </div>;
            })}
          </div>
        }
      </div>
    );
  }
}

FilterBox.propTypes = {
  filters: PropTypes.array,
  options: PropTypes.string,
  exclude: PropTypes.array,
  getAttributeValues: PropTypes.func,
  getAttributeSelection: PropTypes.func,
  updateAttributeSelection: PropTypes.func,
  updateFilterSelection: PropTypes.func,
  deleteFilterSelection: PropTypes.func,
  filterExists: PropTypes.func
};
