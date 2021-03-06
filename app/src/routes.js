import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Home from './components/Home/home'
import User from './components/Admin'
import Layout from './hoc/layout'
import AuthenticationCheck from './hoc/auth'
import Login from './containers/admin/login'
import Logout from './components/Admin/logout'
import ChargeAccount from './components/transactions/chargeAccount'
import DonateProject from './components/transactions/donateProject'
import CreateProject from './components/transactions/createProject'
import Register from './containers/admin/register'
import ChangePassword from './components/Admin/changePassword'

const Routes = ()=>{
    return (
        <Layout>
            <Switch>
                <Route path="/" exact component={AuthenticationCheck(Home,null)}/>
                <Route path="/login" exact component={AuthenticationCheck(Login,false)}/>
                <Route path="/logout" exact component={AuthenticationCheck(Logout,true)}/>
                <Route path="/register" exact component={Register}/>
                <Route path="/changePassword" exact component={AuthenticationCheck(ChangePassword, true)}/>
                <Route path="/dashboard" exact component={AuthenticationCheck(User,true)}/>
                <Route path="/chargeAccount" exact component={AuthenticationCheck(ChargeAccount,true)}/>
                <Route path="/createProject" exact component={AuthenticationCheck(CreateProject,true)}/>
                <Route path="/donateProject" exact component={AuthenticationCheck(DonateProject,true)}/>
              </Switch>
        </Layout>
    )
}

export default Routes;
