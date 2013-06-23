function evaluateNumber(value) {
	value = eval(value);
	
	if(!value || isNaN(value) || /^\s*$/.test(value) ) {
		value = 0;
	}
	
	return Number(value);
}
function addCommas(number) {
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
function removeCommas(number) {
	return String(number).replace(/,/g, '');
}
function numberToString(number, decimal) {
	return addCommas(Number(number).toFixed(decimal));
}
function stringToNumber(string) {
	return removeCommas(string);
}

function getValues(tr) {
	return {
		'gross' : $(tr).children('.gross').children('input').val(),
		'tare' : $(tr).children('.tare').children('input').val(),
		'net' : $(tr).children('.net').children('input').val(),
		'calPerGram' : $(tr).children('.calPerGram').children('input').val(),
		'cal' : $(tr).children('.cal').children('input').val()
	};
}

function setValues(tr, gross, tare, net, calPerGram, cal) { 

	$(tr).children('.gross').children('input').val(gross);
	$(tr).children('.tare').children('input').val(tare);
	$(tr).children('.net').children('input').val(net);
	$(tr).children('.calPerGram').children('input').val(calPerGram);
	$(tr).children('.cal').children('input').val(cal);
	
	$(tr).children('.gross').children('p').text(numberToString(gross,2));
	$(tr).children('.tare').children('p').text(numberToString(tare,2));
	$(tr).children('.net').children('p').text(numberToString(net,2));
	$(tr).children('.calPerGram').children('p').text(numberToString(calPerGram,2));
	$(tr).children('.cal').children('p').text(numberToString(cal,2));
	
	var id = $(tr).children("input.id").val();
	
	$.ajax({
		type: "POST",
		url: "updateNumbersWCCR.php",
		data: { 
			id: id,
			
			gross: gross,
			tare: tare,
			calPerGram: calPerGram,
			cal: cal,
			
			date: date
		}
		
	}).done(function(data){
		if(data !== "Failed") {
			var results = eval("("+data+")");
			$(".dailyTotal").children(".budgeted").text(results.dailyBudgeted);
			$(".dailyTotal").children(".totals").text(results.dailyCal);
			$(".dailyTotal").children(".balance").text(results.dailyBalance);
			
			$(".weeklyTotal").children(".budgeted").text(results.weeklyBudgeted);
			$(".weeklyTotal").children(".totals").text(results.weeklyCal);
			$(".weeklyTotal").children(".balance").text(results.weeklyBalance);
		}
		else {
			alert(data);
		}
	});
}

function doMath(td) { 
	var tr = $(td).parent();
	
	var values = getValues(tr);
	
	switch($(td).attr("class")) {
	case "gross":
		values.net = values.gross - values.tare;
		values.cal = values.net * values.calPerGram;
		break;
	case "tare":
		values.net = values.gross - values.tare;
		values.cal = values.net * values.calPerGram;
		break;
	case "net":
		values.gross = values.net + values.tare;
		values.cal = values.net * values.calPerGram;
		break;
	case "calPerGram":
		values.cal = values.net * values.calPerGram;
		break;
	case "cal":
		values.net = values.cal - values.calPerGram;
		values.gross = values.net + values.tare;
		break;
	}
	
	setValues(tr, values.gross, values.tare, values.net,
					values.calPerGram, values.cal);
}

function updateItemWCCR(tr, item) {
	var id = $(tr).children("input.id").val();

	$.ajax({
		type: "POST",
		url: "updateItemWCCR.php",
		data: { 
			id: id,
			
			item: item
		}
		
	}).done(function(data){
		if(data !== "Failed") {
			
		}
		else {
			alert(data);
		}
	});
}

function pClick() {
	$(this).hide();
	
	var td = $(this).parent();
	$(td).css("padding", "0px");
	var width = $(td).width();
	var height = $(td).height();
	
	var input = $(td).children("input");
	$(input).width(width -10);
	$(input).height(height);
	$(input).show();
	
	$(input).focus();
}

function inputBlur(event) {
	$(this).hide();
	
	var td = $(this).parent();
	
	var value = $(this).val();
	
	if($(td).attr("class") !== "item") {
		value = evaluateNumber(value);
	}
	
	$(this).val(value);

	$(td).removeAttr("style");
	
	if($(td).attr("class") !== "item") {
		value = numberToString(value,2);
		doMath(td);
	}
	else {
		updateItemWCCR($(td).parent(), value);
	}
	
	var p = $(td).children("p");
	$(p).text(value);
	$(p).show();
}

function intitializeClicks() {
	$('.wccr tbody .item p').click(pClick);
	$('.wccr tbody .item input').blur(inputBlur);
	$('.wccr tbody .gross p').click(pClick);
	$('.wccr tbody .gross input').blur(inputBlur);
	$('.wccr tbody .tare p').click(pClick);
	$('.wccr tbody .tare input').blur(inputBlur);
	$('.wccr tbody .net p').click(pClick);
	$('.wccr tbody .net input').blur(inputBlur);
	$('.wccr tbody .calPerGram p').click(pClick);
	$('.wccr tbody .calPerGram input').blur(inputBlur);
	$('.wccr tbody .cal p').click(pClick);
	$('.wccr tbody .cal input').blur(inputBlur);
	
	// Do blur on enter
	$('.wccr tbody .item input').keyup(function(){if(event.keyCode === 13)$(this).blur();});
	$('.wccr tbody .gross input').keyup(function(){if(event.keyCode === 13)$(this).blur();});
	$('.wccr tbody .tare input').keyup(function(){if(event.keyCode === 13)$(this).blur();});
	$('.wccr tbody .net input').keyup(function(){if(event.keyCode === 13)$(this).blur();});
	$('.wccr tbody .calPerGram input').keyup(function(){if(event.keyCode === 13)$(this).blur();});
	$('.wccr tbody .cal input').keyup(function(){if(event.keyCode === 13)$(this).blur();});
	
	// Remove effects of the enter key
	$('.wccr tbody .item input').keypress(function(){if(event.keyCode === 13)return false;});
	$('.wccr tbody .item input').keydown(function(){if(event.keyCode === 13)return false;});
	$('.wccr tbody .gross input').keypress(function(){if(event.keyCode === 13)return false;});
	$('.wccr tbody .gross input').keydown(function(){if(event.keyCode === 13)return false;});
	$('.wccr tbody .tare input').keypress(function(){if(event.keyCode === 13)return false;});
	$('.wccr tbody .tare input').keydown(function(){if(event.keyCode === 13)return false;});
	$('.wccr tbody .net input').keypress(function(){if(event.keyCode === 13)return false;});
	$('.wccr tbody .net input').keydown(function(){if(event.keyCode === 13)return false;});
	$('.wccr tbody .calPerGram input').keypress(function(){if(event.keyCode === 13)return false;});
	$('.wccr tbody .calPerGram input').keydown(function(){if(event.keyCode === 13)return false;});
	$('.wccr tbody .cal input').keypress(function(){if(event.keyCode === 13)return false;});
	$('.wccr tbody .cal input').keydown(function(){if(event.keyCode === 13)return false;});
}

function removeRow(input){
	var tr = $(input).parent().parent();
	
	var id = $(tr).children(".id").val();
	
	$.ajax({
		type: "POST",
		url: "removeRowWCCR.php",
		data: { 
			id: id,
			
			date: date
		}
		
	}).done(function(data){
		if(data !== "Failed") {
			var results = eval("("+data+")");
			$(".dailyTotal").children(".budgeted").text(results.dailyBudgeted);
			$(".dailyTotal").children(".totals").text(results.dailyCal);
			$(".dailyTotal").children(".balance").text(results.dailyBalance);
			
			$(".weeklyTotal").children(".budgeted").text(results.weeklyBudgeted);
			$(".weeklyTotal").children(".totals").text(results.weeklyCal);
			$(".weeklyTotal").children(".balance").text(results.weeklyBalance);
		}
		else {
			alert(data);
		}
	});
	
	$(tr).detach();
}

function blurMath() {
	var number = $(this).val();
	
	number = eval(number);
	
	number = validateNumber(String(number));
	
	if(!number)
		return 0;
	
	numberToInput(number, this, 2);
}

$(document).ready(function() {
	$(".newItem .item input").focus();

	$(".newItem td.gross input").keyup(updateGrossInput);	
	$(".newItem td.tare input").keyup(updateTareInput);	
	$(".newItem td.net input").keyup(updateNetInput);	
	$(".newItem td.calPerGram input").keyup(updateCalPerGramInput);	
	$(".newItem td.cal input").keyup(updateCalInput);
	
	$(".newItem td.gross input").blur(blurMath);
	$(".newItem td.tare input").blur(blurMath);
	$(".newItem td.net input").blur(blurMath);
	$(".newItem td.calPerGram input").blur(blurMath);
	$(".newItem td.cal input").blur(blurMath);

	intitializeClicks();
});

function updateGrossInput(event){
	var inputGross = $(".newItem td.gross input");
	var inputTare = $(".newItem td.tare input");
	var inputNet = $(".newItem td.net input");
	var inputCalPerGram = $(".newItem td.calPerGram input");
	var inputCal = $(".newItem td.cal input");
	
	var gross = getNumberInput(inputGross);
	var tare = getNumberInput(inputTare);
	var net = getNumberInput(inputNet);
	var calPerGram = getNumberInput(inputCalPerGram);
	var cal = getNumberInput(inputCal);
	
	var net = gross - tare;
	var cal = net * calPerGram;
	
	numberToInput(net, inputNet, 2);
	
	if(calPerGram) {
		numberToInput(cal, inputCal, 2);	
	}
}
function updateTareInput(){
	var inputGross = $(".newItem td.gross input");
	var inputTare = $(".newItem td.tare input");
	var inputNet = $(".newItem td.net input");
	var inputCalPerGram = $(".newItem td.calPerGram input");
	var inputCal = $(".newItem td.cal input");
	
	var gross = getNumberInput(inputGross);
	var tare = getNumberInput(inputTare);
	var net = getNumberInput(inputNet);
	var calPerGram = getNumberInput(inputCalPerGram);
	var cal = getNumberInput(inputCal);
	
	var net = gross - tare;
	var cal = net * calPerGram;
	
	numberToInput(net, inputNet, 2);
	
	if(calPerGram) {
		numberToInput(cal, inputCal, 2);	
	}	
}
function updateNetInput(){
	var inputGross = $(".newItem td.gross input");
	var inputTare = $(".newItem td.tare input");
	var inputNet = $(".newItem td.net input");
	var inputCalPerGram = $(".newItem td.calPerGram input");
	var inputCal = $(".newItem td.cal input");
	
	var gross = getNumberInput(inputGross);
	var tare = getNumberInput(inputTare);
	var net = getNumberInput(inputNet);
	var calPerGram = getNumberInput(inputCalPerGram);
	var cal = getNumberInput(inputCal);
	
	var gross = net + tare;
	var cal = net * calPerGram;
	
	numberToInput(gross, inputGross, 2);
	
	if(calPerGram) {
		numberToInput(cal, inputCal, 2);	
	}		
}
function updateCalPerGramInput(){
	var inputGross = $(".newItem td.gross input");
	var inputTare = $(".newItem td.tare input");
	var inputNet = $(".newItem td.net input");
	var inputCalPerGram = $(".newItem td.calPerGram input");
	var inputCal = $(".newItem td.cal input");
	
	var gross = getNumberInput(inputGross);
	var tare = getNumberInput(inputTare);
	var net = getNumberInput(inputNet);
	var calPerGram = getNumberInput(inputCalPerGram);
	var cal = getNumberInput(inputCal);
	
	var cal = net * calPerGram;
	
	if(net){
		numberToInput(cal, inputCal, 2);	
	}
}
function updateCalInput(){
	var inputGross = $(".newItem td.gross input");
	var inputTare = $(".newItem td.tare input");
	var inputNet = $(".newItem td.net input");
	var inputCalPerGram = $(".newItem td.calPerGram input");
	var inputCal = $(".newItem td.cal input");
	
	var gross = getNumberInput(inputGross);
	var tare = getNumberInput(inputTare);
	var net = getNumberInput(inputNet);
	var calPerGram = getNumberInput(inputCalPerGram);
	var cal = getNumberInput(inputCal);
	
	var net = cal/calPerGram;
	var gross = net + tare;
	
	if(calPerGram) {
		numberToInput(gross, inputGross, 2);
		numberToInput(net, inputNet, 2);
	}
}

function updateItem(tr, value){
	var item = $(tr).children('th.item p');
	
	$(item).text(value);
}
function updateGross(tr, value){
	
	value = validateNumber(value);
	
	if(!value) {
		$(tr).children('td.gross').text('');
		return;
	}
		
	var tdGross = $(tr).children('td.gross');
	var tdTare = $(tr).children('td.tare');
	var tdNet = $(tr).children('td.net');
	var tdCalPerGram = $(tr).children('td.calPerGram');
	var tdCal = $(tr).children('td.cal');
	
	var gross = value;
	var tare = getNumber(tdTare);
	var net = gross - tare;
	var calPerGram = getNumber(tdCalPerGram);
	var cal = net * calPerGram;
	
	numberToTd(net, tdNet, 2);
	numberToTd(cal, tdCal, 2);
	
	numberToTd(gross, tdGross, 2);
	
	calcTotals();
}
function updateTare(tr, value){

	value = validateNumber(value);
	
	if(!value) {
		$(tr).children('td.tare').text('');
		return;
	}
	
	var tdGross = $(tr).children('td.gross');
	var tdTare = $(tr).children('td.tare');
	var tdNet = $(tr).children('td.net');
	var tdCalPerGram = $(tr).children('td.calPerGram');
	var tdCal = $(tr).children('td.cal');
	
	var gross = getNumber(tdGross);
	var tare = value;
	var net = gross - tare;
	var calPerGram = getNumber(tdCalPerGram);
	var cal = net * calPerGram;

	numberToTd(net, tdNet, 2);
	numberToTd(cal, tdCal, 2);
	
	numberToTd(tare, tdTare, 2);
	
	calcTotals();
}
function updateNet(tr, value){

	value = validateNumber(value);
	
	if(!value) {
		$(tr).children('td.net').text('');
		return;
	}
	
	var tdGross = $(tr).children('.gross');
	var tdTare = $(tr).children('.tare');
	var tdNet = $(tr).children('.net');
	var tdCalPerGram = $(tr).children('.calPerGram');
	var tdCal = $(tr).children('.cal');
	
	var tare = getNumber(tdTare);
	var net = value;
	var gross = net + tare;
	var calPerGram = getNumber(tdCalPerGram);
	var cal = net * calPerGram;

	numberToTd(gross, tdGross, 2);
	numberToTd(cal, tdCal, 2);
	
	numberToTd(net, tdNet, 2);
	
	calcTotals();
}
function updateCalPerGram(tr, value){
	
	value = validateNumber(value);
	
	if(!value) {
		$(tr).children('td.calPerGram').text('');
		return;
	}
	
	var tdNet = $(tr).children('.net');
	var tdCalPerGram = $(tr).children('.calPerGram');
	var tdCal = $(tr).children('.cal');
	
	var net = getNumber(tdNet);
	var calPerGram = value;
	var cal = net * calPerGram;

	numberToTd(cal, tdCal, 2);
	
	numberToTd(calPerGram, tdCalPerGram, 2);
	
	calcTotals();
}
function updateCal(tr, value){
	
	value = validateNumber(value);
	
	if(!value) {
		$(tr).children('td.cal').text('');
		return;
	}
	
	var tdGross = $(tr).children('.gross');
	var tdTare = $(tr).children('.tare');
	var tdNet = $(tr).children('.net');
	var tdCalPerGram = $(tr).children('.calPerGram');
	var tdCal = $(tr).children('.cal');
	
	var cal = value;
	var calPerGram = getNumber(tdCalPerGram);
	var net = cal/calPerGram;
	var tare = getNumber(tdTare);
	var gross = net + tare;
	
	numberToTd(gross, tdGross, 2);
	numberToTd(net, tdNet, 2);
	
	numberToTd(cal, tdCal, 2);
	
	calcTotals();
}

function tdClick(p, updateValue){
	// Get the current value
	var value = $(p).text();
	
	// Get the td
	var td = $(p).parent();
	
	// Get the td dimensions to make the input fill it
	$(td).css('padding','0px');
	var width = $(td).width()-10;
	var height = $(td).height();
	
	// Create an input for the user
	var input = document.createElement("input");
	input.setAttribute('class', 'input');
	$(input).val(value);
	$(input).width(width);
	$(input).height(height);
		
	// Clear the td and add the input
	$(td).empty();
	$(td).append(input);
	$(input).focus();
	
	// When the focus is lost or the user presses enter
	// remove the input and set back to regular td	
	function focusLost(){
		// get the input value
		value = $(input).val();
		
		// clear the td
		$(td).empty();
		
		// reset the padding
		td.removeAttr("style");
		
		// use the function passed in to know how to update the value
		updateValue($(td).parent() ,value); 
	}
	
	// When the user clicks away from the cell call the function
	$(input).blur(focusLost);
	
	// When the user hits enter
	$(input).keypress(function(event){
		// 13='Enter Key'
		if(event.keyCode === 13)
			focusLost();
	});
}

function validateNumber(value) {
	// removes commas
	value = String(value).replace(/,/g, '') ;
	
	// uses the eval function to do math.
	var value = eval(value);
	
	// Quit and leave blank if value is not a number
	if(!value || isNaN(value) || /\s/.test(value) ) {
		return false;
	}
	
	return value;
}

function addCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
function removeCommas(number) {
	return String(number).replace(/,/g, '');
}
function getNumber(td) {
	var number = validateNumber($(td).text());
	
	if(!number)
		return 0;
		
	return removeCommas(number);
}
function getNumberInput(input) {
	var number = $(input).val();
	
	number = eval(number);
	
	number = validateNumber($(input).val());
	
	if(!number)
		return 0;
		
	return Number(number);
}
function numberToTd(number, td, decimal) {
	$(td).html("<p></p>");
	$(td).children("p").text(numberToString2(number, decimal));
}
function numberToInput(number, input, decimal) {
	$(input).val(numberToString2(number, decimal));
} 
function numberToString2(number, decimal) {
	return addCommas(Number(number).toFixed(decimal));
}



function calcTotals(){
	
	var totalCals = 0;
	
	var row = $(".wccr").children("tr");
	
	for(var i = 0; row[i]; i++) {
		var nextCal = parseFloat(removeCommas($(row[i]).children(".cal").text()));
		if(!isNaN(nextCal))
			totalCals += nextCal;
	}
		
	var tdBudgeted = $(".dailyTotal").children(".budgeted");
	var tdTotals = $(".dailyTotal").children(".totals");
	var tdBalance = $(".dailyTotal").children(".balance");
	var tdTotalCals = $("td.totalCals");
	
	var budgeted = getNumber(tdBudgeted);
	var totals = totalCals;
	var balance = budgeted - totals;
	
	numberToTd(totalCals, tdTotalCals, 0);
	numberToTd(totals, tdTotals, 0);
	numberToTd(balance, tdBalance, 0);
}

function addItem() {
	var item = $(".newItem td.item input").val();
	var gross = getNumberInput($(".newItem td.gross input"));
	var tare = getNumberInput($(".newItem td.tare input"));
	var net = getNumberInput($(".newItem td.net input"));
	var calPerGram = getNumberInput($(".newItem td.calPerGram input"));
	var cal = getNumberInput($(".newItem td.cal input"));
	
	$(".wccr").append("" +
	"<tr class='0'>" +
		"<th class='item'>"+item+"</th>" + 
		"<td class='gross'>"+numberToString(gross)+"</td>" +
		"<td class='tare'>"+numberToString(tare)+"</td>" +
		"<td class='net'>"+numberToString(net)+"</td>" +
		"<td class='calPerGram'>"+numberToString(calPerGram)+"</td>" +
		"<td class='cal'>"+numberToString(cal)+"</td>" +
	"</tr>");
	
	intitializeClicks();
	
	updateRowAjax();
}

function updateRowAjax() {

	//var item = $(tr).children('.item input').val();
	//var gross = $(tr).children('.gross input').val();
	//var tare = $(tr).children('.tare input').val();
	//var net = $(tr).children('.net input').val();
	//var calPerGram = $(tr).children('.calPerGram input').val();
	//var cal = $(tr).children('.cal input').val();
	
	var item = $('.item input').val();
	var gross = $('.gross input').val();
	var tare = $('.tare input').val();
	var net = $('.net input').val();
	var calPerGram = $('.calPerGram input').val();
	var cal = $('.cal input').val();
	
	
	
	$.ajax({
		type: "POST",
		url: "updateRowWCCR.php",
		data: { 
			date: date,
			
			item: item,
			gross: gross,
			tare: tare,
			net: net,
			calPerGram: calPerGram,
			cal: cal
		}
		
	}).done(function(data){
		alert(data);
	});
}
