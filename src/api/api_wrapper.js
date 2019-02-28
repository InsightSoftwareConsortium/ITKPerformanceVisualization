import DataTransformationInstance from "../api/data_transformation.js"

const transformer = DataTransformationInstance.instance;

class Api {
  constructor() {
    this.promises = [];
    this.data = [];
    this.url = "https://data.kitware.com/api/v1/";
    this.benchmarkCollectionID = "5af50c818d777f06857985e3";
    this.sampleBenchmark = "5afa58378d777f0685798c5c";
  }

  getBenchmarkType(name) {
    return name.substring(name.indexOf("_") + 1, name.indexOf("."));
  }

  getFolder(id, callback) {
    let _this = this;
    let URL = this.url + "item?folderId=" + id;
    fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(function (folder){
        for (let index in folder)
          _this.promises.push(_this.getBenchmark(folder[index]["_id"], _this.getBenchmarkType(folder[index]["name"], callback)));
      })
      .catch(function(error) {
        console.log("Error:", error);
        callback(null);
      });
  }

  getBenchmark(id, name, callback) {
    // Create Request
    let _this = this;
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
        _this.data = _this.data.concat(transformer.parseBenchmark(name, benchmark));
      })
      .catch(function(error) {
        console.log("Error:", error);
        callback(null);
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
