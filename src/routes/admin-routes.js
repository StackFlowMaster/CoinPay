import {Route, Switch} from 'react-router-dom';
import Login from '../pages/admin/Login';
import Register from '../pages/admin/Register';
import PrivateRoute from './admin-private';
import AdminDash from '../layouts/AdminDash';

const AdminRoutes = ({match}) => {
    return(
        <Switch>
            <Route 
                exact
                path={match.path}
                component={Login}
            />
            <Route 
                exact
                path={`${match.path}/login`}
                component={Login}
            />
            <Route 
                exact
                path={`${match.path}/register`}
                component={Register}
            />
            <PrivateRoute 
                path={`${match.path}/dashboard`}
                component={AdminDash}
            />
        </Switch>
    );
}
export default AdminRoutes;