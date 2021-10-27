import React, {useState, useEffect} from "react";
import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem';
import Card from "../../components/Card/Card.js";
import CardBody from "../../components/Card/CardBody.js";
import styles from '../../assets/jss/material-dashboard-react/views/dashboardStyle';
import {makeStyles} from '@material-ui/core/styles';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import {toast, ToastContainer} from 'react-toastify';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import QRCode from 'qrcode.react';
import axios from 'axios';
import {lowerCase} from "change-case-all";
import WAValidator from 'wallet-address-validator';
import {useSelector} from 'react-redux';

const useStyles = makeStyles(styles);
export default function Dashboard() {
  const classes = useStyles();
  const {userData} = useSelector((state) => state.auth);
  const [dlgOpen, setOpen] = React.useState(false);
  const [selectedCoin, setCoin] = React.useState(null);
  const [selectedAction, setAction] = React.useState(null);
  const [selectedAddress, setAddress] = useState('');
  const [balances, setBalances] = useState({});
  const [amount, setAmount] = useState(0);
  const [toAddress, setToAddress] = useState('');
  const [prices, setPrices] = useState({});
  const [destination_tag, setTag] = useState('');
  const [xrpTag, setXRPTag] = useState('');
  const clear = () => {
    setOpen(false);
    setCoin(null);
    setAmount(0);
    setToAddress('');
  }
  const handleOpen = (coinCode, action) => {
    axios
      .post('/api/v1/dev/wallet/getaddress', {coin: coinCode, userId: userData.userId})
      .then(res => {
        setAddress(res.data.address);
        setXRPTag(res.data.destination_tag);
        setOpen(true);
        setCoin(coinCode);
        setAction(action);
      });
  }
  const handleClose = () =>{
    setOpen(false);
    setCoin(null);
    setAction(null);
  }
  const handleWithdraw = () => {
    if(amount === 0){
      toast('Please input withdraw amount', {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    var valid;
    if (selectedCoin === 'TRX' || selectedCoin === 'OMNI') {
      valid = true;
    } else {
      valid = WAValidator.validate(toAddress, selectedCoin);
    }
    if(valid) {
      const selected_balance = parseFloat(balances[lowerCase(selectedCoin)]);
      if(parseFloat(amount)>selected_balance) {
        toast('insufficient balance refer your', {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      } else {
        var payload = {
          userId: userData.userId,
          fromAddress: selectedAddress,
          toAddress: toAddress,
          amount: amount,
          coin: selectedCoin,
          destination_tag: destination_tag
        };
        // setOpen(false);
        axios.post('/api/v1/dev/transaction/withdraw', payload)
          .then((res) => {
            if(res.data.msg === 'success') {
              toast('Withdraw successfully!', {
                position: toast.POSITION.TOP_CENTER,
              });
              clear();
              getData();
            } else {
              toast('Withdraw Failure', {
                position: toast.POSITION.TOP_CENTER,
              });
            } 
          })
          .catch(err => {
            toast('Withdraw Failure', {
              position: toast.POSITION.TOP_CENTER,
            });
          })
      }
    } else {
      toast('Invalid address', {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
  }

  const getData = () => {
    const pro_balance = new Promise((resolve, reject) => {
      axios
      .post('/api/v1/dev/wallet/getbalances', {userId: userData.userId})
      .then(res=>{
        setBalances(res.data);
        resolve();
      })
      .catch(err => reject());
    });
    const pro_price = new Promise((resolve, reject) => {
      axios
        .post('/api/v1/dev/auth/get-coin', {userId: userData.userId})
        .then((res) => {
            if(res.data.msg) {
                reject();
            } else {
                var rates = {
                  'btc': res.data[0].price,
                  'eth': res.data[1].price,
                  'ltc': res.data[2].price,
                  'xrp': res.data[3].price,
                  'trx': res.data[4].price,
                  'omni': res.data[5].price,
                }                 
                setPrices(rates);
                resolve();
            }
        })
        .catch(err => {
            console.error(err);
            reject();
        });
    });
    Promise.all([pro_balance, pro_price])
      .then((value) => {
        return;
      })
      .catch(err => {
        console.error(err);
        throw err;
      })
  }  
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <GridContainer>
          <GridItem xs={12} sm={6} md={4}>
            <Card>
              <CardBody>
                <GridContainer>
                  <GridItem xs={3} sm={3} md={3}>
                  <img 
                    src={process.env.PUBLIC_URL + "/images/coin_logos/btc.png"} 
                    className="coin-logo"
                    alt='BTC' />
                  </GridItem>
                  <GridItem xs={9} sm={9} md={9}>
                    <h4 className={classes.cardTitle}>Bitcoin ( BTC )</h4>
                    <hr></hr>
                    <h5 className={classes.cardTitle}>
                      {balances.btc && <>{balances.btc} | ({(balances.btc * prices.btc).toFixed(8)} $)</>}
                    </h5>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <hr></hr>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={6}>
                    <Button color="primary" variant='outlined' onClick={() => {handleOpen('BTC', 'deposit')}} className="fullWidth">
                      <ArrowUpwardIcon /> Deposit
                    </Button>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={6}>
                    <Button color="secondary" variant='outlined' onClick={() => {handleOpen('BTC', 'withdraw')}} className="fullWidth">
                      <ArrowDownwardIcon /> Withdraw
                    </Button>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>            
          </GridItem>
          <GridItem xs={12} sm={6} md={4}>
            <Card>
              <CardBody>
                <GridContainer>
                  <GridItem xs={3} sm={3} md={3}>
                  <img 
                    src={process.env.PUBLIC_URL + "/images/coin_logos/eth.png"} 
                    className="coin-logo"
                    alt='ETH' />
                  </GridItem>
                  <GridItem xs={9} sm={9} md={9}>
                    <h4 className={classes.cardTitle}>Ethereum ( ETH )</h4>
                    <hr></hr>
                    <h5 className={classes.cardTitle}>
                    {balances.eth && <>{balances.eth} | ({(balances.eth * prices.eth).toFixed(8)} $) </>}
                    </h5>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <hr></hr>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={6}>
                    <Button color="primary" variant='outlined' onClick={() => {handleOpen('ETH', 'deposit')}} className="fullWidth">
                      <ArrowUpwardIcon /> Deposit
                    </Button>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={6}>
                    <Button color="secondary" variant='outlined' onClick={() => {handleOpen('ETH', 'withdraw')}} className="fullWidth">
                      <ArrowDownwardIcon /> Withdraw
                    </Button>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>            
          </GridItem>
          <GridItem xs={12} sm={6} md={4}>
            <Card>
              <CardBody>
                <GridContainer>
                  <GridItem xs={3} sm={3} md={3}>
                  <img 
                    src={process.env.PUBLIC_URL + "/images/coin_logos/ltc.png"} 
                    className="coin-logo"
                    alt='LTC' />
                  </GridItem>
                  <GridItem xs={9} sm={9} md={9}>
                    <h4 className={classes.cardTitle}>Litecoin ( LTC )</h4>
                    <hr></hr>
                    <h5 className={classes.cardTitle}>
                    {balances.ltc && <>{balances.ltc} | ({(balances.ltc * prices.ltc).toFixed(8)} $)</>}
                    </h5>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <hr></hr>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={6}>
                    <Button color="primary" variant='outlined' onClick={() => {handleOpen('LTC', 'deposit')}} className="fullWidth">
                      <ArrowUpwardIcon /> Deposit
                    </Button>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={6}>
                    <Button color="secondary" variant='outlined' onClick={() => {handleOpen('LTC', 'withdraw')}} className="fullWidth">
                      <ArrowDownwardIcon /> Withdraw
                    </Button>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>            
          </GridItem>
          <GridItem xs={12} sm={6} md={4}>
            <Card>
              <CardBody>
                <GridContainer>
                  <GridItem xs={3} sm={3} md={3}>
                  <img 
                    src={process.env.PUBLIC_URL + "/images/coin_logos/omni.png"} 
                    className="coin-logo"
                    alt='OMNI' />
                  </GridItem>
                  <GridItem xs={9} sm={9} md={9}>
                    <h4 className={classes.cardTitle}>OMNI</h4>
                    <hr></hr>
                    <h5 className={classes.cardTitle}>
                    {balances.omni && <>{balances.omni} | ({(balances.omni * prices.omni).toFixed(8)} $)</>}
                    </h5>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <hr></hr>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={6}>
                    <Button color="primary" variant='outlined' onClick={() => {handleOpen('OMNI', 'deposit')}} className="fullWidth">
                      <ArrowUpwardIcon /> Deposit
                    </Button>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={6}>
                    <Button color="secondary" variant='outlined' onClick={() => {handleOpen('OMNI', 'withdraw')}} className="fullWidth">
                      <ArrowDownwardIcon /> Withdraw
                    </Button>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>            
          </GridItem>
          <GridItem xs={12} sm={6} md={4}>
            <Card>
              <CardBody>
                <GridContainer>
                  <GridItem xs={3} sm={3} md={3}>
                  <img 
                    src={process.env.PUBLIC_URL + "/images/coin_logos/xrp.png"} 
                    className="coin-logo"
                    alt='XRP' />
                  </GridItem>
                  <GridItem xs={9} sm={9} md={9}>
                    <h4 className={classes.cardTitle}>Ripple ( XRP )</h4>
                    <hr></hr>
                    <h5 className={classes.cardTitle}>
                    {balances.xrp && <>{balances.xrp} | ({(balances.xrp * prices.xrp).toFixed(8)} $)</>}
                    </h5>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <hr></hr>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={6}>
                    <Button color="primary" variant='outlined' onClick={() => {handleOpen('XRP', 'deposit')}} className="fullWidth">
                      <ArrowUpwardIcon /> Deposit
                    </Button>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={6}>
                    <Button color="secondary" variant='outlined' onClick={() => {handleOpen('XRP', 'withdraw')}} className="fullWidth">
                      <ArrowDownwardIcon /> Withdraw
                    </Button>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>            
          </GridItem>
          <GridItem xs={12} sm={6} md={4}>
            <Card>
              <CardBody>
                <GridContainer>
                  <GridItem xs={3} sm={3} md={3}>
                  <img 
                    src={process.env.PUBLIC_URL + "/images/coin_logos/trx.png"} 
                    className="coin-logo"
                    alt='TRX' />
                  </GridItem>
                  <GridItem xs={9} sm={9} md={9}>
                    <h4 className={classes.cardTitle}>Tron ( TRX )</h4>
                    <hr></hr>
                    <h5 className={classes.cardTitle}>
                    {balances.trx && <>{balances.trx} | ({(balances.trx * prices.trx).toFixed(8)} $)</>}
                    </h5>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <hr></hr>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={6}>
                    <Button color="primary" variant='outlined' onClick={() => {handleOpen('TRX', 'deposit')}} className="fullWidth">
                      <ArrowUpwardIcon /> Deposit
                    </Button>
                  </GridItem>
                  <GridItem xs={6} sm={6} md={6}>
                    <Button color="secondary" variant='outlined' onClick={() => {handleOpen('TRX', 'withdraw')}} className="fullWidth">
                      <ArrowDownwardIcon /> Withdraw
                    </Button>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>            
          </GridItem>
        </GridContainer>
        <Dialog open={dlgOpen}  aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{selectedAction === 'deposit' ? 'Deposit' : 'Withdraw'} ( {selectedCoin} )</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {selectedAction === 'deposit' ? (`Note : Scan the below QRCODE or, if you are not able to scan the QRCODE, you can Copy the "Deposit Address" using "Copy Wallet Address" Button.`) : ('Please enter crypto currency amount and withdraw address')}
              
            </DialogContentText>
            {
              selectedAction === 'deposit' ? (
                <GridContainer>
                  <GridItem xs={3} sm={3} md={3}>Subscribe
                    <QRCode value={selectedAddress} />
                  </GridItem>
                  <GridItem xs={9} sm={9} md={9}>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="wallet_address"
                      label="Wallet Address"
                      type="text"
                      fullWidth
                      variant='outlined'
                      value={selectedAddress}
                      inputProps={{
                        readOnly:true
                      }}
                    /> <br></br>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="wallet_address"
                      label="Destination Tag"
                      type="text"
                      fullWidth
                      variant='outlined'
                      value={xrpTag}
                      inputProps={{
                        readOnly:true
                      }}
                    />
                  </GridItem>
                </GridContainer>
              ) : (
                <>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="amount"
                    label="Amount"
                    type="text"
                    fullWidth
                    variant='outlined'
                    value={amount}
                    onChange={(e) => {setAmount(e.target.value)}}
                  />
                  <hr></hr>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="to_address"
                    label="Withdraw Address"
                    type="text"
                    fullWidth
                    variant='outlined'
                    value={toAddress}
                    onChange={(e) => {setToAddress(e.target.value)}}
                  />
                  {selectedCoin === 'XRP' && (
                    <>
                      <hr></hr>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="des_tag"
                        label="Destination Tag"
                        type="text"
                        fullWidth
                        variant='outlined'
                        value={destination_tag}
                        onChange={(e) => {setTag(e.target.value)}}
                      />
                    </>
                  )}
                </>
              )}
          </DialogContent>
          <DialogActions>
            {selectedAction === 'deposit' ? (
              <Button onClick={() => {handleClose()}} color="secondary" variant='outlined'>
                Close
              </Button>
            ):(
              <>
                <Button onClick={() => {handleWithdraw()}} color="primary" variant='outlined'>
                  Withdraw
                </Button>
                <Button onClick={() => {handleClose()}} color="secondary" variant='outlined'>
                  Close
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
        <ToastContainer />
    </div>
  );
}
