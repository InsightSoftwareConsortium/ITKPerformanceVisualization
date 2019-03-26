import DataTransformationInstance from "../DataTransformation/DataTransformation.js";

class Api {
  constructor() {
    this.transformer = DataTransformationInstance.instance;
    this.prefix = "https://data.kitware.com/api/v1/";
    this.suffix = {
      folderById: "item?folderId=<>",
      itemById: "item/<>/download"
    }
    this.folderItemId = "_id";
    this.folderItemName = "name";
    this.benchmarkCollectionID = "5af50c818d777f06857985e3";
  }

  getFolder(id, onSuccess, onFailure) {
    let _this = this;
    let URL = this.prefix + this.suffix.folderById.replace("<>", id);
    let data = [];
    let count = 0;
    let folderLength = 0;

    let onBenchmarkSuccess = function(response) {
      response.forEach(function(object) {
        data.push(object);
      });
      benchmarkCallback(response);
    }
    let benchmarkCallback = function(response) {
      count++;
      if(count === folderLength) {
        onSuccess(data);
      }
    }

    this.GET(URL, function(folder) {
      if (folder == null) {
        onFailure("Error loading folder with id: " + id);
      }
      else {
        folderLength = folder.length;
        for (let item in folder) {
          _this.getBenchmark(folder[item][_this.folderItemId], folder[item][_this.folderItemName], onBenchmarkSuccess, benchmarkCallback);
        }
      }
    });
  }

  getBenchmark(id, name, onSuccess, onFailure) {
    // Create Request
    let _this = this;
    let URL = this.prefix + this.suffix.itemById.replace("<>", id);
    name = name.split("_").slice(-1)[0].split(".")[0];

    this.GET(URL, function(benchmark) {
      if (benchmark == null) {
        onFailure("Failure retrieving benchmark with id: " + id)
      }
      else {
        onSuccess(_this.transformer.parseBenchmark(name, benchmark))
      }
    });
  }

  GET(url, callback) {
    fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(function (json) {
          callback(json)
        })
        .catch(function(error) {
          console.error("Error:", error)
          callback(null)
        })
  }
}

export default class ApiInstance {
  static get instance() {
    if (!this[Api]) {
      this[Api] = new Api();
    }
    return this[Api];
  }
}
