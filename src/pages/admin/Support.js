import React, {Fragment, useState, useEffect} from "react";
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify';
import Card from '../../components/Card/Card';
import CardBody from '../../components/Card/CardBody';
import CardHeader from '../../components/Card/CardHeader';
import CardFooter from "../../components/Card/CardFooter";
import Badge from '@material-ui/core/Badge';
import isEmpty from 'is-empty';
export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [resTickets, setResTickets] = useState([]);
  const [openDlg, setShowDlg] = useState(false);
  const [openPanel, setShowPanel] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTicket, setTicket] = useState({});
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
  const getTickets = () => {
    axios
      .post('/api/v1/admin/support/all')
      .then(res => {
        setTickets(res.data);
      });
  }
  const showPanel = (ticket) => {
    setTicket(ticket);
    setShowPanel(true);
  }
  const showResponse = (ticket) =>{
    axios
      .post('/api/v1/dev/support/getresponsetickets', {userId: ticket.userId, number: ticket.number})
      .then((res) => {
        if(res.data) {
          setResTickets(res.data);
          setShowDlg(true);
        } 
      });
  }
  const submitTicket = () => {
    axios
      .post('/api/v1/admin/support/add-response', {ticket: selectedTicket, title: title, description: description})
      .then(res => {
        if(res.data.msg === 'success')
        {
          toast('success', {
            position: toast.POSITION.TOP_CENTER,
          });
          setShowPanel(false);
          getTickets();
          setTitle('');
          setDescription('');
        }
      })
      .catch(err => {
        console.error(err);
        toast('failure', {
          position: toast.POSITION.TOP_CENTER,
        });
      })
    } 
  useEffect(() => {
    getTickets();
  }, []);
  const showTickets = () => {
    return (
      <>
        {tickets.map(el => (
        <Fragment key={el.number}>
           <Card>
              <CardHeader>
                <h5>Title : {el.title} {el.status === 'accept' && (<Badge badgeContent={'New'} color="primary"></Badge>)}</h5>
                
                Ticket Number : {el.number} <br></br>
                Created Time : {el.createdTime} <br></br>
                Expired Time : {el.expireTime}
              </CardHeader>
              <CardBody>
                <h5>Description :</h5>
                {el.description}
              </CardBody>
              <CardFooter>
                <Container>
                  <Row>
                    <Button color="primary" variant="outlined" onClick={() => {showResponse(el)}}>Show Response</Button> &nbsp;
                    <Button color="primary" variant="outlined" onClick={() => {showPanel(el)}}>Response</Button>
                  </Row>
                </Container>
              </CardFooter>
            </Card>
        </Fragment>
      ))}
      </>
    );
  }
  return (
    <div>
      {tickets ? showTickets() : (<> There is no ticket !</>)}
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
                {resTickets.length !== 0 ? showResTickets() : <> There is not ticket</>}
              </Row>
              <Row>
                <Button onClick={() => {setShowDlg(false); setResTickets([]);}} color="primary" variant="outlined" autoFocus>
                  Close
                </Button>
              </Row>
            </Container>
          </Modal.Body>
      </Modal>
      <Modal
        show={openPanel}
        onHide={() => {setShowPanel(false)}}
        backdrop='static'
        keyboard={false}
        size='lg'>
          <Modal.Header closeButton>
            <Modal.Title>Response Ticket</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
            <Row>
              {!isEmpty(title) && !isEmpty(description) && <Button color="primary" variant="outlined" onClick={() => {submitTicket()}}>Submit</Button>}
            </Row>
            </Container>
          </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
}