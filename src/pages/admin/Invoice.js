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
export default function Invoice() {
  const columns = [
    {
        key: "invoiceNo",
        text: "Invoice no.",
        className: "id",
        align: "left",
        sortable: true,
    },
    {
        key: "customerName",
        text: "Customer Name",
        className: "name",
        align: "left",
        sortable: true,
    },
    {
        key: "customerEmail",
        text: "Customer Email",
        className: "email",
        align: "left",
        sortable: true
    },
    {
        key: "amount",
        text: "Amount",
        className: "amount",
        align: "left",
        sortable: true
    },
    {
      key: "dueDate",
      text: "Invoice Date",
      className: "invoiceDate",
      align: "left",
      sortable: true
    },
    {
      key: "status",
      text: "Status",
      className: "status",
      align: "left",
      sortable: true
   },
    {
        key: "actions",
        text: "Action",
        className: "action",
        width: 200,
        align: "left",
        sortable: false,
        cell: record => {
            return (
                <Fragment>
                    <button
                        data-toggle="modal"
                        data-target="#update-user-modal"
                        className="btn btn-primary btn-sm"
                        onClick={() => {showDetail(record)}}
                        style={{marginRight: '5px'}}>
                        Detail
                    </button>
                    {record.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => acceptInvoice(record)}>
                          Accept
                        </button> &nbsp;
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => rejectInvoice(record)}>
                          Reject
                        </button>
                      </>
                    )}
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
  const [show, setShow] = useState(false);
  const [records, setRecords] = useState([]);
  const [invoiceData, setData] = useState({});
  const handleClose = () => {
    setShow(false);
  }
  const pageChange = (pageData) => {
  }
  const showDetail = (record) => {
    setData(record);
    setShow(true);
  };
  const getInvoices = () => {
    axios
      .post('/api/v1/admin/invoice/all')
      .then((res) => {
        if(res.data.length > 0) {
          setRecords(res.data);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
  const acceptInvoice = (invoice) => {
    axios
      .post('/api/v1/admin/invoice/allow', invoice)
      .then(res => {
        if ( res.data.msg === 'success') {
          toast('success', {
            position: toast.POSITION.TOP_CENTER,
          });
          getInvoices();
        }
      })
      .catch(err => {
        console.error(err);
        toast('failure', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  }
  const rejectInvoice = (invoice) => {
    axios
      .post('/api/v1/admin/invoice/reject', invoice)
      .then(res => {
        if ( res.data.msg === 'success') {
          toast('success', {
            position: toast.POSITION.TOP_CENTER,
          });
          getInvoices();
        }
      })
      .catch(err => {
        console.error(err);
        toast('failure', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  }
  useEffect(() => {
    getInvoices();
  }, [])
  return (
    <div>
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
      </Container>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size='lg'
      >
        <Modal.Header closeButton>
          <Container>
            <Row>
              <Modal.Title>Add Invoice Detail</Modal.Title>
            </Row>
          </Container>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <TextField
                  margin="dense"
                  id="company"
                  label="Sender Company Name"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={invoiceData.senderCompanyName}
                  inputProps={{
                    readOnly: true
                  }}
                />
              </Col>
              <Col xs={12} sm={6} md={6}>
                <TextField
                  margin="dense"
                  id="name"
                  label="Sender Name"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={invoiceData.senderName}
                  inputProps={{
                    readOnly: true
                  }}
                />
              </Col>
            </Row>
            <Row>
              <hr></hr>
            </Row>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <TextField
                  margin="dense"
                  id="email"
                  label="Sender Email"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={invoiceData.senderEmail}
                  inputProps={{
                    readOnly: true
                  }}
                />
              </Col>
              <Col xs={12} sm={6} md={6}>
                <TextField
                  margin="dense"
                  id="currency"
                  label="Currency"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={invoiceData.currency}
                  inputProps={{
                    readOnly: true
                  }}
                />
              </Col>
            </Row>
            <Row>
              <hr></hr>
            </Row>
            <Row>
              <Col xs={12} sm={6} md={6}>
              <TextField
                  margin="dense"
                  id="date"
                  label="Due Date"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={invoiceData.dueDate}
                  inputProps={{
                    readOnly: true
                  }}
                />
              </Col>
            </Row>
            <Row>
              <hr></hr>
            </Row>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <h4>Bill To : </h4>
              </Col>
              <Col xs={12} sm={6} md={6}>
                <h4>Amount : {invoiceData.amount}</h4>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <TextField
                  margin="dense"
                  id="customerName"
                  label="Business / Customer Name"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={invoiceData.customerName}
                  inputProps={{
                    readOnly: true
                  }}
                />
              </Col>
              <Col xs={12} sm={6} md={6}>
                <TextField
                  margin="dense"
                  id="customerEmail"
                  label="Email Address"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={invoiceData.customerEmail}
                  inputProps={{
                    readOnly: true
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <TextField
                  margin="dense"
                  id="phone"
                  label="Customer Phone Number"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={invoiceData.customerPhoneNumber}
                  inputProps={{
                    readOnly: true
                  }}
                />
              </Col>
              <Col xs={12} sm={6} md={6}>
                <TextField
                  margin="dense"
                  id="customerAddress"
                  label="Your Name"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={invoiceData.customerAddress}
                  inputProps={{
                    readOnly: true
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={10} md={10}></Col>
              <Col xs={12} sm={2} md={2}>
                <Button variant="contained" color="primary" onClick={() => {handleClose()}}>
                  Close
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
}