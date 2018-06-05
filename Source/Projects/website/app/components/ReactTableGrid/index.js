import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import _ from 'lodash';

const trainedTime = (minutes) => `${minutes}m`;

const numberToColour = (colourId) => {
  switch (colourId) {
    case 77: return 'blue';
    case 54: return 'red';
    case 21: return 'green';
    default: return 'none';
  }
};

const flagCell = (flagColour) => flagColour !== 'none' ? <span className="fas fa-flag" style={{ color: flagColour }} /> : null;
const filmCell = (filmColour) => filmColour !== 'none' ? <span className="fas fa-film" style={{ color: filmColour }} /> : null;
const tvCell = (tvColour) => tvColour !== 'none' ? <span className="fas fa-tv" style={{ color: tvColour }} /> : null;
const boltCell = (boltColour) => boltColour !== 'none' ? <span className="fas fa-bolt" style={{ color: boltColour }} /> : null;
const sunCell = (sunColour) => sunColour !== 'none' ? <span className="fas fa-sun" style={{ color: sunColour }} /> : null;
const lightBulbCell = (lightBulbColour) => lightBulbColour !== 'none' ? <span className="fas fa-lightbulb" style={{ color: lightBulbColour }} /> : null;
const attrFilter = ({filter, onChange}) => (
  <select
    onChange={(event) => onChange(event.target.value)}
    style={{ width: '100%' }}
    value={filter ? filter.value : ''}
  >
    <option value="">All</option>
    <option value="red">Red</option>
    <option value="green">Green</option>
    <option value="orange">Orange</option>
  </select>);
const flagFilter = ({filter, onChange}) => (
  <select
    onChange={(event) => onChange(event.target.value)}
    style={{ width: '100%' }}
    value={filter ? filter.value : ''}
  >
    <option value="">All</option>
    <option value="77">Blue</option>
    <option value="54">Red</option>
    <option value="21">Green</option>
  </select>);

const columnsDef = [
  {
    Header: 'Camera',
    columns: [
      {
        Header: 'Id',
        accessor: 'id',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Trained',
        id: 'trainedMinutes',
        accessor: (d) => trainedTime(d.trainedMinutes),
      },
      {
        Header: () => <span className="fas fa-flag" />,
        accessor: 'flagsColour',
        Cell: (row) => flagCell(numberToColour(row.value)),
        Filter: flagFilter,
      },
    ],
  },
  {
    Header: 'Attributes',
    columns: [
      {
        Header: () => <span className="fas fa-film" />,
        accessor: 'attr1',
        Cell: (row) => filmCell(row.value),
        Filter: attrFilter,
      },
      {
        Header: () => <span className="fas fa-tv" />,
        accessor: 'attr2',
        Cell: (row) => tvCell(row.value),
        Filter: attrFilter,
      },
      {
        Header: () => <span className="fas fa-bolt" />,
        accessor: 'attr3',
        Cell: (row) => boltCell(row.value),
        Filter: attrFilter,
      },
      {
        Header: () => <span className="fas fa-sun" />,
        accessor: 'attr4',
        Cell: (row) => sunCell(row.value),
        Filter: attrFilter,
      },
      {
        Header: () => <span className="fas fa-lightbulb" />,
        accessor: 'attr5',
        Cell: (row) => lightBulbCell(row.value),
        Filter: attrFilter,
      },
    ],
  },
];

class ReactTableGrid extends React.PureComponent {
  render() {
    return (
      <ReactTable
        data={this.props.cameraList}
        filterable
        columns={columnsDef}
        defaultPageSize={10}
        className="-striped -highlight"
      />
    );
  }
}

ReactTableGrid.propTypes = {
  cameraList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    trainedMinutes: PropTypes.number,
    flagsColour: PropTypes.number,
    attr1: PropTypes.string,
    attr2: PropTypes.string,
    attr3: PropTypes.string,
    attr4: PropTypes.string,
    attr5: PropTypes.string,
  })),
};

export default ReactTableGrid;
