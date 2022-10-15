
const express = require('express')
const path = require('path')
const CryptoJS = require('crypto-js')
const request = require('request')
var axios = require('axios');
const { url } = require('inspector');
const { send } = require('process');
const { stringify } = require('querystring');
const { json } = require('express');
const { Console } = require('console');
const app = express()
const port = 5000

var SECRETKEY = 'k4X1TeFvd01jPDCRwMbQsIOfWfkLsadUxDTeKQtvFB0l3lVlutx9vaCZcMSyucaC';
var APIKEY = 'N23V4UiGDhprYizldGEqwgtaiqdExjFaWLp8fDO8dahDuBa3YrOykEm16KRQgQHc';

//create own middleware.
// const moin = (req,res,next)=>{console.log(req); next();}  
// app.use(moin)

app.use(express.static(path.join(__dirname,"/public")))

app.get('/', (req, res) => {
  res.send('Hello World! ')
})

app.get('/about/:name', (req, res) => {
    res.send('About.. me! ' + req.params.name)
  })

app.get('/home',(req,res)=>{
	res.sendFile(path.join(__dirname,'index.html'));
  res.status(500);
 // res.json({"name":"df"});
});

app.get('/get',(req,res)=>{
  console.log("------")
  let geturl= converterVariables();
  let binanceResponse1 = currencyConverter(geturl)
  binanceResponse1.then((re)=>{res.send({"signed_url" : re})})
  console.log("------")
});

app.get('/moin/:symbol/:quantity',(req,res)=>{
  signedUrl = converterVariables(String(req.params.symbol),String(req.params.quantity))
  binanceResponse = currencyConverter(signedUrl);
  binanceResponse.then((re)=>{res.send(re.data)}) 
});
app.get('/balance',(req,res)=>{
  let balanceReturn = balance();
  balanceReturn.then((re)=>{res.send(re.data)})
});


app.get('/history/:symbol',(req,res)=>{
  let historyReturn = history(String(req.params.symbol));
  historyReturn.then((re)=>{res.send(re.data)})
});






app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})





function history(symbol){
  return new Promise(function(resolve,reject){
    let SYMBOL = String(symbol);
    let API_SECRET = SECRETKEY;
    let timestamp = Date.now(); 
    let API_HIS_URL = 'recvWindow=50000&symbol='+SYMBOL+'&limit=5&timestamp='+String(timestamp);
    let signature = CryptoJS.HmacSHA256(API_HIS_URL, API_SECRET).toString(CryptoJS.enc.Hex);
    let his_url = "https://testnet.binance.vision/api/v3/myTrades?recvWindow=50000&symbol="+SYMBOL+"&limit=5&timestamp="+String(timestamp)+"&signature="+String(signature);
    let configBal = {method: 'get',url: his_url,headers: {'Content-Type': 'application/json','X-MBX-APIKEY': APIKEY}}; 
    historyReturn = axios.get(his_url, configBal)
    if(his_url){ resolve(historyReturn) }else{ reject("Couldn't found History record") }

  });
}

function balance(){
  return new Promise(function(resolve, reject) {
  let API_SECRET = SECRETKEY;
  let timestamp = Date.now(); 
  let API_BAL_URL = 'recvWindow=50000&timestamp='+String(timestamp);
  let signature = CryptoJS.HmacSHA256(API_BAL_URL, API_SECRET).toString(CryptoJS.enc.Hex);
  let bal_url = "https://testnet.binance.vision/api/v3/account?recvWindow=50000&timestamp="+String(timestamp)+"&signature="+String(signature)
  let configBal = {method: 'get',url: bal_url,headers: {'Content-Type': 'application/json','X-MBX-APIKEY': APIKEY}}; 
  binanceReturn = axios.get(bal_url, configBal)
  if(bal_url){ resolve(binanceReturn) }else{ reject("Error in BALance URL") }

  });
}

function currencyConverter(url){
  return new Promise(function(resolve, reject) {
    let URL = url
    var config = {method: 'post',url: URL,headers: {'Content-Type': 'application/json','X-MBX-APIKEY': APIKEY}}; 
    var configReturn = axios(config);
    if(URL){ resolve(configReturn) }else{ reject("Error in URL") }
  });
}

function converterVariables(symbol,quantity){
  console.log("->",quantity);
  let API_SECRET = SECRETKEY;
  let timestamp = Date.now();
  let SYMBOL = String(symbol);
  let SIDE = 'SELL'
  let QUANTITY = quantity;
  let API_URL = 'symbol='+SYMBOL+'&side='+SIDE+'&type=MARKET&quantity='+String(QUANTITY)+'&timestamp='+timestamp;
  let signature = CryptoJS.HmacSHA256(API_URL, API_SECRET).toString(CryptoJS.enc.Hex);
  let url = 'https://testnet.binance.vision/api/v3/order?symbol='+SYMBOL+'&side='+SIDE+'&type=MARKET&quantity='+QUANTITY+'&timestamp='+String(timestamp)+'&signature='+String(signature)
  return url;
}





