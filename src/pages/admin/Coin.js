import React, {Fragment, useState, useEffect} from "react";
import {toast, ToastContainer} from 'react-toastify';
import ReactDataTable from '@ashvin27/react-datatable';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
export default function Coin() {
  const coin_logos = [
    process.env.PUBLIC_URL + "/images/coin_logos/btc.png",
    process.env.PUBLIC_URL + "/images/coin_logos/eth.png",
    process.env.PUBLIC_URL + "/images/coin_logos/ltc.png",
    process.env.PUBLIC_URL + "/images/coin_logos/xrp.png",
    process.env.PUBLIC_URL + "/images/coin_logos/trx.png",
    process.env.PUBLIC_URL + "/images/coin_logos/omni.png"
  ];
  const [records, setRecords] = useState([]);
  const pageChange = (pageData) => {
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
        key: "status",
        text: "Status",
        className: "email",
        align: "left",
        sortable: true
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
        .post('/api/v1/admin/coin/get-coin')
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
                onPageChange={pageChange.bind(this)}
              />
            </Col>
          </Row>
          <ToastContainer />
        </Container>
    </div>
  );
}