import DataTransformation from './DataTransformation.js';
import mockRawData from './BenchmarkRawTestData.json';
import mockParsedData from './BenchmarkParsedTestData.json';

const Dti = DataTransformation.instance;

describe('When parseBenchmarkJson is called', () => {
  it('returns parsed data with values', () => {
    const benchmarkName = mockParsedData[0]["BenchmarkName"];
    const res = Dti.parseBenchmark(benchmarkName, mockRawData);
    expect(res).toEqual(mockParsedData);
  })
  it('returns parsed data with local = true', () => {
    const benchmarkName = mockParsedData[0]["BenchmarkName"];
    const localParsedData = Object.assign({}, mockParsedData);
    for (let item in localParsedData) {
      localParsedData[item]["_local"] = true;
    }
    const res = Dti.parseBenchmark(benchmarkName, mockRawData, true);
    expect(res).toEqual(mockParsedData);
  })
  it('returns empty array if necessary key is missing', () => {
    const removedKeyParent = "SystemInformation";
    const removedKey = "System";

    //clone and remove key from raw data
    let rawDataCopy = Object.assign({}, mockRawData);
    delete rawDataCopy[removedKeyParent][removedKey];

    const benchmarkName = mockParsedData[0]["BenchmarkName"];
    const res = Dti.parseBenchmark(benchmarkName, rawDataCopy);
    expect(res).toEqual([]);
  })
  it('returns empty array when value array is missing', () => {
    const removedKeyParent = "Probes";
    const removedKey = "Values";

    //clone and remove key from raw data
    let rawDataCopy = Object.assign({}, mockRawData);
    delete rawDataCopy[removedKeyParent][0][removedKey];

    const res = Dti.parseBenchmark("", rawDataCopy);
    expect(res).toEqual([]);
  })
  it('returns empty array when benchmarkJson param is empty', () => {
    const res = Dti.parseBenchmark("", {});
    expect(res).toEqual([]);
  })
  it('returns null when benchmarkJson param is null', () => {
    const res = Dti.parseBenchmark("", null);
    expect(res).toEqual([]);
  })
  it('returns null when benchmarkJson param is undefined', () => {
    const res = Dti.parseBenchmark("", undefined);
    expect(res).toEqual([]);
  })
})