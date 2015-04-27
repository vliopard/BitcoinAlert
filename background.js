var currency = "BRL";
var timer = 1;
var percent = 1;
var dtime = 0;

var lowPrice = 90000000.00;
var savedPrice = 0.00;
var upperbound = 0.00;
var lowerbound = 0.00;
var tempPrice = 0.00;

var id = 0;

$(document).ready(function() {
// getSavedPrice
    chrome.storage.local.get("bitcoinalert_price", function(fetchedData) {
        var priceO = fetchedData.bitcoinalert_price;
        if (priceO)
            savedPrice = parseFloat(priceO);
    });
	
    chrome.storage.local.get("bitcoinalert_lprice", function(fetchedData) {
        var priceL = fetchedData.bitcoinalert_lprice;
        if (priceL)
            lowPrice = parseFloat(priceL);
    });
// getSettings
    chrome.storage.local.get("bitcoinalert_currency", function(fetchedData) {
        var currencyO = fetchedData.bitcoinalert_currency;
        if (currencyO)
            currency = currencyO;
    });
    chrome.storage.local.get("bitcoinalert_timer", function(fetchedData) {
        var timerO = fetchedData.bitcoinalert_timer;
        if (timerO)
            timer = parseInt(timerO);
    });
    chrome.storage.local.get("bitcoinalert_percent", function(fetchedData) {
        var percentO = fetchedData.bitcoinalert_percent;
        if (percentO)
            percent = parseFloat(percentO);
    });
    chrome.storage.local.get("bitcoinalert_dtime", function(fetchedData) {
        var dtimeO = fetchedData.bitcoinalert_dtime;
        if (dtimeO)
            dtime = dtimeO;
    });
    startTimer();
});
/*
setTimeout(function() {
    startTimer();
}, 2000); // Delay to load settings
*/

function checkCourses() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://www.mercadobitcoin.net/api/ticker/", true);
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {
		var elem = xhr.responseText;
		var sin = elem.indexOf("last");
		var aux = elem.substring(sin);
		var a = aux.indexOf(":");
		var b = aux.indexOf(".");
		tempPrice = parseFloat(aux.substring(a+1,b+3));
			var currentdate = new Date(); 
			
			dtime = ('0' + currentdate.getDate()).slice(-2) + '/'
				+ ('0' + (currentdate.getMonth()+1)).slice(-2) + '/'
				+ currentdate.getFullYear() + " "  
                + ('0' + (currentdate.getHours())).slice(-2) + ":"  
                + ('0' + (currentdate.getMinutes())).slice(-2) + ":" 
                + ('0' + (currentdate.getSeconds())).slice(-2);
				
    chrome.storage.local.get("bitcoinalert_lprice", function(fetchedData) {
        var priceL = fetchedData.bitcoinalert_lprice;
        if (priceL)
            lowPrice = parseFloat(priceL);
    });
		var dPrice = 0.00;
		var fPrice = 0.00;
		if(parseFloat(tempPrice) < parseFloat(lowPrice))
		{
			alert("R$ "+lowPrice.toFixed(2)+" > R$ "+tempPrice.toFixed(2)+" "+dtime);
			dPrice = parseFloat(lowPrice) - parseFloat(tempPrice);
			fPrice = parseFloat(tempPrice) - parseFloat(savedPrice);
			chrome.browserAction.setIcon({path:"icon_alert.png"});
			showNotification(tempPrice, "down", dPrice, fPrice);
			chrome.storage.local.set({
				'bitcoinalert_lprice': tempPrice});
		}
		else
		{
			dPrice = parseFloat(tempPrice) - parseFloat(lowPrice);
			fPrice = parseFloat(savedPrice) - parseFloat(tempPrice);
		}
		if (savedPrice !== 0) {
			upperbound = (parseInt(savedPrice) + (savedPrice * (percent / 100)));
			lowerbound = (savedPrice - (savedPrice * (percent / 100)));
			if (tempPrice.toFixed(2) > upperbound.toFixed(2)) {
				showNotification(tempPrice, "up", dPrice, fPrice);
			}
			if (tempPrice.toFixed(2) < lowerbound.toFixed(2)) {
				showNotification(tempPrice, "down", dPrice, fPrice);
			}
		}		
		savedPrice = tempPrice;
		chrome.storage.local.set({
				'bitcoinalert_price': tempPrice});
		chrome.storage.local.set({
				'bitcoinalert_dtime': dtime});
		chrome.storage.local.set({
				'bitcoinalert_delta': fPrice});
	  }
	}
	xhr.send();				
}
function startTimer() {
    nIntervId = setInterval(checkCourses, timer * 60000);
}

function callback() {
}

function showNotification(price, direction, change, delt) {
    var icon = "icon_up.png";
    if (direction === "down")
        icon = "icon_down.png";
    var opt = {
        type: "basic",
        title: "Price " + direction + " " + currency + " " + change.toFixed(2) + " /\\ " + delt.toFixed(2),
        message: "B 1.00 = " + currency + " " + price.toFixed(2) + " ["+ dtime +"]",
        iconUrl: icon
    }
    chrome.notifications.create(id.toString(), opt, callback);
    id++;
}
