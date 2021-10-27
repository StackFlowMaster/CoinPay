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


export default function User() {
  const [newPwd, setNewPwd] = useState('');
  const [newPwd2, setNewPwd2] = useState('');
  const [selectedUserId, setUserId] = useState('');
  const [show, setShow] = React.useState(false);
  const [records, setRecords] = useState('');
  const columns = [
    {
        key: "email",
        text: "Email",
        className: "email",
        align: "left",
        sortable: true,
    },
    {
        key: "name",
        text: "User Name",
        className: "uid",
        align: "left",
        sortable: true,
    },
    {
        key: "password",
        text: "Password",
        className: "password",
        align: "left",
        sortable: true,
    },
    {
        key: "role",
        text: "Role",
        className: "role",
        align: "left",
        sortable: true,
    },
    {
        key: "approved",
        text: "Status",
        className: "status",
        align: "left",
        sortable: false,
        cell: record => {
          return (
            <Fragment>
              {record.approved == true ? (
                <>
                  <i className='fa fa-lock'></i>
                </>
              ):(
                <>
                  <i className='fa fa-unlock'></i>
                </>
              )}
            </Fragment>
          );
        }
    },
    {
        key: "action",
        text: "Action",
        className: "action",
        width: 250,
        align: "left",
        sortable: false,
        cell: record => {
            return (
                <Fragment>
                  <button
                      className="btn btn-success btn-sm"
                      onClick={() => resetPwd(record)}>
                      <i className="fa fa-lock"></i>
                  </button> &nbsp;
                  {record.approved == true ? (
                    <>
                      <button
                          className="btn btn-danger btn-sm"
                          onClick={() => restrictUser(record)}>
                          Deactivate
                      </button> &nbsp;
                    </>
                  ):(
                    <>
                      <button
                          className="btn btn-success btn-sm"
                          onClick={() => approveUser(record)}>
                          Activate
                      </button> &nbsp;
                    </>
                  )}
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
  const pageChange = (pageData) => {
  }
  const getUsers = () => {
    axios
      .post('/api/v1/admin/user/users', {})
      .then((res) => {
        setRecords(res.data);
      })
      .catch();
  }
  const restrictUser = (user) => {
    axios
      .post('/api/v1/admin/user/kick-user', {userId: user.id})
      .then(res => {
        if(res.data.msg === 'success') {
          toast('success', {
            position: toast.POSITION.TOP_CENTER,
          });
          getUsers();
        }
      })
      .catch(err => {
        console.error(err);
        toast('failure', {
          position: toast.POSITION.TOP_CENTER,
        });
      })
  }
  const approveUser = (user) => {
    axios
      .post('/api/v1/admin/user/allow-user', {userId: user.id})
      .then(res => {
        if(res.data.msg === 'success') {
          toast('success', {
            position: toast.POSITION.TOP_CENTER,
          });
          getUsers();
        }
      })
      .catch(err => {
        console.error(err);
        toast('failure', {
          position: toast.POSITION.TOP_CENTER,
        });
      })
  }
  const resetPwd = (user) => {
    setShow(true);
    setUserId(user.id);
  }
  const deleteRecord = (user) => {
    axios
      .post('/api/v1/admin/user/delete', {userId: user.id})
      .then((res) => {
        if(res.data.msg === 'success') {
          toast('remove user successfully !', {
            position: toast.POSITION.TOP_CENTER,
          });
          getUsers();
        }
      })
      .catch(err => {
        console.error(err);
        toast('remove failure !', {
          position: toast.POSITION.TOP_CENTER,
        });
      })
  }
  const resetPassword = () => {
    if (newPwd.length > 5 && newPwd === newPwd2) {
      axios
      .post('/api/v1/admin/user/reset-password', {userId: selectedUserId, password: newPwd})
      .then(res => {
        if(res.data.msg === 'success') {
          toast('success', {
            position: toast.POSITION.TOP_CENTER,
          });
          getUsers();
          setShow(false);
        }
      })
      .catch(err => {
        console.error(err);
        toast('failure', {
          position: toast.POSITION.TOP_CENTER,
        });

      });
    } else {
      toast('Password must be more than 6 letters and please confirm password !', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }
  const handleClose = () => {
    setShow(false);
  }
  useEffect(() => {
    getUsers();
  },[]);
  return (
    <>
    <Container>
        <Row>
         <Col xs={12} sm={12} md={12}>
          <ReactDatatable
              config={config}
              records={records}
              columns={columns}
              onPageChange={pageChange.bind(this)}
            />
         </Col>
        </Row>
        <ToastContainer />
      </Container>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size='lg'
      >
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <TextField
                  margin="dense"
                  id="password"
                  label="Enter new password"
                  type="password"
                  fullWidth
                  variant='outlined'
                  value={newPwd}
                  onChange={(e) => {setNewPwd(e.target.value)}}
                />
              </Col>
              <Col xs={12} sm={6} md={6}>
                <TextField
                  margin="dense"
                  id="confirm_password"
                  label="Confirm password"
                  type="password"
                  fullWidth
                  variant='outlined'
                  value={newPwd2}
                  onChange={(e) => {setNewPwd2(e.target.value)}}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12}>
                <Button variant="contained" color="primary" onClick={() => {resetPassword()}}>Rest Password</Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </>     
  );
}