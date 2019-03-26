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
  parseBenchmark(benchmarkName, benchmarkJson) {
    if (benchmarkJson == null) {
      return null
    }
    
    let dict = {BenchmarkName: benchmarkName};
    for (let key in this.scatterPlotDataKeys) {
      dict[key] = findValue(benchmarkJson, this.scatterPlotDataKeys[key]);
    }

    let values = findValue(benchmarkJson, this.valuesKey);
    
    // unwind value array into dictionary array
    let result = [];
    for (let index in values){
      let newDict = Object.assign({}, dict);
      newDict["Value"] = values[index];
      result.push(newDict);
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
