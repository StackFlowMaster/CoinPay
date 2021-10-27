import React, {useState, useEffect, Fragment} from "react";
import {useSelector} from 'react-redux'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TextField from '@material-ui/core/TextField';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
export default function APIKey() {
  const {userData} = useSelector((state) => state.auth);
  const [applicationName, setAppName] = useState(null);
  const [applicationUrl, setAppUrl] = useState(null);
  const [notificationUrl, setNotUrl] = useState(null);
  const [apps, setApps] = useState([]);
  const [detail_app_name, setDetailAppName] = useState('');
  const [detail_app_id, setDetailAppId] = useState('');
  const [detail_app_url, setDetailAppUrl] = useState('');
  const [detail_not_url, setDetailNotUrl] = useState('');
  const [detail_app_key, setDetailAppKey] = useState('');
  const [detail_app_token, setDetailAppToken] = useState('');
  const [showPanel, setShowPanel] = useState(false);
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
        width: 200,
    },
    {
        key: "apiAccessToken",
        text: "Access Token",
        className: "accessToken",
        align: "left",
        sortable: true,
        width: 200,
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
                      className="btn btn-success btn-sm"
                      onClick={() => showDetail(record)}>
                      <i className="fa fa-gear"></i>
                  </button>
                </Fragment>
            );
        }
    }
  ];
  const showDetail = (app) => {
    setOpen(true);
    setDetailAppName(app.applicationName);
    setDetailAppId(app.applicationId);
    setDetailAppUrl(app.applicationUrl);
    setDetailNotUrl(app.notificationUrl);
    setDetailAppKey(app.apiKey);
    setDetailAppToken(app.apiAccessToken);
  }
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
  const getApps = () => {
    axios
      .post('/api/v1/dev/app/all', {userId: userData.userId})
      .then((res) => {
        setApps(res.data);
        return;
      })
      .catch(err => {console.error(err); return;});
  }
  useEffect(() => {
    getApps();
  }, []);
  const createApp = () => {
    axios
      .post('/api/v1/dev/app/create', {userId: userData.userId, applicationName: applicationName, applicationUrl: applicationUrl, notificationUrl: notificationUrl})
      .then((res) => {
        if(res.data.msg === 'success') {
          toast('success', {
            position: toast.POSITION.TOP_CENTER,
          });
          setShowPanel(false);
          getApps();
          setAppName('');
          setAppUrl('');
          setNotUrl('');
          
        }
      });
  }
  const deleteApp = (app) => {
    axios
      .post('/api/v1/dev/app/remove', {userId: userData.userId, applicationId: app.applicationId})
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
  const pageChange = (pageData) => {
  }
  return (
    <div>
      <Container>
        <Row>
          <Col xs={12} sm={3} md={3}><h5>Generate Your API Key</h5></Col>
          <Col xs={12} sm={6} md={6}></Col>
          <Col xs={12} sm={3} md={3}>
            <Button color="primary" variant="primary" onClick={() => {setShowPanel(true)}}>Create App</Button>
          </Col>
        </Row>
        <Row>&nbsp;</Row>
      </Container>
      <Modal
        show={showPanel}
        onHide={() => {setShowPanel(false)}}
        backdrop='static'
        keyboard={false}
        size='lg'>
          <Modal.Header closeButton>
            <Modal.Title>Create New Application</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col xs={12} sm={4} md={4}>
                  <TextField
                    margin="dense"
                    id="appName"
                    type="text"
                    fullWidth
                    label="Application Name"
                    variant='outlined'
                    value={applicationName}
                    onChange={(e) => {setAppName(e.target.value)}}
                    required
                    />
                </Col>
                <Col xs={12} sm={4} md={4}>
                  <TextField
                    margin="dense"
                    id="appUrl"
                    type="text"
                    fullWidth
                    label="Application URL"
                    variant='outlined'
                    value={applicationUrl}
                    onChange={(e) => {setAppUrl(e.target.value)}}
                    required
                    />
                </Col>
                <Col xs={12} sm={4} md={4}>
                  <TextField
                    margin="dense"
                    id="notUrl"
                    type="text"
                    fullWidth
                    label="Notification Email"
                    variant='outlined'
                    value={notificationUrl}
                    onChange={(e) => {setNotUrl(e.target.value)}}
                    required
                    />
                </Col>
              </Row>

              <Row>
                <Button onClick={() => {createApp();}} variant="primary" color="primary" autoFocus>
                  Create App
                </Button>
              </Row>
            </Container>
          </Modal.Body>
      </Modal>
      <Modal
        show={openDetail}
        onHide={() => {setOpen(false)}}
        backdrop='static'
        keyboard={false}
        size='lg'>
          <Modal.Header closeButton>
            <Modal.Title>Create New Application</Modal.Title>
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
                <Button onClick={() => {setOpen(false)}} variant="primary" color="primary" autoFocus>
                  Close
                </Button>
              </Row>
            </Container>
          </Modal.Body>
      </Modal>
      
      {apps.length !== 0 && (
        <Container>
          <Row>
          <Col xs={12} sm={12} md={12}>
            <ReactDatatable
                config={config}
                records={apps}
                columns={columns}
                onPageChange={pageChange.bind(this)}
              />
          </Col>
          </Row>
        </Container>
      )}
      <ToastContainer />
    </div>
  );
}