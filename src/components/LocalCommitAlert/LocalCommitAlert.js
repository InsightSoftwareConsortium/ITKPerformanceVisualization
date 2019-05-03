import Alert from 'react-bootstrap/Alert';
import React, { Component } from 'react';
import _ from 'lodash';

/**
 * Basic component for displaying an alert detailing which commits came from a local
 * data upload, if any. If no local data was uploaded, nothing is returned from this
 * component.
 *
 * Accepted props:
 *    -data: post-transformation data used to identify which commits are local
 */
export default class LocalCommitAlert extends Component {
  constructor(props){
    super(props);
    this.localCommits = [];
  }

  render() {
    var commitObjects = _.groupBy(this.props.data, value => value['CommitHash']);

    for(let commit in commitObjects) {
      for (let i = 0; i < commitObjects[commit].length; i++) {
        if (commitObjects[commit][i]['_local']) {
          this.localCommits = this.localCommits.concat(commit);
          break;
        }
      }
    }

    const localList = this.localCommits.map((commit) =>
      <li key={commit}>{commit}</li>
    );
    return (
      this.localCommits.length > 0 ?
        <Alert variant="primary">The following commits are local data which you uploaded:
          <ul>{localList}</ul>
        </Alert>
        :
        <div></div>
    );
  }
}
