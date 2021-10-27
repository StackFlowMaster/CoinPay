import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ScrollToTop from '../helpers/ScrollToTop';
import PrivateRoute from './private-route';
import Home from '../pages/Home';
import About from '../pages/About';
import Dashboard from '../layouts/Dashboard';
import NotFound from '../pages/NotFound';
import LoginRegister from '../pages/LoginRegister';
import AboutBitcoin from '../pages/AboutBitcoin';
import AdminRoutes from './admin-routes';
import Contact from '../pages/Contact';
import Team from '../pages/Team';
import EasyIntegration from '../pages/EasyIntegration';
function Routes() {
    return (
        <Router>
            <ScrollToTop>
                <Switch>
                    <Route 
                        exact 
                        path='/'
                        component={Home}
                    />
                    <Route 
                        path='/about'
                        component={About} 
                    />
                    <Route 
                        path='/about-bitcoin'
                        component={AboutBitcoin} 
                    />
                    <Route 
                        path='/contact'
                        component={Contact} 
                    />
                    <Route
                        path='/login-register'
                        component={LoginRegister}
                    />
                    <Route 
                        path='/admin'
                        component={AdminRoutes}
                    />
                    <Route 
                        path='/team'
                        component={Team}
                    />
                    <Route 
                        path='/api/v1/payment_crypto_form'
                        component={EasyIntegration}
                    /> 
                    <PrivateRoute 
                        path='/dashboard' 
                        component={Dashboard} 
                    />                    
                    <Route 
                        path="*" 
                        component={NotFound} 
                    />
                </Switch>
            </ScrollToTop>
        </Router>
    );
}

export default Routes;
