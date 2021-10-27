import React, {useState, useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import Email from "@material-ui/icons/Email";
import Password from "@material-ui/icons/Lock";
import GridContainer from "../../components/Grid/GridContainer.js";
import GridItem from "../../components/Grid/GridItem.js";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from "../../components/Card/Card.js";
import CardBody from "../../components/Card/CardBody.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardFooter from "../../components/Card/CardFooter.js";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import styles from "../../assets/jss/material-dashboard-react/views/loginPage.js";
import {loginUser} from '../../actions/authActions';
import {useHistory} from 'react-router-dom';
import image from "../../assets/img/admin-bg.jpg";
import {useSelector, useDispatch} from 'react-redux';
const useStyles = makeStyles(styles);
export default function LoginRegister(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  const history = useHistory();
  const dispatch = useDispatch();
  const {authenticated, userData} = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  setTimeout(function() {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();
  const handleClick = () => {
    history.push('/admin/register');
  }
  const handleLogin = () => {
    var userData = {
      email: email,
      password: password,
      role: role
    };
    dispatch(loginUser(userData, history));
  }
  useEffect(() => {
    if(authenticated && userData.role === 'admin') {
      history.push('/admin/dashboard/users');
    }
  }, [history, userData.role, authenticated])
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
                    <h4 className='admin-login'>Login</h4>
                  </CardHeader>
                  <CardBody>                    
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
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button  variant="outline-primary" onClick={() => {handleLogin()}}>
                      Login
                    </Button>                  
                    <Button  variant="link" onClick={() => {handleClick()}}>
                      Register
                    </Button>                     
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        {/* <Footer whiteFont /> */}
      </div>
    </div>
  );
}
