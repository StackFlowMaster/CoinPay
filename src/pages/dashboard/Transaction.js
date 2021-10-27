import React, { useState, useEffect} from "react";
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactDatatable from '@ashvin27/react-datatable';
import {useSelector, useDispatch} from 'react-redux';
import axios from "axios";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));
export default function Transaction() {
  const classes = useStyles();
  const [value, setValue] = useState('1');
  const [depositTrx, setDepositTrx] = useState([]);
  const [withdrawTrx, setWithdrawTrx] = useState([]);
  const {userData} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const columns_deposit = [
    {
        key: "coinType",
        text: "Coin",
        className: "coin",
        align: "left",
        sortable: true,
    },
    {
        key: "address",
        text: "Address",
        className: "address",
        align: "left",
        sortable: true,
    },
    {
        key: "amount",
        text: "Amount",
        className: "amount",
        align: "left",
        sortable: true,
    },
    {
        key: "txType",
        text: "Type",
        className: "type",
        align: "left",
        sortable: true,
    },
    {
        key: "status",
        text: "Status",
        className: "status",
        align: "left",
        sortable: true,
    },
    {
        key: "timereceived",
        text: "Transaction Date",
        className: "amount",
        align: "left",
        sortable: true,
    },
  ];
  const columns_withdraw = [
    {
        key: "coinType",
        text: "Coin",
        className: "coin",
        align: "left",
        sortable: true,
    },
    {
        key: "address",
        text: "Address",
        className: "address",
        align: "left",
        sortable: true,
    },
    {
        key: "amount",
        text: "Amount",
        className: "amount",
        align: "left",
        sortable: true,
    },
    {
        key: "status",
        text: "Status",
        className: "status",
        align: "left",
        sortable: true,
    },
    {
        key: "timereceived",
        text: "Transaction Date",
        className: "amount",
        align: "left",
        sortable: true,
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
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const getData = () => {
    axios.post('/api/v1/dev/transaction/gettransactions', {userId: userData.userId})
      .then(res => {
        setDepositTrx(res.data.deposit);
        setWithdrawTrx(res.data.withdraw);
      })
      .catch(err => {
        console.error(err);
      });
  };
  useEffect(() => {
    getData();
  },[]);
  return (
    <div className={classes.root}>
      <TabContext value={value}>
        <AppBar position="static">
          <TabList onChange={handleChange} aria-label="simple tabs example" variant="fullWidth">
            <Tab label="Deposit Transactions" value="1" />
            <Tab label="Withdraw Transactions" value="2" />
          </TabList>
        </AppBar>
        <TabPanel value="1">
          <Container>
            <Row>
            <Col xs={12} sm={12} md={12}>
              <ReactDatatable
                  config={config}
                  records={depositTrx}
                  columns={columns_deposit}
                />
            </Col>
            </Row>
          </Container>
        </TabPanel>
        <TabPanel value="2">
          <Container>
            <Row>
            <Col xs={12} sm={12} md={12}>
              <ReactDatatable
                  config={config}
                  records={withdrawTrx}
                  columns={columns_withdraw}
                />
            </Col>
            </Row>
          </Container>
        </TabPanel>
      </TabContext>
    </div>
  );
}