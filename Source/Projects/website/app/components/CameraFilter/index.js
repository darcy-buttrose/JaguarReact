import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';


class CameraFilter extends PureComponent {
  render() {
    const currentFilter = this.props.filters.find((f) => f.id === this.props.filter);

    const renderFilter = (el) => (
      <li
        key={el.id}
        className={(currentFilter === el) ? 'app-profile-menu-selected' : 'app-profile-menu-item'}
        onClick={() => {
          this.props.onChangeFilter(el.id);
        }}
        role="presentation"
      >
        {el.name}
      </li>
    );

    return (
      <span className="app-profile">
        <span
          className="fas fa-filter fa-2x"
          role="presentation"
        />
        <ul className="app-profile-menu">
          {this.props.filters.map(renderFilter)}
        </ul>
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
};


export default CameraFilter;

