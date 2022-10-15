var PROXY = 'http://ec2-52-206-247-119.compute-1.amazonaws.com:5000'
var animateButton = function(e) {
        e.preventDefault;
        //reset animation
        e.target.classList.remove('animate');
        
        e.target.classList.add('animate');
        
        e.target.classList.add('animate');
        setTimeout(function(){
          e.target.classList.remove('animate');
        },6000);
      };
        
var t = function(e){
    var c = 1
    if(c == 1){
        //e.target.classList.add('success');
        //let fetchRes = fetch('http://localhost:5000/moin');
        //fetchRes.then(res=>res.json()).then(d=>{document.getElementById('content').innerHTML=("Transfered on Rate: " + d.fills[0].price+" ["+d.symbol+"]"+"<br>"+"Trade ID : "+d.fills[0].tradeId)}).then(a=>{balance()})
        //fetchRes.then(res=>{console.log("===>",res)})
        let symbol = dropdownMenu();
        let quantity = String(document.getElementById('quantity').value);
        if(symbol == "failed"){
            document.getElementById('content').innerHTML= "Pair not exist. !";
            e.target.classList.add('error');
        }else{
            let fetchRes = fetch(PROXY+'/moin/'+symbol+"/"+quantity);
            fetchRes.then(res=>res.json()).then(d=>{document.getElementById('content').innerHTML=("Transfered on Rate: " + d.fills[0].price+" ["+d.symbol+"]"+"<br>"+"Trade ID : "+d.fills[0].tradeId)}).then(a=>{balance()}).then(a=>{history(symbol)})

            e.target.classList.add('success');
        }
        //document.getElementById('content').innerHTML= symbol;
        animateButton(e);
        
    }else{
        e.target.classList.add('error');
        animateButton(e)
    }
}


var classname = document.getElementsByClassName("button");
    for (var i = 0; i < classname.length; i++) {
        classname[i].addEventListener('click', t, false);
}

function history(symbol){
    
    let fetchRes = fetch(PROXY+'/history/'+String(symbol));
    fetchRes.then(res=>res.json()).then(d=>{
        console.log(d);
        d = myArrayDictSort(d)
        console.log(d);
        for(let i=0;i<5;i++){
            let timeVar = new Date(d[i]['time']);
            let time = timeVar.getDate() + '-' + (timeVar.getMonth()+1) + '-' + timeVar.getFullYear()+' '+ timeVar.getHours()+':'+timeVar.getMinutes()+":"+timeVar.getSeconds();    
            text = "("+(i+1)+".) "+"Time: "+String(time)+" |" +"Symbol: "+ d[i]['symbol']+" |" +"Quantity "+ d[i]['qty']+" |"+ "Commision Amount: "+ String(d[i]['commission'])+" " + d[i]['commissionAsset']
            historyListCreate(text);
            }
        
        });
}

function historyListCreate(text) {
    var x = document.createElement("LI");
    var t = document.createTextNode(text);
    x.appendChild(t);
    document.getElementById("historyList").appendChild(x);
}
function myArrayDictSort(res){
    let d = res
    let l = d.length;
    for(let i=0; i < l; i++){
        for(j=i; j < l; j++){
           // console.log(d[i]['age'] ,d[j]['age']);
            
            if(d[i]['id'] < d[j]['id']){
                t=d[i];
                d[i]=d[j];
                d[j]=t;
            }
        }
    }
    return d
}

function balance() {
    let fetchRes = fetch(PROXY+'/balance');
    fetchRes.then(res=>res.json()).then(d=>{
    document.getElementById('b1').children[0].innerHTML=d.balances[0]['asset'];
    document.getElementById('b1').children[1].innerHTML=d.balances[0]['free'];
    let CurrentBal = document.getElementsByClassName("currentbal");
    let CurrencyName = document.getElementsByClassName("currencyname");
    for (var i = 0; i < CurrentBal.length; i++) {
        CurrencyName[i].innerHTML = d.balances[i]['asset'];
        CurrentBal[i].innerHTML = d.balances[i]['free'];
    }
    console.log(d.balances[0]['free']);
    });
}
window.onload = balance();
window.onload=history('ETHBTC')


function dropdownMenu(){
    tradeList = ['BTCBUSD', 'BTCUSDT', 'ETHBTC', 'ETHBUSD', 'ETHUSDT', 'BNBBTC', 'BNBETH', 'BNBBUSD', 'BNBUSDT', 'BUSDUSDT', 'LTCBTC', 'LTCETH', 'LTCBNB', 'LTCBUSD', 'LTCUSDT', 'TRXBTC', 'TRXETH', 'TRXBNB', 'TRXBUSD', 'TRXUSDT', 'TRXXRP', 'XRPBTC', 'XRPETH', 'XRPBNB', 'XRPBUSD', 'XRPUSDT'];
    let symbol = document.getElementById('from').value + document.getElementById('to').value;
    symbolExist = String(tradeList.includes(symbol));
    if(symbolExist == "true"){
        return (symbol)
    }
    return("failed");
}

