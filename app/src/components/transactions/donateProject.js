import React, { Component } from 'react';
import { connect } from 'react-redux'
//import { Link } from 'react-router-dom'
import  donateProject  from '../../actions/donateProject'


class DonateProject extends Component {

    state = {
        project:'',
        amount:'',
        privKey:''
    }

    handleInputProject = (event) => {
        this.setState({project:event.target.value})
    }
    handleInputPrivKey = (event) => {
        this.setState({privKey:event.target.value})
    }
    handleInputAmount = (event) => {
        this.setState({amount: event.target.value})
    }

    submitForm = (e) => {
        e.preventDefault();
        this.props.dispatch(donateProject({
            amount:this.state.amount,
            project: this.state.project,
            privKey:this.state.privKey
        }))
    }

    componentWillReceiveProps(){
        this.props.history.push('/dashboard')
    }

    render() {
        return (
            <div className="rl_container coin">
                <form onSubmit={this.submitForm} >
                    <h2>
                        مقدار دلخواه را وارد نمایید
                    </h2>
                    <div className="form_element">
                    <input 
                        type="text"
                        placeholder="نام پروژه"
                        value={this.state.project}
                        onChange={(event)=>this.handleInputProject(event)}
                    />
                    </div>
                    <div className="form_element">
                    <input 
                        type="text"
                        placeholder="میزان کمک"
                        value={this.state.amount}
                        onChange={(event)=>this.handleInputAmount(event)}
                    />
                    </div>
                    <div className="form_element">
                    <input 
                        type="password"
                        placeholder=" کلید خصوصی خود را وارد نمایید"
                        value={this.state.privKey}
                        onChange={(event)=>this.handleInputPrivKey(event)}
                    />
                    </div>

                    <button type="submit"> ارسال  </button>
                </form>
                
            </div>
        );
    }
}



function  mapStateToProps(state) {
    return {
        project:state.project,
        amount:state.amount,
        privKey:state.privKey
    }
}

export default connect(mapStateToProps)(DonateProject)