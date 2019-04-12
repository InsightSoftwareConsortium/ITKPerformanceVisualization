import DataTransformationInstance from "../DataTransformation/DataTransformation.js";

class Api {
  constructor() {
    this.transformer = DataTransformationInstance.instance;
    this.prefix = "https://data.kitware.com/api/v1/";
    this.suffix = {
      folderDetailsById: "folder/<>/details",
      foldersByFolderId: "folder?parentType=folder&parentId=<>",
      itemsByFolderId: "item?folderId=<>",
      itemById: "item/<>/download",
      limit: "&limit=<>"
    }
    this.folderItemId = "_id";
    this.folderItemName = "name";
    this.folderDetailsSubFolders = "nFolders";
    this.folderDetailsItems = "nItems";
    this.benchmarkCollectionID = "5af50c818d777f06857985e3"; 
    this.maxLimit = 100;
  }

  getFolderDetails(id, onSuccess, onFailure) {
    let URL = this.prefix + this.suffix.folderDetailsById.replace("<>", id);

    this.GET(URL, function(details) {
      if (details == null) {
        onFailure(new Error("Error retreiving folder details for folder id: " + id));
      }
      else {
        onSuccess(details);
      }
    })
  }

  getFoldersFromParent(id, onSuccess, onFailure) {
    if(id == null) id = this.benchmarkCollectionID;

    let _this = this;
    let URL = this.prefix + this.suffix.foldersByFolderId.replace("<>", id);

    //determine number of subfolders for limit parameter
    let onDetailsSuccess = function(details) {
      let subFolderCount = details[_this.folderDetailsSubFolders];
      if (subFolderCount != null) {
        URL = URL.concat(_this.suffix.limit.replace("<>", subFolderCount));
      }

      _this.GET(URL, function(folder) {
        if (folder == null) {
          onFailure(new Error("Error retreiving folders from parent with id: " + id));
        }
        else {
          onSuccess(_this.transformer.parseFolderMetadata(folder));
        }
      }) 
    }
    this.getFolderDetails(id, onDetailsSuccess, onFailure);
  }

  getBenchmarkDataFromMultipleFolders(ids, onSuccess, onFailure, updateLoader){
    let _this = this;
    let count = 0;
    let data = [];
    let onFolderSuccess = function(response) {
      data = data.concat(response);
      folderCallback();
    }
    let folderCallback = function(response) {
      if (response != null && response instanceof Error) {
        console.error(response);
      }
      count++;
      updateLoader("Fetching Data..."+count+" Folder(s)")
      if(count === ids.length) {
        if (data != null && data.length > 0) onSuccess(data);
        else onFailure(new Error("Unable to obtain benchmark data from folders: " + ids))
      }
    }

    for (let index in ids)
      _this.getBenchmarkDataFromSingleFolder(ids[index], onFolderSuccess, folderCallback);
  }

  getBenchmarkDataFromSingleFolder(id, onSuccess, onFailure) {
    let _this = this;
    let URL = this.prefix + this.suffix.itemsByFolderId.replace("<>", id);
    let data = [];
    let count = 0;
    let folderLength = 0;

    let onDetailsSuccess = function(details) {
      let itemCount = Math.min(details[_this.folderDetailsItems], _this.maxLimit);
      if (itemCount != null) {
        URL = URL.concat(_this.suffix.limit.replace("<>", itemCount));
      }

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
  
      _this.GET(URL, function(response) {
        if (response == null) {
          onFailure(new Error("Error retreiving benchmarks from folder with id: " + id));
        }
        else {
          let benchmarks = _this.transformer.parseMetadata(response);
          folderLength = benchmarks.length;
          if (id === "5c7b546e8d777f072b76ae0c") {
            console.log("here");
          }
          for (let benchmark in benchmarks) {
            let benchmarkId = benchmarks[benchmark][_this.folderItemId];
            let benchmarkName = benchmarks[benchmark][_this.folderItemName];
            _this.getBenchmarkData(benchmarkId, benchmarkName, onBenchmarkSuccess, benchmarkCallback);
          }
        }
      })
    }

    this.getFolderDetails(id, onDetailsSuccess, onFailure);
  }

  getBenchmarkData(id, name, onSuccess, onFailure) {
    // Create Request
    let _this = this;
    let URL = this.prefix + this.suffix.itemById.replace("<>", id);

    this.GET(URL, function(benchmark) {
      if (benchmark == null) {
        onFailure(new Error("Failure retrieving benchmark with id: " + id));
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
