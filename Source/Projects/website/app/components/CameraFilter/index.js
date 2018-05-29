import React, {Component} from 'react';
import PropTypes from 'prop-types';


class CameraFilter extends Component {
    constructor () {
        super();

        this.state = {
            filters: [
                {
                    "id": 0,
                    "name": "All cameras"
                },
                {
                    "id": 5,
                    "name": "Glitchy"
                },
                {
                    "id": 4,
                    "name": "internal"
                },
                {
                    "id": 1,
                    "name": "milestone-all"
                },
                {
                    "id": 2,
                    "name": "milestone-pta"
                },
                {
                    "id": 3,
                    "name": "milestone-swinburne"
                }
            ]
        }
    }

    // toggleHandler = () => {
    //     this.setState({
    //       isHidden: !this.state.isHidden
    //     })
    // }    


    render(){
        const currentFilter = this.state.filters.find( (f)=> f.id === this.props.filter )

        const renderFilter = (el) => (
                <li key={el.id}
                    className={(currentFilter === el) ? 'app-profile-menu-selected' : 'app-profile-menu-item'}
                    onClick={() => { this.props.onChangeFilter(el.id); }}
                    role="presentation">{el.name}</li>  
            );

        return (
            <span className="app-profile">
                <span
                    className="fas fa-filter fa-2x"
                    role="presentation"></span>
                <ul className="app-profile-menu">
                    {this.state.filters.map(renderFilter)}
                </ul>
            </span>
        )
    }
        
}

CameraFilter.propTypes = {
    filter: PropTypes.number,
    onChangeFilter: PropTypes.func
}


export default CameraFilter;

