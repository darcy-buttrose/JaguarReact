import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';


class CameraFilter extends PureComponent {
  render() {
    const currentFilter = this.props.filters.find((f) => f.id === this.props.filter);

    const renderFilter = (el) => (
      <li
        key={el.id}
        className={(currentFilter === el) ? 'app-camerafilter-menu-selected' : 'app-camerafilter-menu-item'}
        onClick={() => {
          this.props.onChangeFilter(el.id);
        }}
        role="presentation"
      >
        {el.name}
      </li>
    );


    let cameraFilter = (
      <span>
        <span
          className="fas fa-filter fa-2x"
          role="presentation"
        />
        <ul className="app-camerafilter-menu">
          {this.props.filters.map(renderFilter)}
        </ul>
      </span>
    );
    if (this.props.position === 'footer' && !this.props.liveWallFullScreen) {
      cameraFilter = (
        <span>
          <span
            className="fas fa-filter fa-lg"
            role="presentation"
          />
          <ul className="app-camerafilter-menu-dropup">
            {this.props.filters.map(renderFilter)}
          </ul>
        </span>
      );
    }

    return (
      <span className="app-camerafilter">
        {cameraFilter}
      </span>
    );
  }

}

CameraFilter.propTypes = {
  filter: PropTypes.number,
  filters: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  })),
  onChangeFilter: PropTypes.func,
  position: PropTypes.string,
  liveWallFullScreen: PropTypes.bool,
};


export default CameraFilter;

