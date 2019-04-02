import DataTransformationInstance from "../DataTransformation/DataTransformation.js";

class Api {
  constructor() {
    this.transformer = DataTransformationInstance.instance;
    this.prefix = "https://data.kitware.com/api/v1/";
    this.suffix = {
      foldersByFolderId: "folder?parentType=folder&parentId=<>",
      itemsByFolderId: "item?folderId=<>",
      itemById: "item/<>/download"
    }
    this.folderItemId = "_id";
    this.folderItemName = "name";
    this.benchmarkCollectionID = "5af50c818d777f06857985e3";
  }

  getFoldersFromParent(id, onSuccess, onFailure) {
    if(id == null) id = this.benchmarkCollectionID;

    let _this = this;
    let URL = this.prefix + this.suffix.foldersByFolderId.replace("<>", id);

    this.GET(URL, function(folder) {
      if (folder == null) {
        onFailure("Error retreiving folders from parent with id: " + id);
      }
      else {
        onSuccess(_this.transformer.parseFolderMetadata(folder));
      }
    }) 
  }

  getBenchmarkDataFromFolder(id, onSuccess, onFailure) {
    let _this = this;
    let URL = this.prefix + this.suffix.itemsByFolderId.replace("<>", id);
    let data = [];
    let count = 0;
    let folderLength = 0;

    let onBenchmarkSuccess = function(benchmarkList) {
      benchmarkList.forEach(function(object) {
        data.push(object);
      });
      benchmarkCallback();
    }
    let benchmarkCallback = function(response) {
      if (response != null && response instanceof Error) {
        console.error(response);
      }
      count++;
      if(count === folderLength) {
        onSuccess(data);
      }
    }

    this.GET(URL, function(response) {
      if (response == null) {
        onFailure("Error retreiving benchmarks from folder with id: " + id);
      }
      else {
        let benchmarks = _this.transformer.parseMetadata(response);
        folderLength = benchmarks.length;
        for (let benchmark in benchmarks) {
          let id = benchmarks[benchmark][_this.folderItemId];
          let name = benchmarks[benchmark][_this.folderItemName];
          _this.getBenchmarkData(id, name, onBenchmarkSuccess, benchmarkCallback);
        }
      }
    })
  }

  getBenchmarkData(id, name, onSuccess, onFailure) {
    // Create Request
    let _this = this;
    let URL = this.prefix + this.suffix.itemById.replace("<>", id);

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
