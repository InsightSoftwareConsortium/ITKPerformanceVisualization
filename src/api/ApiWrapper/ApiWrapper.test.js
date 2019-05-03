import ApiWrapper from './ApiWrapper.js';

const Api = ApiWrapper.instance;

const mockFolderId = "folderId";
const mockBenchmarkId = "benchmarkId";
const mockFolderUrl = "https://data.kitware.com/api/v1/item?folderId=folderId";
const mockBenchmarkUrl = "https://data.kitware.com/api/v1/item/benchmarkId/download";
const mockBenchmarkName = "1234_1234_name.json";
const mockParsedBenchmarkName = "name";
const mockFolderRes = [
    {
        id: mockBenchmarkId,
        name: "benchmark1"
    },
    {
        id: mockBenchmarkId,
        name: "benchmark2"
    }
];
const expectedGetFolderRes = [
    {
        name: "benchmark1"
    },
    {
        name: "benchmark2"
    }
];
const mockBenchmarkData = {
    name: mockParsedBenchmarkName
};

describe('When getBenchmarkData is called', () => {
    let mockApi = Object.assign(Object.create(Object.getPrototypeOf(Api)),Api);
    let getUrlParameter = "";
    let parsedName = "";
    beforeAll(() => {
        mockApi.GET = function(url, callback) {
            getUrlParameter = url;
            callback(mockFolderRes);
        };
        mockApi.transformer = {
            parseBenchmark: (name, benchmark) => {
                parsedName = mockParsedBenchmarkName;
                return mockBenchmarkData;
            }
        };
    });
    it('returns parsed benchmark data', done => {
        let callback = function(res) {
            expect(res).toEqual(mockBenchmarkData);
            expect(getUrlParameter).toEqual(mockBenchmarkUrl);
            expect(parsedName).toEqual(mockParsedBenchmarkName);
            done();
        };
        let failure = function(res) {
            throw new Error("Unexpected error: " + res);
        };
        mockApi.getBenchmarkData(mockBenchmarkId, mockBenchmarkName, callback, failure);
    });
    it('triggers failure callback if get request is null', done => {
        let callback = function(res) {
            throw new Error("Unexpected callback: " + res);
        };
        let failure = function(res) {
            expect(res).not.toBeNull();
            expect(res.message).toContain(mockBenchmarkId);
            done();
        };
        mockApi.GET = function(url, callback) {
            callback(null);
        };
        
        mockApi.getBenchmarkData(mockBenchmarkId, mockBenchmarkName, callback, failure);
    })
});

describe('When ApiInstance is called', () =>{
    it('returns singleton Api object', () => {
        const reference1 = ApiWrapper.instance;
        const reference2 = ApiWrapper.instance;
        expect(reference1).toBe(reference2);
    })
});