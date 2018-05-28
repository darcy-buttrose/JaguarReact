import React, {Component} from 'react';
import PropTypes from 'prop-types';


class CameraFilter extends Component {
    constructor () {
        super();

        this.state = {
            filters: [
                {
                    id: 1,
                    name: 'Filter name 1'
                },
                {
                    id: 2,
                    name: 'Filter name 2'
                },
                {
                    id: 3,
                    name: 'Filter name 3'
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
                    {/* <li>{props.username}</li>
                    <hr />
                    <li
                    onClick={props.onLogout}
                    role="presentation"
                    ><FormattedMessage {...messages.logoff} /></li>
                    <hr />
                    <li
                    className={(props.currentTheme === 'daylight') ? 'app-profile-menu-selected' : 'app-profile-menu-item'}
                    onClick={() => { props.onChangeTheme('daylight'); }}
                    role="presentation"
                    ><FormattedMessage {...messages.daylight} /></li>
                    <li
                    className={(props.currentTheme === 'night') ? 'app-profile-menu-selected' : 'app-profile-menu-item'}
                    onClick={() => { props.onChangeTheme('night'); }}
                    role="presentation"
                    ><FormattedMessage {...messages.night} /></li> */}
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

