import React, {useState, useEffect, Fragment} from "react";
import {useSelector} from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Card from '../../components/Card/Card';
import CardBody from '../../components/Card/CardBody';
import CardHeader from '../../components/Card/CardHeader';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import CardFooter from "../../components/Card/CardFooter";
import isEmpty from 'is-empty';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import {toast, ToastContainer} from 'react-toastify';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Support() {
  const classes = useStyles();
  const [title, setTitle] = useState('');
  const {userData} = useSelector((state) => state.auth);
  const [tickets, setTickets] = useState(null);
  const [resTickets, setResTickets] = useState([]);
  const [openDlg, setShowDlg] = useState(false);
  const [description, setDescription] = useState('');
  const getTickets = () => {
    axios
      .post('/api/v1/dev/support/all', {userId: userData.userId})
      .then((res) => {
        setTickets(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }
  const submitTicket = () => {
    const ticket = {
      userId: userData.userId,
      title: title,
      description: description
    };
    axios
      .post('/api/v1/dev/support/createticket', ticket)
      .then((res) => {
        if(res.data.msg === 'success'){
          setTitle('');
          setDescription('');
          toast('success', {
            position: toast.POSITION.TOP_CENTER,
          });
          getTickets();
        }          
      })
  }
  useEffect(() => {
    getTickets();
  },[]);
  const showResponse = (ticket) =>{
    axios
      .post('/api/v1/dev/support/getresponsetickets', {userId: userData.userId, number: ticket.number})
      .then((res) => {
        if(res.data) {
          setResTickets(res.data);
          setShowDlg(true);
        } 
      });
  }
  const showResTickets = () => {
    return (
      <>
        {resTickets.map(el => (
          <Fragment key={el.res_number}>
            <Card>
              <CardHeader>
                <h5>Title : {el.title}</h5>
                Ticket Number : {el.number}
                Response Number : {el.res_number}
              </CardHeader>
              <CardBody>
                <h5>Description</h5>
                {el.description}
              </CardBody>
            </Card>
          </Fragment>
        ))}
      </>
    ); 
  }
  const showTickets = () => {
    return (
      <>
        {tickets.map(el => (
        <Fragment key={el.number}>
           <Card>
              <CardHeader>
                <h5>Title : {el.title}</h5>
                Ticket Number : {el.number} <br></br>
                Created Time : {el.createdTime} <br></br>
                Expired Time : {el.expireTime}
              </CardHeader>
              <CardBody>
                <h5>Description :</h5>
                {el.description}
              </CardBody>
              <CardFooter>
                <Button color="primary" variant="outlined" onClick={() => {showResponse(el)}}>Show Response</Button>
              </CardFooter>
            </Card>
        </Fragment>
      ))}
      </>
    );
  }
  return (
    <div className={classes.root}>
      <ToastContainer />
      <Card>
        <CardHeader>
          <h3>Support</h3> <br></br>
          <h5>Please input your questions</h5>
        </CardHeader>
        <CardBody>
          <Container>
            <Row><h6>Title</h6></Row>
            <Row>
              <Col xs={12} sm={12} md={12}>
                <TextField
                  margin="dense"
                  id="question_title"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={title}
                  onChange={(e) => {setTitle(e.target.value)}}
                  required
                  />
              </Col>
            </Row>
            <Row><h6>Description</h6></Row>
            <Row>
              <Col xs={12} sm={12} md={12}>
                <textarea
                  className="form-control" 
                  id="description" 
                  rows="5"
                  label="Description"
                  required
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  />
              </Col>
            </Row>
          </Container>
        </CardBody>
        <CardFooter>
          <Container>
            <Row>
              {!isEmpty(title) && !isEmpty(description) && <Button color="primary" variant="outlined" onClick={() => {submitTicket()}}>Submit</Button>}
            </Row>
          </Container>
        </CardFooter>
      </Card>
      {tickets && showTickets()}
      <Modal
        show={openDlg}
        onHide={() => {setShowDlg(false); setResTickets([]);}}
        backdrop='static'
        keyboard={false}
        size='lg'>
          <Modal.Header closeButton>
            <Modal.Title>Response Tickets</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                {resTickets.length !== 0 ? showResTickets() : <>There is no response tickets !</>}
              </Row>
              <Row>
                <Button onClick={() => {setShowDlg(false); setResTickets([]);}} color="secondary" autoFocus>
                  Close
                </Button>
              </Row>
            </Container>
          </Modal.Body>
      </Modal>
    </div>
  );
}