/*
 * Copyright 2017 data.world, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This product includes software developed at
 * data.world, Inc. (http://data.world/).
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { 
  Button,
  DropdownButton,
  Grid,
  MenuItem,
  Row
} from 'react-bootstrap';

import './DatasetsView.css';
import DatasetItem from './DatasetItem';

import Icon from './icons/Icon';

class DatasetsView extends Component {

  static propTypes = {
    createDataset: PropTypes.func,
    datasets: PropTypes.array,
    linkDataset: PropTypes.func
  }

  static defaultProps = {
    datasets: []
  }

  state = {
    sortKey: 'updated'
  }

  sortDatasets = () => {
    const sortKey = this.state.sortKey;
    const sortedDatasets = this.props.datasets.slice();
    const reverseSort = sortKey.indexOf('-') === 0;

    sortedDatasets.sort((a, b) => {
      if (sortKey.indexOf('title') >= 0) {
        if (a.title < b.title) {
          return reverseSort ?  1 : -1;
        } else if (a.title > b.title) {
          return reverseSort ? -1 : 1;
        }
        return 0;
      } else {
        let dateA, dateB;
        if (sortKey.indexOf('updated') >= 0) {
          dateA = new Date(a.updated);
          dateB = new Date(b.updated);
        } else {
          dateA = new Date(a.created);
          dateB = new Date(b.created);
        }
        return reverseSort ? dateA - dateB : dateB - dateA;
      }
    });
    return sortedDatasets;
  }

  sortChanged = (sortKey) => {
    this.setState({sortKey})
  }

  linkDataset = (dataset) => {
    this.props.linkDataset(dataset);
  }


  render () {
    const { sortKey } = this.state;
    const { datasets } = this.props;
    const sortedDatasets = this.sortDatasets();

    const datasetEntries = sortedDatasets.map((d) =>{
      return (<DatasetItem dataset={d} key={`${d.owner}/${d.id}`} buttonText='Link' buttonHandler={this.linkDataset} />);
    });

    return (
      <Grid className='datasets-view'>
        <div className='dataset-selector'>
          <Row className='center-block section-header'>
            <div className='title'>
              Select a dataset to link
              <Icon icon='add' onClick={this.props.createDataset} />
            </div>
          </Row>
          {!!datasets.length && 
            <Row className='center-block'>
              <div className='list-info'>
                {datasets.length} datasets
                <div className='pull-right sort-dropdown'>
                  <DropdownButton title='Sort' pullRight bsSize='small' onSelect={this.sortChanged} id='dropdown-sort-datasets'>
                    <MenuItem eventKey='updated' active={sortKey === 'updated'}><Icon icon='check' />Updated: Newest</MenuItem>
                    <MenuItem eventKey='-updated' active={sortKey === '-updated'}><Icon icon='check' />Updated: Oldest</MenuItem>
                    <MenuItem eventKey='created' active={sortKey === 'created'}><Icon icon='check' />Created: Newest</MenuItem>
                    <MenuItem eventKey='-created' active={sortKey === '-created'}><Icon icon='check' />Created: Oldest</MenuItem>
                    <MenuItem eventKey='title' active={sortKey === 'title'}><Icon icon='check' />Name: A - Z</MenuItem>
                    <MenuItem eventKey='-title' active={sortKey === '-title'}><Icon icon='check' />Name: Z - A</MenuItem>
                  </DropdownButton>
                </div>
              </div>
              <div>
                {datasetEntries}
                <Button className='bottom-button' onClick={this.props.createDataset}>Create a new dataset</Button>
              </div>
            </Row>}
          {!datasets.length && 
            <Row className='center-block no-datasets'>
              <div className='message'>
                You haven't created any datasets to link data to.
              </div>
              <Button className='bottom-button' bsStyle='primary' onClick={this.props.createDataset}>Create a new dataset</Button>
            </Row>
          }
        </div>
      </Grid>
    );
  }
}

export default DatasetsView;