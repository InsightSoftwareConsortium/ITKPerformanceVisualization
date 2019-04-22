import Ajv from 'ajv'
import BenchmarkSchema from './BenchmarkSchema.json'

class DataTransformation {
  constructor() {
    this.scatterPlotDataKeys = {
      CommitDate: "ITK_MANUAL_BUILD_INFORMATION.GIT_CONFIG_DATE",
      CommitHash: "ITK_MANUAL_BUILD_INFORMATION.GIT_CONFIG_SHA1",
      ITKVersion: "SystemInformation.ITKVersion",
      OSName: "SystemInformation.OperatingSystem.Name",
      OSPlatform: "SystemInformation.OperatingSystem.Platform",
      OSRelease: "SystemInformation.OperatingSystem.Release",
      NumThreads: "RunTimeInformation.GetGlobalDefaultNumberOfThreads",
      System: "SystemInformation.System",
    };
    this.valuesKey = "Probes.0.Values";

    this.idKey = "_id";
    this.nameKey = "name";
    this.sizeKey = "size";

    let ajv = new Ajv();
    this.validate = ajv.compile(BenchmarkSchema);
  }

  parseMetadata(list) {
    let parsedList = [];
    for(let folder in list) {
      let data = list[folder];
      let entry = {};
      if (data && data[this.idKey] && data[this.nameKey]) {
        entry[this.idKey] = data[this.idKey];
        entry[this.nameKey] = data[this.nameKey];
        parsedList.push(entry);
      }
    }
    return parsedList;
  }

  parseFolderMetadata(folderList) {
    //filter our empty folders
    let sizeKey = this.sizeKey;
    let filteredArray = folderList.filter((folder) => {return folder[sizeKey] > 0});
    return this.parseMetadata(filteredArray);
  }

  /**
     * For scatterPlot/individual points:
{
    "CommitDate": "2017-12-20 11:50:32 -0500",
    "CommitHash": "d92873e33e8a54e933e445b92151191f02feab42",
    "ITKVersion": "4.13.0"
    "OSName": "Linux",
    "OSPlatform": "x86_64",
    "OSRelease": "4.9.0-6-amd64",
    "NumThreads": "12",
    "System": "clay",
    "BenchmarkName": "WatershedBenchmark",
    "Value": 1.1
}

For others:
{
    "CommitDate": "2017-12-20 11:50:32 -0500",
    "CommitHash": "d92873e33e8a54e933e445b92151191f02feab42",
    "ITKVersion": "4.13.0"
    "OSName": "Linux",
    "OSPlatform": "x86_64",
    "OSRelease": "4.9.0-6-amd64",
    "NumThreads": "12",
    "System": "clay",
    "BenchmarkName": "WatershedBenchmark",
    "Iterations": 3,
    "Mean": 1.19388,
    "StandardDeviation": 0.0507
    "ZScore": 1.21 //you would have to compute this based on means of all of same benchmark type
}
     */
  parseBenchmark(benchmarkName, benchmarkJson, isLocal = false) {
    /*if (benchmarkJson == null) {
      return [];
    }*/

    //Validate json
    var valid = this.validate(benchmarkJson);
    if (!valid) {
      // console.error(
      //   "Invalid benchmark JSON: " + this.validate.errors[0].message + "\n",
      //   benchmarkJson,
      //   this.validate.errors
      // )
      return [];
    }

    //parse benchmark name
    //Name is found after second underscore in full name
    let nameIndex = benchmarkName.indexOf("_", benchmarkName.indexOf("_") + 1) + 1;
    benchmarkName = benchmarkName.slice(nameIndex).split(".")[0];
    
    let dict = {
      _local: isLocal,
      BenchmarkName: benchmarkName, 
    };
    for (let key in this.scatterPlotDataKeys) {
      let val = findValue(benchmarkJson, this.scatterPlotDataKeys[key]);
      //clean entries
      if (typeof val === String && val.match(/b'.+'/)) {
        //slice off excess characters
        val = val.slice(2, val.length - 1);
      }
      dict[key] = val;
    }

    let values = findValue(benchmarkJson, this.valuesKey);
    
    // unwind value array into dictionary array
    let result = [];
    for (let index in values){
      let newDict = Object.assign({}, dict),
          newDict2 = Object.assign({}, dict),
          newDict3 = Object.assign({}, dict);
      newDict["Value"] = values[index];
      newDict2["Value"] = values[index]*(Math.random() + 0.5);
      newDict2["OSName"] = "MacOS";
      newDict3["Value"] = values[index]*(Math.random() + 0.4);
      newDict3["OSName"] = "Windows";
      result.push(newDict);
      result.push(newDict2);
      result.push(newDict3);
    }
    return result;
  }
}

var findValue = function(object, dir) {
  let keys = dir.split(".");
  let pointer = object;

  for (let i = 0; i < keys.length; i++) {
    if (pointer[keys[i]] === undefined) return null;
    else pointer = pointer[keys[i]];
  }
  return pointer;
};

export default class DataTransformationInstance {
  static get instance() {
    if (!this[DataTransformation]) {
      this[DataTransformation] = new DataTransformation();
    }
    return this[DataTransformation];
  }
}
