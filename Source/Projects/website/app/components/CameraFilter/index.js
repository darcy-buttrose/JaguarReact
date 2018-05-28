import React, {Component} from 'react';



class CameraFilter extends Component {
    constructor () {
        super();
        this.state = {
          isHidden: true
        }
    }

    toggleHandler = () => {
        this.setState({
          isHidden: !this.state.isHidden
        })
    }    


    render(){
        let dropdownMenu = null;

        if(this.state.isHidden){
            dropdownMenu = (
                <ul>
                    <li>Abc</li>
                    <li>Abc1</li>
                    <li>Abc2</li>
                    <li>Abc3</li>
                </ul>
            )
        } else dropdownMenu = null;

        // return (
        //     <div>
        //         <button onClick={this.toggleHandler}>FF</button>
        //         {this.dropdownMenu}
        //     </div>
        // )
        return (<span>FF</span>);
    }
        
}




export default CameraFilter;

