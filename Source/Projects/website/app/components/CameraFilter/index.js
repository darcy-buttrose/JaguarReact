import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import cameraFilterPropTypes from './propTypes';


class CameraFilter extends PureComponent {
  render() {
    const currentFilter = this.props.filters.find((f) => f.id === this.props.filter);
    const totalNumOfCameras = this.props.filters.length > 1 ? this.props.filters[1].total_num_cameras : 0;
    const renderFilterList = (filter) => (
      <li
        key={filter.id}
        className={(currentFilter === filter) ? 'app-camerafilter-menu-selected' : 'app-camerafilter-menu-item'}
        onClick={() => {
          this.props.onChangeFilter(filter.id);
        }}
        role="presentation"
      >
        {filter.name} ({filter.id === 0 ? totalNumOfCameras : filter.view_num_cameras })
      </li>
    );


    let filterIconSize = 'fa-2x';
    let filterMenuClass = 'app-camerafilter-menu';
    if (this.props.position === 'footer' && !this.props.liveWallFullScreen) {
      filterIconSize = 'fa-lg';
      filterMenuClass = 'app-camerafilter-menu-dropup';
    }

    const cameraFilter = (
      <span>
        <span
          className={`fas fa-filter ${filterIconSize}`}
          role="presentation"
        />
        <ul className={filterMenuClass}>
          {this.props.filters.map(renderFilterList)}
        </ul>
      </span>
    );

    return (
      <span className="app-camerafilter">
        {cameraFilter}
      </span>
    );
  }

}

CameraFilter.propTypes = {
  filter: PropTypes.number,
  filters: PropTypes.arrayOf(PropTypes.shape(cameraFilterPropTypes)),
  onChangeFilter: PropTypes.func,
  position: PropTypes.string,
  liveWallFullScreen: PropTypes.bool,
};


export default CameraFilter;

