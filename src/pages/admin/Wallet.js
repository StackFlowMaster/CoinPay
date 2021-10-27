import React, {Fragment, useState, useEffect} from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactDatatable from '@ashvin27/react-datatable';
import axios from "axios";
const coin_logos = [
  process.env.PUBLIC_URL + "/images/coin_logos/btc.png",
  process.env.PUBLIC_URL + "/images/coin_logos/eth.png",
  process.env.PUBLIC_URL + "/images/coin_logos/ltc.png",
  process.env.PUBLIC_URL + "/images/coin_logos/xrp.png",
  process.env.PUBLIC_URL + "/images/coin_logos/trx.png",
  process.env.PUBLIC_URL + "/images/coin_logos/omni.png"
];
export default function Wallet() {
  const columns = [
    {
        key: "logo",
        text: "Logo",
        className: "action",
        align: "left",
        width: 50,
        sortable: false,
        cell: record => {
            return (
                <Fragment>
                    { record.coin === 'bitcoin' && 
                      <img 
                      src={coin_logos[0]} 
                      className="list-coin-logo"
                      alt="btc" />
                    }
                    { record.coin === 'litecoin' && 
                      <img 
                      src={coin_logos[2]} 
                      className="list-coin-logo"
                      alt="ltc" />
                    }
                    { record.coin === 'ethereum' && 
                      <img 
                      src={coin_logos[1]} 
                      className="list-coin-logo"
                      alt="eth" />
                    }
                    { record.coin === 'omni' && 
                      <img 
                      src={coin_logos[5]} 
                      className="list-coin-logo"
                      alt="omni" />
                    }
                    { record.coin === 'ripple' && 
                      <img 
                      src={coin_logos[3]} 
                      className="list-coin-logo"
                      alt="xrp" />
                    }
                    { record.coin === 'tron' && 
                      <img 
                      src={coin_logos[4]} 
                      className="list-coin-logo"
                      alt="trx" />
                    }                    
                </Fragment>
            );
        }
    },
    {
        key: "coin",
        text: "Coin",
        className: "id",
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
        key: "balance",
        text: "Wallet Balance",
        className: "email",
        align: "left",
        sortable: true
    },
    {
        key: "userId",
        text: "User ID",
        className: "uid",
        align: "left",
        sortable: true
    },
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
  const getData = () => {
    axios
      .post('/api/v1/admin/wallet/all')
      .then((res) => {
        setRecords(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }
  const [records, setRecords] = React.useState([]);
  useEffect(() => {
    getData();
  }, []);
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
    </div>
  );
}