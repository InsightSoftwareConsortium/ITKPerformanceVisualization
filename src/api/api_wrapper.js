import DataTransformationInstance from "../api/data_transformation.js"

const transformer = DataTransformationInstance.instance;

class Api {
  constructor() {
    this.url = "https://data.kitware.com/api/v1/";
    this.benchmarkCollectionID = "5af50c818d777f06857985e3";
    this.sampleBenchmark = "5afa58378d777f0685798c5c";
  }

  getBenchmarkType(name) {
    return name.split("_").slice(-1)[0].split(".")[0];
  }

  getFolder(id, onSuccess) {
    let _this = this;
    let URL = this.url + "item?folderId=" + id;
    let data = [];
    let count = 0;
    let folderLength = 0;

    let onBenchMarkSuccess = function(response) {
      response.forEach(function(object) {
        data.push(object);
      });
      count++;
      if(count === folderLength) {
        console.log(data);
        onSuccess(data);
      }

    }

    fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(function (folder){
        folderLength = folder.length;
        for (let index in folder) {
          _this.getBenchmark(folder[index]["_id"], _this.getBenchmarkType(folder[index]["name"]), onBenchMarkSuccess);
        }
      })
      .catch(function(error) {
        console.log("Error:", error);
      });
  }

  getBenchmark(id, name, onSuccess) {
    // Create Request
    if (id == null) id = this.sampleBenchmark;
    let URL = this.url + "item/" + id + "/download";

    return fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(function (benchmark){
        onSuccess(transformer.parseBenchmark(name, benchmark));
      })
      .catch(function(error) {
        console.log("Error:", error);
    });
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
