import React from 'react';
import Button from '../Button/Button';
import '../../static/scss/UploadDataButton.css';
import DataTransformation from '../../api/DataTransformation/DataTransformation';

const Dti = DataTransformation.instance;

export default class UploadDataButton extends Button {

  readFile(file, callback) {
    let reader = new FileReader();
    reader.onloadend = function () {
      if (reader.result) {
        let json = Dti.parseBenchmark(file.name, JSON.parse(reader.result), true);
        callback(json);
      }
    }
    reader.readAsText(file);
  }

  onInput = (event) => {
    let _this = this;
    let files = event.target.files;
    let data = [];
    let count = 0;

    let onFileSuccess = function (json) {
      if (json != null) {
        data = data.concat(json);
      }
      count++;
      if (count === files.length) {
        //change state, add data
        _this.props.addLocalData(data);
      }
    }

    for (let i = 0; i < files.length; i++) {
      _this.readFile(files[i], onFileSuccess)
    }
  }

  onClick = (event) => {
    this.inputElement.click();
  }

  render() {
    return (
      <div>
        <Button color="blue" onClick={this.onClick}>
          Upload Data &nbsp; {this.props.children}
        </Button>
        <div id="local-upload-input">
          <input
            ref={input => this.inputElement = input}
            type="file"
            accept=".json"
            multiple
            onInput={(event) => this.onInput(event)}
            onClick={(event) => {
              event.target.value = null
            }}
          />
        </div>
      </div>
    )
  }
}

