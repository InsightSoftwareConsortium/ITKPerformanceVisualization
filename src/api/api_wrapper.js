//import DataTransformationInstance from "./data_transformation"

class Api {
    constructor() {
        //this.DataTransformation = DataTransformationInstance.instance;
        this.url = "https://data.kitware.com/api/v1/";
        this.benchmarkCollectionID = "5af50c818d777f06857985e3";
        this.sampleBenchmark = "5afa58378d777f0685798c5c";
    }

    /*
    Queries the Kitware backend for a directory of all files and folders
    in the IKPerformanceBenchmarkingCollection.
    Returns an array of folders and files containing IDs and Names
    Example
    [
        {
            name: "Folder1",
            id: "abc",
            contents: [
                {
                    name: "item1",
                    id: "xyz"
                }
            ]
        }
    ]
    */
    getItem(id, callback) {
        // Create Request
        if (id == null) id = this.sampleBenchmark;
        let URL = this.url + "item/" + id + "/download";

        fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
        .then(json => callback(json))
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