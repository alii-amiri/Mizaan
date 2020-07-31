import React , { Component  } from 'react'
import  auth  from '../actions/auth'
import {connect} from 'react-redux'

export default function(ComposedClass,reload){
    class AuthenticationCheck extends Component {
        
        state = {
            loading:true
        }

        componentWillMount(){
            this.props.dispatch(auth())
        }

        componentWillReceiveProps(nextProps){
            this.setState({loading:false})

            if(!nextProps.user.login.isAuth){
                if (reload){
                  this.props.history.push('/login');
                }
            } else {
                if (reload === false) {
                this.props.history.push('/dashboard')
                }
            } 
        }
    
        
        render(){
            if (this.state.loading){
                return <div className="loader"> در حال پردازش </div>
            }
            return(
                <ComposedClass {...this.props} user={this.props.user}/>
            )
        }
    }

    function  mapStateToProps(state){
        return {
            user:state.user
        }
    }
    return connect(mapStateToProps)(AuthenticationCheck)
}