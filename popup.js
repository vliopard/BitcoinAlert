var lowPrice = 90000000;
var savedPrice = 0.00;
var currentPrice = 0.00;
var currency = 0;
var dtime = 0;
var id = 0;

$(document).ready(function() {
    chrome.storage.local.get("bitcoinalert_currency", function(fetchedData) {
        var currencyO = fetchedData.bitcoinalert_currency;
        if (currencyO)
            currency = currencyO;        
    });
	
    chrome.storage.local.get("bitcoinalert_price", function(fetchedData) {
        var priceO = fetchedData.bitcoinalert_price;
        if (priceO)
            savedPrice = priceO;        
    });
	
    chrome.storage.local.get("bitcoinalert_lprice", function(fetchedData) {
        var priceL = fetchedData.bitcoinalert_lprice;
        if (priceL)
            lowPrice = parseFloat(priceL);
    });

    setTimeout(function() {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "https://www.mercadobitcoin.net/api/ticker/", true);
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
			var elem = xhr.responseText;
			var sin = elem.indexOf("last");
			var aux = elem.substring(sin);
			var a = aux.indexOf(":");
			var b = aux.indexOf(".");
			var currentdate = new Date(); 
			
			dtime = ('0' + currentdate.getDate()).slice(-2) + '/'
				+ ('0' + (currentdate.getMonth()+1)).slice(-2) + '/'
				+ currentdate.getFullYear() + " "  
                + ('0' + (currentdate.getHours())).slice(-2) + ":"  
                + ('0' + (currentdate.getMinutes())).slice(-2) + ":" 
                + ('0' + (currentdate.getSeconds())).slice(-2);
				
			currentPrice = parseFloat(aux.substring(a+1,b+3));
			chrome.browserAction.setIcon({path:"icon.png"});
			$("#current").text("B 1.00 = " + currency + " " + currentPrice.toFixed(2) + " (R$ " + lowPrice.toFixed(2)+ ") " + dtime);
			
			if ( parseFloat(currentPrice) < parseFloat(lowPrice) )
			{
				chrome.storage.local.set({
						'bitcoinalert_lprice': currentPrice});
			}
			chrome.storage.local.set({
					'bitcoinalert_price': currentPrice});
			chrome.storage.local.set({
					'bitcoinalert_dtime': dtime});			
		  }
		}
		xhr.send(); 
    }, 200); // Delay to load settings	
});

function callback() {
}

function notify_me() {

	var delt = 0.00;
	var change = 0.00;

    chrome.storage.local.get("bitcoinalert_currency", function(fetchedData) {
        var currencyO = fetchedData.bitcoinalert_currency;
        if (currencyO)
            currency = currencyO;        
    });
	
    chrome.storage.local.get("bitcoinalert_price", function(fetchedData) {
        var priceO = fetchedData.bitcoinalert_price;
        if (priceO)
            savedPrice = priceO;        
    });
	
    chrome.storage.local.get("bitcoinalert_lprice", function(fetchedData) {
        var priceL = fetchedData.bitcoinalert_lprice;
        if (priceL)
            lowPrice = priceL;        
    });
	
    chrome.storage.local.get("bitcoinalert_delta", function(fetchedData) {
        var delta = fetchedData.bitcoinalert_delta;
        if (delta)
            delt = delta;
    });

	var direction = "stable";
    var icon = "icon_up.png";
	
    if (savedPrice < lowPrice)
	{
        icon = "icon_down.png";
		direction = "down";
		change = lowPrice - savedPrice
	}
	else
	{
		direction = "up";
		change = savedPrice - lowPrice
	}
		
    var opt = {
        type: "basic",
		title: "Price " + direction + " " + currency + " " + parseFloat(change).toFixed(2) + " /\\ " + delt.toFixed(2),
        message: "B 1.00 = " + currency + " " + parseFloat(savedPrice).toFixed(2) + " ["+ dtime +"]",
        iconUrl: icon
    }
    chrome.notifications.create(id.toString(), opt, callback);
    id++;
}

function options() {
	chrome.tabs.create({'url': "/options.html" } )
}

document.querySelector('#upd').addEventListener('click', notify_me);
document.querySelector('#opt').addEventListener('click', options);
