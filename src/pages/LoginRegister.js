import React, { Fragment } from "react";
import MetaTags from "react-meta-tags";
import { Link } from "react-router-dom";
import Layout from "../layouts/Layout";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Breadcrumb from "../components/breadcrumbs/Breadcrumb";
import {connect} from 'react-redux';
import {registerUser, loginUser} from '../actions/authActions';
import {FaInfoCircle} from 'react-icons/fa';
import Dialog from '@material-ui/core/Dialog';
export function setRegisterDataFormat(state) {
  var userData = {
    name: state.name,
    email: state.email,
    password: state.password,
    password2: state.password2,
    role: 'developer',
  }
  return userData;
}
export function setLoginDataFormat(state) {
  var userData = {
    email: state.email,
    password: state.password,
    role: 'developer'
  }
  return userData;
}
class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      password2:'',
      name: '',
    }
  }
  componentDidMount() {
    if(this.props.authenticated && this.props.userData.role === 'developer') {
      this.props.history.push('/dashboard/dashboard');
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.authenticated && nextProps.userData.role === 'developer') {
      this.props.history.push('/dashboard/dashboard');
    }
  }
  handleLogin() {
    this.props.loginUser(setLoginDataFormat(this.state));
    this.setClear();
  }
  handleRegister() {
    this.props.registerUser(setRegisterDataFormat(this.state), this.props.history);
    this.setClear();
  }
  setClear() {
    this.setState({email: '', password: '', password2: '', name: ''});
  }
  render() {
    return (
      <Fragment>
        <MetaTags>
          <title>CoinPay | Login</title>
        </MetaTags>
            <Layout theme="white">
          {/* breadcrumb */}
          <Breadcrumb title="LOGIN - REGISTER" />
          {/* login register content */}
          <div className="dg__account section-padding--xl">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <Tab.Container defaultActiveKey="login">
                    <Nav
                      variant="pills"
                      className="acount__nav justify-content-center"
                    >
                      <Nav.Item>
                        <Nav.Link eventKey="login">Login</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="register">Register</Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="login">
                        <div className="single__account">
                            <div className="input__box">
                              <span>Email Address</span>
                              <input type="email" value = {this.state.email} onChange={(e) => {this.setState({email: e.target.value})}} />
                            </div>
                            <div className="input__box">
                              <span>Password</span>
                              <input type="password" value = {this.state.password} onChange={(e) => {this.setState({password: e.target.value})}} />
                            </div>
                            <Link
                              className="forget__pass"
                              to={process.env.PUBLIC_URL + "/"}
                            >
                              Lost your password?
                            </Link>
                            <button className="account__btn" type="button" onClick={() => {this.handleLogin();}}>Login</button>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="register">
                        <div className="single__account">
                          <div className="input__box">
                            <span>User Name</span>
                            <input type="text" value = {this.state.name} onChange = {(e) => {this.setState({name: e.target.value})}} />
                          </div>
                          <div className="input__box">
                            <span>Email address</span>
                            <input type="email" value = {this.state.email} onChange = {(e) => { this.setState({email: e.target.value})}} />
                          </div>
                          <div className="input__box">
                            <span>Password</span>
                            <input type="password" value = {this.state.password} onChange = {(e) => { this.setState({password: e.target.value})}}/>
                          </div>
                          <div className="input__box">
                            <span>Confirm Password</span>
                            <input type="password" value = {this.state.password2} onChange = {(e) => { this.setState({password2: e.target.value})}}/>
                          </div>
                          <button className="account__btn" onClick={() => {this.handleRegister()}}>Register</button>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                  {this.props._isErr && (<><FaInfoCircle />{this.props._errMsg}</>)}
                </div>
              </div>
            </div>
          </div>
          <Dialog aria-labelledby="simple-dialog-title" open={this.props.fetching}>
              <div className="loading_dlg_container">
                <div className="loading_logo_area">
                  <img
                    src={process.env.PUBLIC_URL + "/images/loading.gif"}
                    className="loading_logo"
                    alt="secure images"
                  />
                </div>
                <div className="loading_text_area">
                  <h5> Please wait for while creating wallet... </h5>
                </div>
              </div>
          </Dialog>
        </Layout>
      </Fragment>
    );
  }
}
const mapStateToProps = (store) => {
  const {authenticated, userData, fetching, test} = store.auth;
  const {_isErr, _errMsg} = store.errors;
  return {authenticated, userData, _isErr, _errMsg, fetching, test};
}
export default connect(mapStateToProps, {registerUser, loginUser})(LoginRegister);
