import React, {Fragment, useState, useEffect} from "react";
import {toast, ToastContainer} from 'react-toastify';
import Button from '@material-ui/core/Button';
import ReactDataTable from '@ashvin27/react-datatable';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import {useSelector} from 'react-redux';
export default function CoinSetting() {
  const {userData} = useSelector((state) => state.auth);
  const [records, setRecords] = useState([]);
  const coin_logos = [
    process.env.PUBLIC_URL + "/images/coin_logos/btc.png",
    process.env.PUBLIC_URL + "/images/coin_logos/eth.png",
    process.env.PUBLIC_URL + "/images/coin_logos/ltc.png",
    process.env.PUBLIC_URL + "/images/coin_logos/xrp.png",
    process.env.PUBLIC_URL + "/images/coin_logos/trx.png",
    process.env.PUBLIC_URL + "/images/coin_logos/omni.png"
  ];
  const handleEnable = (data) => {
    axios.post('/api/v1/dev/auth/coin-enable', {userId: userData.userId, coinType: data.coinType})
      .then(res => {
        if(res.data.msg === 'success') {
          toast('success', {
            position: toast.POSITION.TOP_CENTER,
          });
          getData();
        } else {
          toast('failure', {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      })
      .catch(err => {
        toast('failure', {
          position: toast.POSITION.TOP_CENTER,
        });
      });  
  }

  const handleDisable = (data) => {
    axios.post('/api/v1/dev/auth/coin-disable', {userId: userData.userId, coinType: data.coinType})
      .then(res => {
        if(res.data.msg === 'success') {
          toast('success', {
            position: toast.POSITION.TOP_CENTER,
          });
          getData();
        } else {
          toast('failure', {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      })
      .catch(err => {
        toast('failure', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
  }
  const columns = [
    {
        key: "coinLogo",
        text: "Logo",
        className: "action",
        width: 100,
        align: "left",
        sortable: false,
        cell: record => {
            return (
                <Fragment>
                  <img 
                    src={record.img_uri} 
                    className="table-coin-logo"
                    alt={record.coinType} />
                </Fragment>
            );
        }
    },
    {
        key: "coinType",
        text: "Coin",
        className: "id",
        align: "left",
        sortable: true,
    },
    {
        key: "coinName",
        text: "Coin Name",
        className: "name",
        align: "left",
        sortable: true,
    },
    {
        key: "price",
        text: "usd rate",
        className: "price",
        align: "left",
        sortable: true,
    },
    {
        key: "status",
        text: "Status",
        className: "status",
        align: "left",
        sortable: false,
        cell: record => {
          return (
            <Fragment>
              {record.status ? (
                <i class="fa fa-check" aria-hidden="true"></i>
              ):(
                <i class="fa fa-times" aria-hidden="true"></i>
              )}
            </Fragment>
          );
        }

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
                  {record.status ? (
                    <Button variant="contained" color="secondary" onClick={() => handleDisable(record)}>
                      Disable
                    </Button>
                  ):(
                    <Button variant="contained" color="primary" onClick={() => handleEnable(record)}>
                      Enable
                    </Button>
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
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
        .post('/api/v1/dev/auth/get-coin', {userId: userData.userId})
        .then((res) => {
            if(res.data.msg) {
                return;
            } else {
              var coins = [];
                for (let el of res.data) {
                  el.img_uri = coin_logos[res.data.indexOf(el)];
                  coins.push(el);
                }
                setRecords(coins);
            }
        })
        .catch(err => {
            console.error(err);
            return;
        });
  };
  

  return (
    <div>
        <Container>
          <Row>
            <Col xs={12} sm={12} md={12}>
              <ReactDataTable
                config={config}
                records={records}
                columns={columns}
              />
            </Col>
          </Row>
          <ToastContainer />
        </Container>
    </div>
  );
}