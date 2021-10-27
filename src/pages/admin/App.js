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
export default function APIKey() {
  const [records, setRecords] = useState([]);
  const [detail_app_name, setDetailAppName] = useState('');
  const [detail_app_id, setDetailAppId] = useState('');
  const [detail_app_url, setDetailAppUrl] = useState('');
  const [detail_not_url, setDetailNotUrl] = useState('');
  const [detail_app_key, setDetailAppKey] = useState('');
  const [detail_app_token, setDetailAppToken] = useState('');
  const [openDetail, setOpen] = useState(false);
  const columns = [
    {
        key: "applicationId",
        text: "Application ID",
        className: "name",
        align: "left",
        sortable: true,
    },
    {
        key: "applicationName",
        text: "Application Name",
        className: "uid",
        align: "left",
        sortable: true,
    },
    {
        key: "applicationUrl",
        text: "Application URL",
        className: "name",
        align: "left",
        sortable: true,
    },
    {
        key: "apiKey",
        text: "API KEY",
        className: "name",
        align: "left",
        sortable: true,
    },
    {
        key: "apiAccessToken",
        text: "Access Token",
        className: "accessToken",
        align: "left",
        sortable: true,
    },
    {
        key: "notificationUrl",
        text: "Notification URL",
        className: "not",
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
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteApp(record)}>
                      <i className="fa fa-trash"></i>
                  </button>

                  <button
                      className="btn btn-primary btn-sm"
                      onClick={() => showDetail(record)}>
                      <i className="fa fa-gear"></i>
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
  const showDetail = (app) => {
    setOpen(true);
    setDetailAppName(app.applicationName);
    setDetailAppId(app.applicationId);
    setDetailAppUrl(app.applicationUrl);
    setDetailNotUrl(app.notificationUrl);
    setDetailAppKey(app.apiKey);
    setDetailAppToken(app.apiAccessToken);
  }
  const getApps = () => {
    axios
      .post('/api/v1/admin/app/all')
      .then((res) => {
        setRecords(res.data);
      })
      .catch(err => console.error(err));
  }
  const deleteApp = (app) => {
    axios
      .post('/api/v1/dev/app/remove', {userId: app.userId, applicationId: app.applicationId})
      .then((res) => {
        if(res.data.msg === 'success') {
          toast('success', {
            position: toast.POSITION.TOP_CENTER,
          });
          getApps();
        }
      })
      .catch(err => {
        toast('failure', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  }
  useEffect(() => {
    getApps();
  });
  return (
    <div>
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
        show={openDetail}
        onHide={() => {setOpen(false)}}
        backdrop='static'
        keyboard={false}
        size='lg'>
          <Modal.Header closeButton>
            <Modal.Title>Application Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col xs={12} sm={4} md={4}>
                  <h5>Application Id</h5>
                </Col>
                <Col xs={12} sm={8} md={8}>
                  {detail_app_id}
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={4} md={4}>
                  <h5>Application Name</h5>
                </Col>
                <Col xs={12} sm={8} md={8}>
                  {detail_app_name}
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={4} md={4}>
                  <h5>Application URL</h5>
                </Col>
                <Col xs={12} sm={8} md={8}>
                  {detail_app_url}
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={4} md={4}>
                  <h5>Notification URL</h5>
                </Col>
                <Col xs={12} sm={8} md={8}>
                  {detail_not_url}
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={4} md={4}>
                  <h5>API Key</h5>
                </Col>
                <Col xs={12} sm={8} md={8}>
                  {detail_app_key}
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={4} md={4}>
                  <h5>API Access Token</h5>
                </Col>
                <Col xs={12} sm={8} md={8}>
                  {detail_app_token}
                </Col>
              </Row>

              <Row>
                <Button onClick={() => {setOpen(false)}} variant="contained" color="primary" autoFocus>
                  Close
                </Button>
              </Row>
            </Container>
          </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
}