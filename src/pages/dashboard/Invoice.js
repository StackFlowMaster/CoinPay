import React, {Fragment, useState, useEffect} from "react";
import Button from '@material-ui/core/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import ReactDatatable from '@ashvin27/react-datatable';
import { makeStyles } from '@material-ui/core/styles';
import DatePicker from 'react-date-picker';
import {useSelector} from 'react-redux';
import axios from 'axios';
import emptyValidator from '../../utils/emptyValidator';
import {toast, ToastContainer} from 'react-toastify';
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(0),
  },
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
}));
export default function Invoice() {
  const {userData} = useSelector((state) => state.auth);
  const classes = useStyles();
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
        width: 150,
        align: "left",
        sortable: false,
        cell: record => {
            return (
                <Fragment>
                    <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleDetail(record)}>
                        <i className="fa fa-eye"></i>
                    </button> &nbsp;
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEdit(record)}>
                        <i className="fa fa-edit"></i>
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
  const [newDueDate, setNewDate] = useState(new Date());
  const [senderCompanyName, setCompanyName] = useState('');
  const [senderName, setName] = useState('');
  const [senderEmail, setEmail] = useState('');
  const [currency, setCurrency] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhoneNumber, setCompanyPhone] = useState('');
  const [customerAddress, setAddress] = useState('');
  const [dueDate, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [records, setRecords] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedInvoice, setInvoice] = useState(false);
  const [description, setDescription] =useState('');
  const [editInvoice, setEditInvoice] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const detailClose = () => {
    setShowDetail(false);
  }
  const handleEditClose = () => {
    setShowEdit(false);
  }
  const currencyChange = (event) => {
    setCurrency(event.target.value);
  };
  const handleClose = () => {
    setShow(false);
  }
  const handleShow = () => {
    setShow(true);
  }
  const pageChange = (pageData) => {
  } 
  const handleDetail = (data) => {
    setShowDetail(true);
    setInvoice(data);
  }
  const handleEdit = (data) => {
    setEditInvoice(data);
    setShowEdit(true);
  }
  
  const handleSubmit = () => {
    const invoiceDetail = {
      userId: userData.userId,
      senderCompanyName: senderCompanyName,
      senderName: senderName,
      dueDate: dueDate,
      createdDate: new Date().toISOString(),
      senderEmail: senderEmail,
      currency: currency,
      customerName: customerName,
      customerEmail: customerEmail,
      customerPhoneNumber: customerPhoneNumber,
      customerAddress: customerAddress,
      quantity: quantity,
      price: price,
      description: description,
      amount: (price * quantity).toFixed(2)
    }
    if(!emptyValidator([
      userData.userId, 
      senderCompanyName,
      senderName,
      dueDate,
      senderEmail,
      currency,
      customerName,
      customerAddress,
      customerEmail,
      customerPhoneNumber,
      description,
    ])) {
      toast('please fill all terms', {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    } else {
      axios
        .post('/api/v1/dev/invoice/create', invoiceDetail)
        .then(res => {
          if (res.data) {
            toast('success', {
              position: toast.POSITION.TOP_CENTER,
            });
            getData();
            handleClose();
          }
        })
        .catch(err => {
          console.error(err);
          return;
        });
    }
  }
  const handleUpdate = () => {
    const editDetail = {
      userId: userData.userId,
      senderCompanyName: editInvoice.senderCompanyName,
      senderName: editInvoice.senderName,
      dueDate: newDueDate,
      createdDate: new Date().toISOString(),
      senderEmail: editInvoice.senderEmail,
      currency: editInvoice.currency,
      customerName: editInvoice.customerName,
      customerEmail: editInvoice.customerEmail,
      customerPhoneNumber: editInvoice.customerPhoneNumber,
      customerAddress: editInvoice.customerAddress,
      quantity: editInvoice.quantity,
      price: editInvoice.price,
      description: editInvoice.description,
      amount: (editInvoice.price * editInvoice.quantity).toFixed(2),
      _id: editInvoice._id
    }
    axios
        .post('/api/v1/dev/invoice/update', editDetail)
        .then(res => {
          if (res.data.msg === 'success') {
            toast('success', {
              position: toast.POSITION.TOP_CENTER,
            });
            getData();
            handleEditClose();
          }
        })
        .catch(err => {
          console.error(err);
          toast('failure', {
            position: toast.POSITION.TOP_CENTER,
          });
          return;
        });
  }
  const handleSend = () => {
    setShowDetail(false);
    toast('Your invoice is pending', {
      position: toast.POSITION.TOP_CENTER,
    });
  }
  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    axios
        .post('/api/v1/dev/invoice/all', {userId: userData.userId})
        .then((res) => {
            if(res.data.msg) {
                return;
            } else {
                setRecords(res.data);
            }
        })
        .catch(err => {
            console.error(err);
            return;
        });
  } 

  const deleteRecord = (record) => {
    axios
      .post('/api/v1/dev/invoice/remove', {userId: userData.userId, invoiceNo: record.invoiceNo})
      .then(res => {
        if (res.status === 200) {
          toast('success', {
            position: toast.POSITION.TOP_CENTER,
          });
          getData();
        }
      })
      .catch(err => {
        console.error(err);
        return;
      });
  }
  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleShow}>
        New Invoice
      </Button>
      <p>
        &nbsp;
      </p>
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
        show={showDetail}
        onHide={detailClose}
        backdrop="static"
        keyboard={false}
        size='lg'
        id='invoice_detail'
      >
        <Modal.Header closeButton>
          <Container>
            <Row>
              <Modal.Title>Invoice #{selectedInvoice._id}</Modal.Title>
            </Row>
          </Container>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={12} sm={2} md={2}>
                {/* <Button variant="outlined" color="primary" onClick={handlePrint} className="fullWidth"><i className="fa fa-print"></i></Button> */}
              </Col>
              <Col xs={12} sm={8} md={8}></Col>
              <Col xs={12} sm={2} md={2}>
                <Button variant="outlined" color="primary" onClick={handleSend} className="fullWidth"><i className="fa fa-send"></i></Button>
              </Col>
            </Row>
            <Row><p>&nbsp;</p></Row>
            <Row>
              <Col xs={12} sm={2} md={2}>
                <img
                  src={process.env.PUBLIC_URL + "/images/about/1.png"}
                  alt="images"
                  className="invoice-logo"
                />
              </Col>
              <Col xs={12} sm={8} md={8}></Col>
              <Col xs={12} sm={2} md={2}>
                <h3>Invoice</h3>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <Row>
                  <h5>Sender Name : </h5> &nbsp; {selectedInvoice.senderName}
                </Row>
                <Row>
                  <h5>Sender Email : </h5> &nbsp;{selectedInvoice.senderEmail}
                </Row>
                <Row>
                  <h5>Company Name : </h5> &nbsp;{selectedInvoice.senderCompanyName}
                </Row>
              </Col>
              <Col xs={12} sm={6} md={6}>
                <Row>
                  <h5>Invoice No. : </h5> &nbsp;{selectedInvoice.invoiceNo}
                </Row>
                <Row>
                  <h5>Created Date : </h5>&nbsp; {selectedInvoice.createdDate}
                </Row>
                <Row>
                  <h5>Due Date : </h5>&nbsp; {selectedInvoice.dueDate}
                </Row>
              </Col>
            </Row>
            <Row><p>&nbsp;</p></Row>
            <Row>
              <h3>Bill To</h3>
            </Row>
            <Row><p>&nbsp;</p></Row>
            <Row>
              <h5>Customer Name : </h5> &nbsp;{selectedInvoice.customerName}
            </Row>
            <Row>
              <h5>Customer Email : </h5>&nbsp; {selectedInvoice.customerEmail}
            </Row>
            <Row>
              <h5>Customer PhoneNumber : </h5> &nbsp;{selectedInvoice.customerPhoneNumber}
            </Row>
            <Row><p>&nbsp;</p></Row>
            <Row>
              <table className="fullWidth">
                <tbody>
                  <tr>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                  </tr>
                  <tr>
                    <td>{selectedInvoice.description}</td>
                    <td>{selectedInvoice.price}</td>
                    <td>{selectedInvoice.quantity}</td>
                    <td>{selectedInvoice.amount}</td>
                  </tr>
                </tbody>
              </table>
            </Row>
            <Row><p>&nbsp;</p></Row>
            <Row>Thank you for your business.</Row>
          </Container>
        </Modal.Body>
      </Modal>
      
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
                  label="Your Company Name"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={senderCompanyName}
                  onChange={(e) => {setCompanyName(e.target.value)}}
                />
              </Col>
              <Col xs={12} sm={6} md={6}>
                <TextField
                  margin="dense"
                  id="name"
                  label="Your Name"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={senderName}
                  onChange={(e) => {setName(e.target.value)}}
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
                  label="Email Address"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={senderEmail}
                  onChange={(e) => {setEmail(e.target.value)}}
                />
              </Col>
              <Col xs={12} sm={6} md={6}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel htmlFor="outlined-age-native-simple">Currency</InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={currency}
                    onChange={currencyChange}
                    label="Currency"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={'usd'}>USD - US Dollar</MenuItem>
                    <MenuItem value={'euro'}>Euro</MenuItem>
                    <MenuItem value={'pound'}>Pound</MenuItem>
                  </Select>
                </FormControl>
              </Col>
            </Row>
            <Row>
              <hr></hr>
            </Row>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <DatePicker onChange={setDate} value={dueDate} />
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
                <h4>Amount : {(quantity * price).toFixed(2)}</h4>
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
                  value={customerName}
                  onChange={(e) => {setCustomerName(e.target.value)}}
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
                  value={customerEmail}
                  onChange={(e) => {setCustomerEmail(e.target.value)}}
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
                  value={customerPhoneNumber}
                  onChange={(e) => {setCompanyPhone(e.target.value)}}
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
                  value={customerAddress}
                  onChange={(e) => {setAddress(e.target.value)}}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <TextField
                  margin="dense"
                  id="quantity"
                  label="Quantity"
                  type="number"
                  fullWidth
                  variant='outlined'
                  value={quantity}
                  onChange={(e) => {setQuantity(e.target.value)}}
                />
              </Col>
              <Col xs={12} sm={6} md={6}>
                <TextField
                  margin="dense"
                  id="price"
                  label="Price"
                  type="number"
                  fullWidth
                  variant='outlined'
                  value={price}
                  onChange={(e) => {setPrice(e.target.value)}}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12}>
              <textarea
                className="form-control" 
                id="description" 
                rows="5"
                label="Description"
                placeholder="Description"
                required
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={10} md={10}></Col>
              <Col xs={12} sm={2} md={2}>
                <Button variant="contained" color="primary" onClick={() => {handleSubmit()}}>
                  Send
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
      <Modal
        show={showEdit}
        onHide={handleEditClose}
        backdrop="static"
        keyboard={false}
        size='lg'
      >
        <Modal.Header closeButton>
          <Container>
            <Row>
              <Modal.Title>Update Invoice Detail</Modal.Title>
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
                  label="Your Company Name"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={editInvoice.senderCompanyName}
                  onChange={(e) => {setEditInvoice({...editInvoice, senderCompanyName: e.target.value})}}
                />
              </Col>
              <Col xs={12} sm={6} md={6}>
                <TextField
                  margin="dense"
                  id="name"
                  label="Your Name"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={editInvoice.senderName}
                  onChange={(e) => {setEditInvoice({...editInvoice, senderName: e.target.value})}}
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
                  label="Email Address"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={editInvoice.senderEmail}
                  onChange={(e) => {setEditInvoice({...editInvoice, senderEmail: e.target.value})}}
                />
              </Col>
              <Col xs={12} sm={6} md={6}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel htmlFor="outlined-age-native-simple">Currency</InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={editInvoice.currency}
                    onChange={(e) => {setEditInvoice({...editInvoice, currency: e.target.value})}}
                    label="Currency"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={'usd'}>USD - US Dollar</MenuItem>
                    <MenuItem value={'euro'}>Euro</MenuItem>
                    <MenuItem value={'pound'}>Pound</MenuItem>
                  </Select>
                </FormControl>
              </Col>
            </Row>
            <Row>
              <hr></hr>
            </Row>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <DatePicker onChange={setNewDate} value={newDueDate} />
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
                <h4>Amount : {(editInvoice.quantity * editInvoice.price).toFixed(2)}</h4>
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
                  value={editInvoice.customerName}
                  onChange={(e) => {setEditInvoice({...editInvoice, customerName: e.target.value})}}
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
                  value={editInvoice.customerEmail}
                  onChange={(e) => {setEditInvoice({...editInvoice, customerEmail: e.target.value})}}
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
                  value={editInvoice.customerPhoneNumber}
                  onChange={(e) => {setEditInvoice({...editInvoice, customerPhoneNumber: e.target.value})}}
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
                  value={editInvoice.customerAddress}
                  onChange={(e) => {setEditInvoice({...editInvoice, customerAddress: e.target.value})}}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <TextField
                  margin="dense"
                  id="quantity"
                  label="Quantity"
                  type="number"
                  fullWidth
                  variant='outlined'
                  value={editInvoice.quantity}
                  onChange={(e) => {setEditInvoice({...editInvoice, quantity: e.target.value})}}
                />
              </Col>
              <Col xs={12} sm={6} md={6}>
                <TextField
                  margin="dense"
                  id="price"
                  label="Price"
                  type="number"
                  fullWidth
                  variant='outlined'
                  value={editInvoice.price}
                  onChange={(e) => {setEditInvoice({...editInvoice, price: e.target.value})}}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12}>
              <textarea
                className="form-control" 
                id="description" 
                rows="5"
                label="Description"
                placeholder="Description"
                required
                onChange={(e) => {setEditInvoice({...editInvoice, description: e.target.value})}}
                value={editInvoice.description}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={10} md={10}></Col>
              <Col xs={12} sm={2} md={2}>
                <Button variant="contained" color="primary" onClick={() => {handleUpdate()}}>
                  Update
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