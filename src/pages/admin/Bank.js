import React, {Fragment, useState, useEffect} from "react";
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify';

export default function Bank() {
  const columns = [
    {
        key: "userId",
        text: "UserId",
        className: "userId",
        align: "left",
        sortable: true,
    },
    {
        key: "bankName",
        text: "Bank Name",
        className: "name",
        align: "left",
        sortable: true,
    },
    {
        key: "accountNumber",
        text: "Account Number",
        className: "uid",
        align: "left",
        sortable: true,
    },
    {
        key: "accountHolderName",
        text: "Account Holder Name",
        className: "name",
        align: "left",
        sortable: true,
    },
    {
        key: "action",
        text: "Action",
        className: "action",
        width: 150,
        align: "left",
        sortable: false,
        cell: record => {
            return (
                <Fragment>
                  <button
                      data-toggle="modal"
                      data-target="#update-user-modal"
                      className="btn btn-primary btn-sm"
                      onClick={() => showDetail(record)}
                      style={{marginRight: '5px'}}>
                      User Detail
                  </button> &nbsp;
                  <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteRecord(record)}>
                      <i className="fa fa-trash"></i>
                  </button>
                </Fragment>
            );
        }
    }
  ];
  const config = {
    page_size: 10,
    length_menu: [ 10, 20, 50 ],
    filename: "Users",
    no_data_text: 'No user found!',
    button: {
        excel: true,
        print: true,
        csv: true
    },
    language: {
        length_menu: "Show _MENU_ result per page",
        filter: "Filter in records...",
        info: "Showing _START_ to _END_ of _TOTAL_ records",
        pagination: {
            first: "First",
            previous: "Previous",
            next: "Next",
            last: "Last"
        }
    },
    show_length_menu: true,
    show_filter: true,
    show_pagination: true,
    show_info: true,
  }
  const [records, setRecords] = useState([]);
  const [show, setShow] = useState(false);
  const [userData, setData] = useState({});
  const getBanks = () => {
    axios
      .post('/api/v1/admin/bank/all')
      .then((res) => {
        if(res.data.length > 0) {
          setRecords(res.data);
        }
      })
      .catch(err => {
        console.error(err);
      });
  };
  const showDetail = (record) => {
    axios
      .post('/api/v1/admin/bank/getuserdetails', record)
      .then(res => {
        if (res.data) {
          setData(res.data);
          setShow(true);
        }
      });
  };
  const handleClose = () => {
    setShow(false);
  }
  const deleteRecord = (record) => {
    axios
      .post('/api/v1/admin/bank/remove', record)
      .then((res) => {
        if(res.data.msg === 'success') {
          toast('success', {
            position: toast.POSITION.TOP_CENTER,
          });
          getBanks();
        }
      })
      .catch(err => {
        console.error(err);
        toast('failure', {
          position: toast.POSITION.TOP_CENTER,
        });
      })
  };
  useEffect(() => {
    getBanks();
  }, []);
  return (
    <>
      <Container>
        <Row>
         <Col xs={12} sm={12} md={12}>
          <ReactDatatable
              config={config}
              records={records}
              columns={columns}
            />
         </Col>
        </Row>
      </Container>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size='lg'
      >
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
          <Row>
              <Col xs={12} sm={4} md={4}>
                <TextField
                  margin="dense"
                  id="userId"
                  label="User ID"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={userData.id}
                  inputProps={{
                    readOnly: true
                  }}
                />
              </Col>
              <Col xs={12} sm={4} md={4}>
                <TextField
                  margin="dense"
                  id="name"
                  label="User Name"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={userData.name}
                  inputProps={{
                    readOnly: true
                  }}
                />
              </Col>
              <Col xs={12} sm={4} md={4}>
                <TextField
                  margin="dense"
                  id="email"
                  label="User Email"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={userData.email}
                  inputProps={{
                    readOnly: true
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={4} md={4}>
                <TextField
                  margin="dense"
                  id="role"
                  label="User Role"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={userData.role}
                  inputProps={{
                    readOnly: true
                  }}
                />
              </Col>
              <Col xs={12} sm={4} md={4}>
                <TextField
                  margin="dense"
                  id="status"
                  label="Status"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={userData.approved}
                  inputProps={{
                    readOnly: true
                  }}
                />
              </Col>
              <Col xs={12} sm={4} md={4}>
                <TextField
                  margin="dense"
                  id="pwd"
                  label="User Password"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={userData.password}
                  inputProps={{
                    readOnly: true
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12}>
                <TextField
                  margin="dense"
                  id="token"
                  label="Access Token"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={userData.token}
                  inputProps={{
                    readOnly: true
                  }}
                />
              </Col>
            </Row>               
            <Row>
              <Col xs={12} sm={12} md={12}>
                <Button variant="contained" color="primary" onClick={() => {handleClose()}}>Close</Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
      <ToastContainer />
     </>
  );
}