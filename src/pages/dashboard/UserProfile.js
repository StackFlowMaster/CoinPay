import React, {useEffect, useState} from "react";
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import Card from '../../components/Card/Card';
import CardBody from '../../components/Card/CardBody';
import CardHeader from '../../components/Card/CardHeader';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {useSelector, useDispatch} from 'react-redux';
import {getProfile, updateProfile} from '../../actions/profileActions';
import {setTwoFactor} from '../../actions/authActions';
import {updatePwd} from '../../actions/authActions';
import isEmpty from 'is-empty';
import axios from 'axios';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function UserProfile() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {userData, userProfile, existProfile, isPwdUpdated, pwdUpdateSuccess, twoFactor }=useSelector((state) => state.auth);
  const [value, setValue] = useState('1');
  // const [_2fa_enabled, set2faEnable] = useState(false);
  const [_email_enabled, setEmailEnable] = useState();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [zipCode, setZipcode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [conPwd, setConPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [isErr, setErr] = useState(false);

  const handleChangePwd = () => {
    if(isEmpty(oldPwd)) { 
      setErrMsg('please fill old password');
      setErr(true);
      return;
    }
    if(isEmpty(newPwd)) {
      setErrMsg('please fill new password');
      setErr(true);
      return;
    }
    if(newPwd.length < 6) {
      setErrMsg('password must be more than 6 letters');
      setErr(true);
      return;
    }
    if(isEmpty(conPwd)) {
      setErrMsg('please fill confirm password');
      setErr(true);
      return;
    }
    if(conPwd !== newPwd) {
      setErrMsg('password no match');
      setErr(true);
      return;
    }
    const data = {
      userId: userData.userId,
      oldPwd: oldPwd,
      newPwd: newPwd
    }
    dispatch(updatePwd(data));
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const mailCheckEnable = () => {
    const data = {
      userId: userData.userId,
      status: true
    }
    dispatch(setTwoFactor(data));
    setEmailEnable(true);
  }

  const mailCheckDisable = () => {
    const data = {
      userId: userData.userId,
      status: false
    }
    dispatch(setTwoFactor(data));
    setEmailEnable(false);
  }
  
  useEffect(() => {
    dispatch(getProfile({userId: userData.userId}));
  }, []);

  const handleUpdate = () => {
    var profile = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      address1: address1,
      address2: address2,
      zipCode: zipCode,
      city: city,
      state: state,
      country: country,
      contactNumber: contactNumber,
      userId: userData.userId
    }
    const type = existProfile ? 'update' : 'add';
    dispatch(updateProfile(profile, type));
  }
  return (
    <div className={classes.root}>
      <TabContext value={value}>
        <AppBar position="static">
          <TabList onChange={handleChange} aria-label="simple tabs example" variant="fullWidth">
            <Tab label="General" value="1" />
            <Tab label="Set 2FA" value="2" />
          </TabList>
        </AppBar>
        <TabPanel value="1">
          <Container>
            <Row>
              {existProfile && (
                <Card>
                  <CardHeader>
                    <h3>User Profile</h3>
                  </CardHeader>
                  <CardBody>
                    <Container>
                      <Row>
                        <Col xs={12} sm={4} md={4}>
                          <h5>First Name</h5> {userProfile.firstName}
                        </Col>
                        <Col xs={12} sm={4} md={4}>
                          <h5>Last Name</h5> {userProfile.lastName}
                        </Col>
                        <Col xs={12} sm={4} md={4}>
                          <h5>E-mail</h5> {userProfile.email}
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12} sm={4} md={4}>
                          <h5>Address1</h5> {userProfile.address1}
                        </Col>
                        <Col xs={12} sm={4} md={4}>
                          <h5>Address2</h5> {userProfile.address2}
                        </Col>
                        <Col xs={12} sm={4} md={4}>
                          <h5>ZipCode</h5> {userProfile.zipCode}
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12} sm={4} md={4}>
                          <h5>City</h5> {userProfile.city}
                        </Col>
                        <Col xs={12} sm={4} md={4}>
                          <h5>State</h5> {userProfile.state}
                        </Col>
                        <Col xs={12} sm={4} md={4}>
                          <h5>Country</h5> {userProfile.country}
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12} sm={4} md={4}>
                          <h5>Contract Number</h5> {userProfile.contactNumber}
                        </Col>
                      </Row>
                    </Container>
                  </CardBody>
                </Card>
              )}
              <Card>
                <CardHeader>
                  <h3 color="primary"> Edit Profile </h3>
                </CardHeader>
                <CardBody>
                  <Container>
                    <Row>
                      <Col xs={12} sm={4} md={4}>
                        <TextField
                          margin="dense"
                          id="firstname"
                          label="First Name"
                          type="text"
                          fullWidth
                          variant='outlined'
                          value={firstName}
                          onChange={(e) => {setFirstName(e.target.value)}}
                          required
                        />
                      </Col>
                      <Col xs={12} sm={4} md={4}>
                        <TextField
                          margin="dense"
                          id="lastname"
                          label="Last Name"
                          type="text"
                          fullWidth
                          variant='outlined'
                          value={lastName}
                          onChange={(e) => {setLastName(e.target.value)}}
                          required
                        />
                      </Col>
                      <Col xs={12} sm={4} md={4}>
                        <TextField
                          margin="dense"
                          id="email"
                          label="Email"
                          type="text"
                          fullWidth
                          variant='outlined'
                          value={email}
                          onChange={(e) => {setEmail(e.target.value)}}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={12} md={12}>&nbsp;</Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={4} md={4}>
                        <TextField
                          margin="dense"
                          id="address1"
                          label="Address Line1"
                          type="text"
                          fullWidth
                          variant='outlined'
                          value={address1}
                          onChange={(e) => {setAddress1(e.target.value)}}
                        />
                      </Col>
                      <Col xs={12} sm={4} md={4}>
                        <TextField
                          margin="dense"
                          id="address2"
                          label="Address Line2"
                          type="text"
                          fullWidth
                          variant='outlined'
                          value={address2}
                          onChange={(e) => {setAddress2(e.target.value)}}
                        />
                      </Col>
                      <Col xs={12} sm={4} md={4}>
                        <TextField
                          margin="dense"
                          id="zipcode"
                          label="Zipcode"
                          type="text"
                          fullWidth
                          variant='outlined'
                          value={zipCode}
                          onChange={(e) => {setZipcode(e.target.value)}}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={12} md={12}>&nbsp;</Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={4} md={4}>
                        <TextField
                          margin="dense"
                          id="city"
                          label="City"
                          type="text"
                          fullWidth
                          variant='outlined'
                          value={city}
                          onChange={(e) => {setCity(e.target.value)}}
                        />
                      </Col>
                      <Col xs={12} sm={4} md={4}>
                        <TextField
                          margin="dense"
                          id="state"
                          label="State"
                          type="text"
                          fullWidth
                          variant='outlined'
                          value={state}
                          onChange={(e) => {setState(e.target.value)}}
                        />
                      </Col>
                      <Col xs={12} sm={4} md={4}>
                        <TextField
                          margin="dense"
                          id="country"
                          label="Country"
                          type="text"
                          fullWidth
                          variant='outlined'
                          value={country}
                          onChange={(e) => {setCountry(e.target.value)}}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={12} md={12}>&nbsp;</Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={4} md={4}>
                        <TextField
                          margin="dense"
                          id="phone"
                          label="Mobile Number"
                          type="text"
                          fullWidth
                          variant='outlined'
                          value={contactNumber}
                          onChange={(e) => {setContactNumber(e.target.value)}}
                        />
                      </Col>
                      <Col xs={12} sm={6} md={6}></Col>
                      <Col xs={12} sm={2} md={2}>
                        <Button color="primary" variant="contained" onClick={() => {handleUpdate();}}>
                          {existProfile ? (<>Update</>) : (<>Add</>)}
                        </Button>
                      </Col>
                    </Row>
                  </Container>
                </CardBody>
              </Card>
            </Row>
          </Container>
          <Container>
            <Row>
              <Card>
                <CardHeader>
                  <h3 color="primary"> Change Password </h3>
                </CardHeader>
                <CardBody>
                  <Container>
                    <Row>
                      <Col xs={12} sm={4} md={4}>
                        <TextField
                          margin="dense"
                          id="old_password"
                          label="Old Password"
                          type="password"
                          fullWidth
                          variant='outlined'
                          required
                          value={oldPwd}
                          onChange={(e) => {setOldPwd(e.target.value)}}
                        />
                      </Col>
                      <Col xs={12} sm={4} md={4}>
                        <TextField
                          margin="dense"
                          id="new_password"
                          label="New Password"
                          type="password"
                          fullWidth
                          variant='outlined'
                          value={newPwd}
                          onChange={(e) => {setNewPwd(e.target.value)}}
                          required
                        />
                      </Col>
                      <Col xs={12} sm={4} md={4}>
                        <TextField
                          margin="dense"
                          id="confirm_password"
                          label="Confirm Password"
                          type="password"
                          fullWidth
                          variant='outlined'
                          required
                          value={conPwd}
                          onChange={(e) => {setConPwd(e.target.value)}}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={12} md={12}>&nbsp;</Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={12} md={12}>{isErr && <>{errMsg}</>}</Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={4} md={4}>
                        <Button color="primary" variant="contained" onClick={() => {handleChangePwd()}}>
                          Update
                        </Button>
                      </Col>
                      <Col xs={12} sm={8} md={8}></Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={12} md={12}>
                          {isPwdUpdated && (<>{pwdUpdateSuccess}</>)}
                      </Col>
                    </Row>
                  </Container>
                </CardBody>
              </Card>
            </Row>
          </Container>        
        </TabPanel>
        <TabPanel value="2">
          <Card>
            <CardBody>
              <Container>
                {/* <Row>
                  <Col xs={12} sm={9} md={9}>
                    <h5>TwoFactor Google Authentication {!_2fa_enabled ? '( Disabled )' : '( Enabled )'} </h5>
                  </Col>
                  <Col xs={12} sm={3} md={3}>
                    {!_2fa_enabled ? (
                      <Button color="primary" variant="contained">
                        Enable
                      </Button>
                    ):(
                      <Button color="secondary" variant="contained">
                        Disable
                      </Button>
                    )}
                  </Col>
                </Row> */}
                <Row><Col xs={12} sm={12} md={12}>&nbsp;</Col></Row>
                <Row>
                  <Col xs={12} sm={9} md={9}>
                    <h5>Email Code Verification {!twoFactor? '( Disabled )' : '( Enabled )'} </h5>
                  </Col>
                  <Col xs={12} sm={3} md={3}>
                    {!twoFactor ? (
                      <Button color="primary" variant="contained" onClick={() => {mailCheckEnable()}} >
                        Enable
                      </Button>
                    ):(
                      <Button color="secondary" variant="contained" onClick={() => {mailCheckDisable()}}>
                        Disable
                      </Button>
                    )}
                  </Col>
                </Row>
              </Container>
            </CardBody>
          </Card>
        </TabPanel>
      </TabContext>
    </div>
  );
}