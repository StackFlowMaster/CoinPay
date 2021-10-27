import React, {useState, useEffect} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";
import Password from "@material-ui/icons/Lock";
import GridContainer from "../../components/Grid/GridContainer.js";
import GridItem from "../../components/Grid/GridItem.js";
// import Button from "../../components/CustomButtons/Button.js";
import Button from 'react-bootstrap/Button';
import Card from "../../components/Card/Card.js";
import CardBody from "../../components/Card/CardBody.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardFooter from "../../components/Card/CardFooter.js";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import {useHistory} from 'react-router-dom';
import styles from "../../assets/jss/material-dashboard-react/views/loginPage.js";
import {useSelector, useDispatch} from 'react-redux';
import image from "../../assets/img/admin-bg.jpg";
import {registerUser} from '../../actions/authActions';
import {FaInfoCircle} from 'react-icons/fa';
const useStyles = makeStyles(styles);

export default function LoginRegister(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const {authenticated, userData} = useSelector((state) => state.auth);
  const {_isErr, _errMsg} = useSelector((state) => state.errors);
  setTimeout(function() {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();
  const history = useHistory();
  const handleClick = () => {
    history.push('/admin/login');
  }
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [role, setRole] = useState('admin');
  const submit = () => {
    const user = {
      name: name,
      email: email,
      password: password,
      password2: password2,
      role: role
    };
    dispatch(registerUser(user, history));
  }
  const dispatch = useDispatch();
  useEffect(() => {
    if(authenticated && userData.role === 'admin') {
      history.push('/admin/dashboard/users');
    }
  }, [authenticated]);
  return (
    <div>
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>
              <Card className={classes[cardAnimaton]}>
                <form className={classes.form}>
                  <CardHeader color="success" className={classes.cardHeader}>
                    <h4 className='admin-login'>Register</h4>
                  </CardHeader>
                  <CardBody>
                    <CustomInput
                        labelText="User Name..."
                        id="first"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            endAdornment: (
                            <InputAdornment position="end">
                                <People className={classes.inputIconsColor} />
                            </InputAdornment>
                            ),
                            value: name,
                            onChange: (e) => setName(e.target.value)
                        }}
                        />                    
                    <CustomInput
                      labelText="Email..."
                      id="email"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "email",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                        value: email,
                        onChange: (e) => setEmail(e.target.value)
                      }}
                    />
                    <CustomInput
                      labelText="Password"
                      id="pass"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "password",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className={classes.inputIconsColor}>
                                <Password className={classes.inputIconsColor} />
                            </Icon>
                          </InputAdornment>
                        ),
                        autoComplete: "off",
                        value: password,
                        onChange: (e) => setPassword(e.target.value)
                      }}
                    />
                    <CustomInput
                      labelText="Confirm Password"
                      id="pass2"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "password",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className={classes.inputIconsColor}>
                                <Password className={classes.inputIconsColor} />
                            </Icon>
                          </InputAdornment>
                        ),
                        autoComplete: "off",
                        value: password2,
                        onChange: (e) => setPassword2(e.target.value)
                      }}
                    />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                  <Button  variant="outline-primary" onClick={() => {submit()}}>
                      Register
                    </Button>                  
                    <Button  variant="link" onClick={() => {handleClick()}}>
                      Login
                    </Button>   
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
            
          </GridContainer>
          {_isErr && (<><FaInfoCircle />{_errMsg}</>)}
        </div>
      </div>
    </div>
  );
}
