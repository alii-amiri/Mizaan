import React, { Component } from 'react';
import { connect } from 'react-redux'
//import { Link } from 'react-router-dom'
import  createProject  from '../../actions/createProject'


class CreateProject extends Component {

    state = {
        name:'',
        description:'',
        goal:'',
        privKey:''
    }

    handleInputName = (event) => {
        this.setState({name:event.target.value})
    }
    handleInputDescription = (event) => {
        this.setState({description:event.target.value})
    }
    handleInputGoal = (event) => {
        this.setState({goal:event.target.value})
    }
    handleInputPrivKey = (event) => {
        this.setState({privKey:event.target.value})
    }

    submitForm = (e) => {
        e.preventDefault();
        this.props.dispatch(createProject({
            name:this.state.name,
            description: this.state.description,
            goal: this.state.goal,
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
                        value={this.state.name}
                        onChange={(event)=>this.handleInputName(event)}
                    />
                    </div>
                    <div className="form_element">
                    <input 
                        type="text"
                        placeholder="توضیح پروژه"
                        value={this.state.description}
                        onChange={(event)=>this.handleInputDescription(event)}
                    />
                    </div>
                    <div className="form_element">
                    <input 
                        type="text"
                        placeholder="هدف پروژه"
                        value={this.state.goal}
                        onChange={(event)=>this.handleInputGoal(event)}
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
        name:state.name,
        description:state.description,
        goal:state.goal,
        privKey:state.privKey
    }
}

export default connect(mapStateToProps)(CreateProject)