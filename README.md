ITK Performance Visualization
=============================

Overview
--------
ITK Performance Visualization is a web application designed to allow ITK contributors to compare performance of the library between different commits, system configurations, using the library's existing [performance benchmarks](https://github.com/InsightSoftwareConsortium/ITKPerformanceBenchmarking). Users can analyze both benchmark data uploaded locally, as well as pre-existing data from earlier commits on data.kitware.com.

The application is built in React and the latest version on master is deployed here:
https://itk-performance.netlify.com/

Local Installation Instructions
-------------------------------
[Node](https://nodejs.org/en/download/) and [Yarn](https://yarnpkg.com/lang/en/docs/install/) are required.

To run locally, run the following from the command line:
```
git clone https://github.com/InsightSoftwareConsortium/ITKPerformanceVisualization.git
cd ITKPerformanceVisualization
yarn install
yarn start
```
Then open http://localhost:3000/ in your browser.

Development Info
----------------
This application was initially developed in spring 2019 by undergraduate computer science majors at the University of North Carolina at Chapel Hill for a class project. The app's technical design document, which includes suggested information for future development, can be found <a href="https://docs.google.com/document/d/1KefTJq8YKsru8QNANrKbZxv_by-7HXmj5sYq4w7BOr0/edit?usp=sharing" target="_blank">here</a>, and more information on the app and its development can be found at the team's [course website](http://itkperformance.web.unc.edu/).
