import Routes from './routes';
import '../node_modules/font-awesome/css/font-awesome.css';
import {Provider} from 'react-redux';
import store from './store';
import setAuthToken from './utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import {setCurrentUser, logoutUser} from './actions/authActions'; 
if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;
  setAuthToken(token);
  const decoded = jwt_decode(token);
  store.dispatch(setCurrentUser(decoded));
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href='./login-register'
  }
}
function App() {
  return (
    <Provider store={store}>
      <Routes />
    </Provider>
    
  );
}

export default App;
