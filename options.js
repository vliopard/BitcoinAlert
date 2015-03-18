// Menu and page snippets
var sCurPage = "";

function OpenPage(sPageName)
{
    if (sCurPage !== "")
    {
        $(sCurPage).slideUp(300, function() {
            $(sPageName).slideDown(500);
        });
    }
    else
        $(sPageName).slideDown(500);

    sCurPage = sPageName;
}

$(document).ready(function() {
    restore_options();

    $("#priceLink").click(function() {
        OpenPage("div#priceBox");
    });
    $("#timerLink").click(function() {
        OpenPage("div#timerBox");
    });
    $("#brokersLink").click(function() {
        OpenPage("div#brokersBox");
    });
    $("#aboutLink").click(function() {
        OpenPage("div#aboutBox");
    });

    OpenPage("div#priceBox");
});

$("#qrcodea").click(function() {
    $("#qrcodeimg").slideToggle();
});

// Save options to Localstorage
function save_options() {
    var currency = $('#currency').val();
    var timer = $('#timer').val();
    var price = $('#price').text();
	var lprice = $('#lprice').text();
	var lprice = $('#target').val();
    var percent = $('#percent').val();
	var dtime = $('#dtime').val();
	$('#target').text(lprice);
    if (!timer || !percent) {
        alert("The timer and percent threshold only accept positive integers.");
    } else {
        chrome.storage.local.set({
            'bitcoinalert_currency': currency,
            'bitcoinalert_timer': timer,
            'bitcoinalert_price': price,
			'bitcoinalert_lprice': lprice,
            'bitcoinalert_percent': percent,
			'bitcoinalert_dtime': dtime
        }, function() {
            $("#status").slideDown("slow", function() {
                setTimeout(function() {
                    $('#status').slideUp(400);
                }, 2000);
            });
        });
    }
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    chrome.storage.local.get("bitcoinalert_currency", function(fetchedData) {
        var currency = fetchedData.bitcoinalert_currency;
        if (!currency)
            return;
        $('#currency').val(currency);
        setCurrencyText();
    });

    chrome.storage.local.get("bitcoinalert_timer", function(fetchedData) {
        var timer = fetchedData.bitcoinalert_timer;
        if (!timer)
            return;
        $('#timer').val(timer);
    });

    chrome.storage.local.get("bitcoinalert_price", function(fetchedData) {
        var price = fetchedData.bitcoinalert_price;
        if (!price)
            return;
        $('#price').text(price);
    });

    chrome.storage.local.get("bitcoinalert_lprice", function(fetchedData) {
        var lprice = fetchedData.bitcoinalert_lprice;
        if (!lprice)
            return;
        $('#lprice').text(lprice);
		$('#target').val(lprice);
    });

    chrome.storage.local.get("bitcoinalert_percent", function(fetchedData) {
        var percent = fetchedData.bitcoinalert_percent;
        if (!percent)
            return;
        $('#percent').val(percent);
    });
	
    chrome.storage.local.get("bitcoinalert_dtime", function(fetchedData) {
        var dtime = fetchedData.bitcoinalert_dtime;
        if (!dtime)
            return;
        $('.dtime').text(dtime);
    });
}

$("#currency").change(function() {
    setCurrencyText();
});

function setCurrencyText() {
    var usedCurrency = $('#currency').find(":selected").val();
    $(".selectedCurrency").text(usedCurrency);
}

document.querySelector('#save').addEventListener('click', save_options);