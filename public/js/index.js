$(function(){
	bindLogout();
	
});


$(document).data('pageDate', getDateFromParams());

$(document).ready(function() {
	bindNewItem();

	$('#newItem .item').focus();
	bindLogout();
	makeDayLinkActive();
	setDateHeader();
	getUser();
	getFoodItems();
	getWeeklyData();
});

function bindLogout() {
	$('#logout').click(function() {
		$.post('/logout', function(data) {
			window.location = '/login.html';
		});
	});
}

function getPageDate() {
	return new Date($(document).data('pageDate'));
}

function makeDayLinkActive() {
	var day = getPageDate().getDay() + 6;
	var link = $('#nav').children()[day % 7];
	$(link).attr('class', 'active');
}

function getDayStartingOnMonday(day) {
	return (day + 6) % 7;
}

function getUrlParams() {
	if (window.location.search === "") {
		return {};
	} else {
		var query = window.location.search.split('?');
		if (query[1]) {
			var result = {};
			$(query[1].split('&')).each(function(index, element) {
				var keyValue = element.split('=');
				result[keyValue[0]] = keyValue[1];
			});
			return result;
		}
	}
	return {};
}

function dayStringToDayOfWeek(dayString) {
	switch (dayString.toLowerCase()) {
		case 'sunday':
			return 0;
			break;
		case 'monday':
			return 1;
			break;
		case 'tuesday':
			return 2;
			break;
		case 'wednesday':
			return 3;
			break;
		case 'thursday':
			return 4;
			break;
		case 'friday':
			return 5;
			break;
		case 'saturday':
			return 6;
			break;
	}
}

function getDateFromParams() {
	var params = getUrlParams();

	if (params.date) {
		if (params.date.match(/^\d{4}-[0-1][0-9]-[0-3][0-9]$/)) { // yyyy-MM-dd
			return dateParser('yyyy-MM-dd', params.date);

		} else if (params.date.match(/sunday|monday|tuesday|wednesday|thursday|friday|saturday/i)) {
			var today = new Date();

			var day = dayStringToDayOfWeek(params.date);
			var todayDay = today.getDay();

			var offset = day - today.getDay();

			if (offset > 0) {
				offset = offset - 7;
			}

			today.setDate(today.getDate() + offset);
			return today;
		} else if (params.date.match(/^today$/)) {
			return new Date();
		} else if (params.date.match(/^tomorrow$/)) {
			var date = new Date();
			date.setDate(date.getDate() + 1);
			return date;
		} else if (params.date.match(/^yesterday/)) {
			var date = new Date();
			date.setDate(date.getDate() - 1);
			return date;
		}
	}

	return new Date();
}

function dateParser(format, date) {
	var _year, _month, _day;
	switch (format) {
		case 'yyyy-MM-dd':
			var parts = date.split('-');
			_year = parts[0];
			_month = parts[1];
			_day = parts[2];
			break;
	}
	return new Date(_month + "-" + _day + "-" + _year);
}

function getUser() {
	$.get('/wccr_functional/ajax/user.php', function(data) {
		if (!data.success) {
			window.location = '/wccr_functional/login.html';
		} else {
			$('#user').html(data.user.user);
		}
	});
}

function getFoodItems() {
	var date = getPageDate().toJSON();
	$.get('/wccr_functional/ajax/foodItem.php', {date: date}, function(data) {
		if (data.success) {
			for (var key in data.foodItems) {
				var foodItem = data.foodItems[key];

				addRow(foodItem);
			}
		} else {
			console.log('get foodItems failed');
		}
	});
}

function postFoodItem(foodItem) {
	var date = foodItem.date.toJSON();

	$.post('/wccr_functional/ajax/foodItem.php', {foodItem: foodItem, date: date}, function(data) {
		console.log(data);
	});
}

function deleteFoodItem(foodItem) {
	$.post('/wccr_functional/ajax/foodItem.php', {delete: true, foodItem: foodItem}, function(data) {
		console.log(data);
	});
}

function putFoodItem(foodItem) {
	$.post('/wccr_functional/ajax/foodItem.php', {put: true, foodItem: foodItem}, function(data) {
		console.log(data);
	});
}

function setDateHeader() {
	$('#date').html(FormatDateAsFullString(getPageDate()));
}

function FormatDateAsFullString(date) {
	var parts = date.toString().split(' ');

	return parts[0] + ' ' + parts[1] + ' ' + parts[2] + ' ' + parts[3];
}

function getMondayOfWeek(date) {
	var newDate = new Date(date);
	newDate.setDate(newDate.getDate() - (newDate.getDay() + 6) % 7);
	return newDate;
}

