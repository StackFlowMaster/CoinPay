import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropsTypes from 'prop-types';

const PrivateRoute = ({component: Component, auth, ...rest}) => (
    <Route
        {...rest}
        render={props => 
            (auth.authenticated === true && auth.userData.role === 'developer') ? (
                <Component {...props} />
            ) :  (
                <Redirect to='/login-register' />
            )
        } 
    />
);

PrivateRoute.propTypes = {
    auth: PropsTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);