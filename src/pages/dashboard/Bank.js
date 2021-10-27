import React, {Fragment, useEffect, useState} from "react";
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
import {getBankList, removeBank, addBank} from '../../actions/bankActions';
import {useSelector, useDispatch} from 'react-redux';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {ReactCountryDropdown} from 'react-country-dropdown';
import 'react-country-dropdown/dist/index.css';
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
export default function Bank() {
  const {userData} = useSelector((state) => state.auth);
  const {banks} = useSelector((state) => state.bank);
  const [showDetail, setShowDetail] = useState(false);
  const dispatch = useDispatch();
  const classes = useStyles();
  const columns = [
    {
        key: "bankName",
        text: "Bank Name",
        className: "name",
        align: "left",
        sortable: true,
    },
    {
        key: "country",
        text: "Country Name",
        className: "country_name",
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
                      className="btn btn-success btn-sm"
                      onClick={() => openDetail(record)}>
                      <i className="fa fa-eye"></i>
                  </button> &nbsp;
                  <button
                      className="btn btn-primary btn-sm"
                      onClick={() => openEdit(record)}>
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
  const [show, setShow] = useState(false);
  const [country, setCountry] = useState({});
  const [bank, setBank] = useState('');
  const [accountHolderName, setHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, selectBank] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const [editBank, setEditBank] = useState({});
  const openEdit = (data) => {
    setEditBank(data);
    setShowEdit(true);
  }
  const editCountry = (e) => {
    setEditBank({...editBank, country: e.name, countryCode: e.code});
  }
  const editBankName = (e) => {
    setEditBank({...editBank, bankName: e.target.value});
  }
  const countryChange = (event) => {    
    setCountry(event);
  };
  const bankChange = (event) => {
    setBank(event.target.value);
  };
  const handleClose = () => {
    setShow(false);
  }
  const handleShow = () => {
    setShow(true);
  }
  const pageChange = (pageData) => {
  }
  
  useEffect(() => {
    dispatch(getBankList({userId: userData.userId}));
  }, []);
  const deleteRecord = (record) => {
    dispatch(removeBank({userId: userData.userId, accountNumber: record.accountNumber}, (res) => {
      if(res === 'success') {
        toast('success', {
          position: toast.POSITION.TOP_CENTER,
        });
        dispatch(getBankList({userId: userData.userId}));
      } else {
        toast('failure', {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }));
  }
  const addNewBank = () => {
    if (country.name !== '' && bank !== '' && accountHolderName !== '' && accountNumber !== '') {
      dispatch(addBank({userId: userData.userId, country: country.name, countryCode: country.code, bankName: bank, accountHolderName: accountHolderName, accountNumber: accountNumber}, (res) => {
        if(res === 'success') {
          toast('success', {
            position: toast.POSITION.TOP_CENTER,
          });
          dispatch(getBankList({userId: userData.userId}));
        } else {
          toast('failure', {
            position: toast.POSITION.TOP_CENTER,
          });
        }
        handleClose();
      }));
    } else {
      toast('Please fill all terms', {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
  }
  const editNewBank = () => {
    if (editBank.country !== '' && editBank.bankName !== '' && editBank.accountHolderName !== '' && editBank.accountNumber !== '') {
      axios
        .post('/api/v1/dev/bank/update', {userId: userData.userId, country: editBank.country, countryCode: editBank.countryCode, bankName: editBank.bankName, accountHolderName: editBank.accountHolderName, accountNumber: editBank.accountNumber, id: editBank.id})
        .then((res) => {
          if(res.data.msg === 'success')
          {
            dispatch(getBankList({userId: userData.userId}));
            setShowEdit(false);
            setEditBank({});
            toast('success', {
              position: toast.POSITION.TOP_CENTER,
            });
          } else {
            toast('failure', {
              position: toast.POSITION.TOP_CENTER,
            });
          }
        });
    } else {
      toast('Please fill all terms', {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
  }
  const openDetail = (data) => {
    setShowDetail(true);
    selectBank(data);
  }
  const handleDetailClose = () => {
    setShowDetail(false);
  }
  const handleEditClose = () => {
    setShowEdit(false);
  }
  return (
    <>
      <Button variant="contained" color="primary" onClick={handleShow}>
        Add Bank
      </Button>
      <br></br>
      <p>
        &nbsp;
      </p>
      <Container>
        <Row>
         <Col xs={12} sm={12} md={12}>
          <ReactDatatable
              config={config}
              records={banks}
              columns={columns}
              onPageChange={pageChange.bind(this)}
            />
         </Col>
        </Row>
      </Container>
      <ToastContainer/>
      <Modal
        show={showDetail}
        onHide={handleDetailClose}
        backdrop='static'
        keyboard={false}
        size='lg'
      >
        <Modal.Header closeButton>
          <Modal.Title>Bank Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <h5>Bank Name</h5>
              </Col>
              <Col xs={12} sm={6} md={6}>
                <h6>{selectedBank.bankName}</h6>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <h5>Bank Country Name</h5>
              </Col>
              <Col xs={12} sm={6} md={6}>
                <h6>{selectedBank.country}</h6>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <h5>Account Number</h5>
              </Col>
              <Col xs={12} sm={6} md={6}>
                <h6>{selectedBank.accountNumber}</h6>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <h5>Account Holder Name</h5>
              </Col>
              <Col xs={12} sm={6} md={6}>
                <h6>{selectedBank.accountHolderName}</h6>
              </Col>
            </Row>
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
          <Modal.Title>Add Bank Detail</Modal.Title>
          {country.name}{country.code}
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <FormControl variant="outlined" className={classes.formControl}>
                  {/* <InputLabel htmlFor="outlined-age-native-simple">Country</InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={country}
                    onChange={countryChange}
                    label="Country"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={'Bank1'}> Bank1</MenuItem>
                    <MenuItem value={'Bank2'}> Bank2</MenuItem>
                    <MenuItem value={'Bank3'}> Bank3</MenuItem>
                  </Select> */}
                  <ReactCountryDropdown onSelect={countryChange} countryCode='US' className="fullWidth" />
                </FormControl>
              </Col>
              <Col xs={12} sm={6} md={6}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel htmlFor="outlined-age-native-simple">Bank</InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={bank}
                    onChange={bankChange}
                    label="Bank"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={'Bank1'}> Bank1</MenuItem>
                    <MenuItem value={'Bank2'}> Bank2</MenuItem>
                    <MenuItem value={'Bank3'}> Bank3</MenuItem>
                  </Select>
                </FormControl>
              </Col>
              
            </Row>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <TextField
                  margin="dense"
                  id="holdername"
                  label="Enter account holder name"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={accountHolderName}
                  onChange={(e) => {setHolderName(e.target.value)}}
                />
              </Col>
              <Col xs={12} sm={6} md={6}>
                <TextField
                  margin="dense"
                  id="accountnumber"
                  label="Enter account number"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={accountNumber}
                  onChange={(e) => {setAccountNumber(e.target.value)}}
                />
              </Col>
            </Row>
            <Row>
              <hr></hr>
            </Row>
            <Row>
              <Col xs={12} sm={10} md={10}></Col>
              <Col xs={12} sm={2} md={2}>
                <Button variant="contained" color="primary" onClick={() => {addNewBank()}}>
                  Add
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
          <Modal.Title>Edit Bank Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <FormControl variant="outlined" className={classes.formControl}>
                  {/* <InputLabel htmlFor="outlined-age-native-simple">Country</InputLabel>
                  <Select
                    labelId="simple-select-filled-label"
                    id="simple-select-filled"
                    value={editBank.country}
                    onChange={editCountry}
                    label="Country"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={'usa'}>USA</MenuItem>
                    <MenuItem value={'uk'}>UK</MenuItem>
                    <MenuItem value={'romania'}>Romania</MenuItem>
                  </Select> */}
                  <ReactCountryDropdown onSelect={editCountry} countryCode={editBank.countryCode} className="fullWidth" />
                </FormControl>
              </Col>
              <Col xs={12} sm={6} md={6}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel htmlFor="outlined-age-native-simple">Bank</InputLabel>
                  <Select
                    labelId="simple-select-filled-label"
                    id="simple-select-filled"
                    value={editBank.bankName}
                    onChange={editBankName}
                    label="Bank"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={'Bank1'}> Bank1</MenuItem>
                    <MenuItem value={'Bank2'}> Bank2</MenuItem>
                    <MenuItem value={'Bank3'}> Bank3</MenuItem>
                  </Select>
                </FormControl>
              </Col>
              
            </Row>
            <Row>
              <Col xs={12} sm={6} md={6}>
                <TextField
                  margin="dense"
                  id="holdername1"
                  label="Enter account holder name"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={editBank.accountHolderName}
                  onChange={(e) => {setEditBank({...editBank, accountHolderName: e.target.value})}}
                />
              </Col>
              <Col xs={12} sm={6} md={6}>
                <TextField
                  margin="dense"
                  id="accountnumber"
                  label="Enter account number"
                  type="text"
                  fullWidth
                  variant='outlined'
                  value={editBank.accountNumber}
                  onChange={(e) => {setEditBank({...editBank, accountNumber: e.target.value})}}
                />
              </Col>
            </Row>
            <Row>
              <hr></hr>
            </Row>
            <Row>
              <Col xs={12} sm={10} md={10}></Col>
              <Col xs={12} sm={2} md={2}>
                <Button variant="contained" color="primary" onClick={() => {editNewBank()}}>
                  Update
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}