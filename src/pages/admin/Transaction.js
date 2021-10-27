import React, {Fragment} from "react";
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
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));
export default function Transaction() {
  const classes = useStyles();
  const [value, setValue] = React.useState('1');
  const [records, setRecords] = React.useState([]);
  const columns1 = [
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
        width: 100,
        align: "left",
        sortable: false,
        cell: record => {
            return (
                <Fragment>
                  <button
                      data-toggle="modal"
                      data-target="#update-user-modal"
                      className="btn btn-primary btn-sm"
                      onClick={() => this.editRecord(record)}
                      style={{marginRight: '5px'}}>
                      <i className="fa fa-edit"></i>
                  </button>
                  <button
                      className="btn btn-danger btn-sm"
                      onClick={() => this.deleteRecord(record)}>
                      <i className="fa fa-trash"></i>
                  </button>
                </Fragment>
            );
        }
    }
  ];
  const columns2 = [
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
        width: 100,
        align: "left",
        sortable: false,
        cell: record => {
            return (
                <Fragment>
                  <button
                      data-toggle="modal"
                      data-target="#update-user-modal"
                      className="btn btn-primary btn-sm"
                      onClick={() => this.editRecord(record)}
                      style={{marginRight: '5px'}}>
                      <i className="fa fa-edit"></i>
                  </button>
                  <button
                      className="btn btn-danger btn-sm"
                      onClick={() => this.deleteRecord(record)}>
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
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const pageChange = (pageData) => {
  }
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
                  records={records}
                  columns={columns1}
                  onPageChange={pageChange.bind(this)}
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
                  records={records}
                  columns={columns2}
                  onPageChange={pageChange.bind(this)}
                />
            </Col>
            </Row>
          </Container>
        </TabPanel>        
      </TabContext>
    </div>
  );
}