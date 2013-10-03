
getTypeaheadValues();
initTotals();

function getTypeaheadValues() {
	var typeahead = {
		values: [],
		map: {},
		delim: '@@@@'
	};

	$(document).data('typeahead', typeahead);

//	var url = 'autoComplete.json';
	var url = 'ajax/calorieTable.php';

	$.getJSON(url, function(data) {
		var table = data.calorieTable;
		typeahead.map = {};
		for (var id in table) {
			typeahead.values.push(table[id].item + typeahead.delim + id);
			typeahead.map[id] = table[id];
		}
	});
}

function bindTypeahead(th, calgInput) {
	var typeahead = $(document).data('typeahead');

	$(th).typeahead({
		source: typeahead.values,
		updater: function(item) {
			var stuff = item.split(typeahead.delim);
			var label = stuff[0];
			var id = stuff[1];
			$(calgInput).val(typeahead.map[id].calg);
			return label;
		},
		highlighter: function(item) {
			var label = item.split(typeahead.delim)[0];
			var regex = new RegExp('(' + this.query + ')', 'gi');
			return label.replace(regex, "<strong>$1</strong>");
		}
	});
}

function initTotals() {
	$('#wccr').data('totals', {
		daily: {
			budgeted: 2300,
			total: 0,
			balance: 2300
		},
		weekly: {
			budgeted: 0,
			total: 0,
			totalBeforeToday: 0,
			balance: 0
		}
	});
}

function getWeeklyData() {
	var date = getPageDate();
	var monday = getMondayOfWeek(date);
	date = date.toJSON();
	monday = monday.toJSON();

	$.getJSON('/wccr_functional/ajax/weeklyValues.php', {date: date, monday: monday}, function(data) {
		if (data.success) {
			$('#wccr').data('totals').weekly.totalBeforeToday = data.total;
			calcTotals();
		} else {
			console.log(data.msg);
		}
	});
}

function inputBlur(event) {
	var value = $(event.target).val();
	if (value.match(/[-+/*]/)) {
		try {
			value = eval(value);

		} catch (err) {
			value = 0;
		}
		$(event.target).val(Number.format("#,###.##", value));
	}
}

function bindNewItem() {
	var tr = $('#newItem');

	$(tr).data('foodItem', rowInputsToFoodItem(tr));

	bindTypeahead($(tr).find('.item'), $(tr).find('.calg'));

	var data = {
		row: tr,
		buttonId: '#add'
	};

	$(tr).find('.item').keyup(data, inputKeyup);
	$(tr).find('.gross').keyup(data, inputKeyup);
	$(tr).find('.tare').keyup(data, inputKeyup);
	$(tr).find('.net').keyup(data, inputKeyup);
	$(tr).find('.calg').keyup(data, inputKeyup);
	$(tr).find('.cal').keyup(data, inputKeyup);

	$(tr).find('.item').click(data, inputClick);
	$(tr).find('.gross').click(data, inputClick);
	$(tr).find('.tare').click(data, inputClick);
	$(tr).find('.net').click(data, inputClick);
	$(tr).find('.calg').click(data, inputClick);
	$(tr).find('.cal').click(data, inputClick);

	$(tr).find('.item').change(data, inputKeyup);

	$(tr).find('.gross').blur(inputBlur);
	$(tr).find('.tare').blur(inputBlur);
	$(tr).find('.net').blur(inputBlur);
	$(tr).find('.calg').blur(inputBlur);
	$(tr).find('.cal').blur(inputBlur);

	$(tr).find('#add').click(tr, addClick);
}

function addClick(event) {
	var tr = event.data;
	var foodItem = $(tr).data('foodItem');

	postFoodItem(foodItem);

	clearRowInputs(tr);

	$(tr).find('.item').focus();

	addRow(foodItem);
}

function addRow(foodItem) {
	var row = createRow();

	$(row).data('foodItem', foodItem);

	setRowHtml(row);

	$('#wccr').append(row);

	bindRow(row);

	calcTotals();
}

function setRowHtml(tr) {
	var foodItem = $(tr).data('foodItem');
	$(tr).find('.item').html(foodItem.item);
	$(tr).find('.gross').html(foodItem.gross);
	$(tr).find('.tare').html(foodItem.tare);
	$(tr).find('.net').html(foodItem.net);
	$(tr).find('.calg').html(foodItem.calg);
	$(tr).find('.cal').html(foodItem.cal);
}

function clearRowInputs(tr) {
	$(tr).find('.item').val('');
	$(tr).find('.gross').val('');
	$(tr).find('.tare').val('');
	$(tr).find('.net').val('');
	$(tr).find('.calg').val('');
	$(tr).find('.cal').val('');
}

function createRow() {
	return $('<tr/>')
			.append($('<td class="item"/>'))
			.append($('<td class="gross"/>'))
			.append($('<td class="tare"/>'))
			.append($('<td class="net"/>'))
			.append($('<td class="calg"/>'))
			.append($('<td class="cal"/>'))
			.append($('<td/>').append($('<button id="edit">Edit</button>')))
			.append($('<td/>').append($('<button id="remove">Remove</button>')));
}

function createRowInputs() {
	return $('<tr/>')
			.append($('<td/>').append($('<input type="text" class="item"/>')))
			.append($('<td/>').append($('<input type="text" class="gross"/>')))
			.append($('<td/>').append($('<input type="text" class="tare"/>')))
			.append($('<td/>').append($('<input type="text" class="net"/>')))
			.append($('<td/>').append($('<input type="text" class="calg"/>')))
			.append($('<td/>').append($('<input type="text" class="cal"/>')))
			.append($('<td/>').append($('<button id="update">Update</button>')))
			.append($('<td/>').append($('<button id="remove">Remove</button>')));
}

function bindRow(tr) {
	$(tr).find('.item').click({row: tr, class: 'item'}, editClick);
	$(tr).find('.gross').click({row: tr, class: 'gross'}, editClick);
	$(tr).find('.tare').click({row: tr, class: 'tare'}, editClick);
	$(tr).find('.net').click({row: tr, class: 'net'}, editClick);
	$(tr).find('.calg').click({row: tr, class: 'calg'}, editClick);
	$(tr).find('.cal').click({row: tr, class: 'cal'}, editClick);

	$(tr).find('#edit').click({row: tr}, editClick);

	$(tr).find('#remove').click(tr, removeClick);
}

function editClick(event) {
	var tr = event.data.row;

	var rowInputs = createRowInputs();

	$(rowInputs).data('foodItem', $(tr).data('foodItem'));

	setAllInputs(rowInputs);

	$(tr).replaceWith(rowInputs);

	$(rowInputs).find(event.data.class ? '.' + event.data.class : '.item').focus().select();

	bindRowInput(rowInputs);
}

function bindRowInput(tr) {
	bindTypeahead($(tr).find('.item'), $(tr).find('.calg'));

	var data = {
		row: tr,
		buttonId: '#update'
	};

	$(tr).find('.item').keyup(data, inputKeyup);
	$(tr).find('.gross').keyup(data, inputKeyup);
	$(tr).find('.tare').keyup(data, inputKeyup);
	$(tr).find('.net').keyup(data, inputKeyup);
	$(tr).find('.calg').keyup(data, inputKeyup);
	$(tr).find('.cal').keyup(data, inputKeyup);

	$(tr).find('.gross').blur(inputBlur);
	$(tr).find('.tare').blur(inputBlur);
	$(tr).find('.net').blur(inputBlur);
	$(tr).find('.calg').blur(inputBlur);
	$(tr).find('.cal').blur(inputBlur);

	$(tr).find('.item').click(data, inputClick);
	$(tr).find('.gross').click(data, inputClick);
	$(tr).find('.tare').click(data, inputClick);
	$(tr).find('.net').click(data, inputClick);
	$(tr).find('.calg').click(data, inputClick);
	$(tr).find('.cal').click(data, inputClick);

	$(tr).find('#update').click(tr, updateClick);

	$(tr).find('#remove').click(tr, removeClick);
}

function updateClick(event) {
	var tr = event.data;
	var foodItem = $(tr).data('foodItem');

	putFoodItem(foodItem);

	var row = createRow();

	$(row).data('foodItem', foodItem);

	setRowHtml(row);

	$(tr).replaceWith(row);

	bindRow(row);

	calcTotals();
}

function removeClick(event) {
	var tr = event.data;
	var foodItem = $(tr).data('foodItem');

	deleteFoodItem(foodItem);

	$(tr).remove();

	calcTotals();
}

function rowToFoodItem(row) {
	return {
		id: $(row).data('foodItem').id,
		item: $(row).find('.item').html(),
		gross: $(row).find('.gross').html(),
		tare: $(row).find('.tare').html(),
		net: $(row).find('.net').html(),
		calg: $(row).find('.calg').html(),
		cal: $(row).find('.cal').html(),
		date: getPageDate()
	};
}

function rowInputsToFoodItem(row) {
	return {
		id: $(row).attr('id') === 'newItem' ? '' : $(row).data('foodItem').id,
		item: getItemInput(row),
		gross: getGrossInput(row),
		tare: getTareInput(row),
		net: getNetInput(row),
		calg: getCalgInput(row),
		cal: getCalInput(row),
		date: getPageDate()
	};
}

function inputClick(event) {
	var tr = event.data.row;
	$(event.target).select();
}

function inputKeyup(event) {
	var tr = event.data.row;
	var input = $(event.target).attr('class');
	var foodItem = rowInputsToFoodItem(tr);

	switch (input) {
		case 'item':
			foodItem = doMathItem(foodItem);
			setGrossInput(tr, foodItem.gross);
			setTareInput(tr, foodItem.tare);
			setNetInput(tr, foodItem.net);
			setCalgInput(tr, foodItem.calg);
			setCalInput(tr, foodItem.cal);
			break;
		case 'gross':
			foodItem = doMathGross(foodItem);
			setTareInput(tr, foodItem.tare);
			setNetInput(tr, foodItem.net);
			setCalgInput(tr, foodItem.calg);
			setCalInput(tr, foodItem.cal);
			break;
		case 'tare':
			foodItem = doMathTare(foodItem);
			setGrossInput(tr, foodItem.gross);
			setNetInput(tr, foodItem.net);
			setCalgInput(tr, foodItem.calg);
			setCalInput(tr, foodItem.cal);
			break;
		case 'net':
			foodItem = doMathNet(foodItem);
			setGrossInput(tr, foodItem.gross);
			setTareInput(tr, foodItem.tare);
			setCalgInput(tr, foodItem.calg);
			setCalInput(tr, foodItem.cal);
			break;
		case 'calg':
			foodItem = doMathCalg(foodItem);
			setGrossInput(tr, foodItem.gross);
			setTareInput(tr, foodItem.tare);
			setNetInput(tr, foodItem.net);
			setCalInput(tr, foodItem.cal);
			break;
		case 'cal':
			foodItem = doMathCal(foodItem);
			setGrossInput(tr, foodItem.gross);
			setTareInput(tr, foodItem.tare);
			setNetInput(tr, foodItem.net);
			setCalgInput(tr, foodItem.calg);
			break;
	}

	$(tr).data('foodItem', foodItem);

	if (event.which === 13) {
		$(tr).find(event.data.buttonId).click();
	}
}

function setItemInput(tr, value) {
	$(tr).find('.item').val(value);
}
function setGrossInput(tr, value) {
	$(tr).find('.gross').val(Math.round(value));
}
function setTareInput(tr, value) {
	$(tr).find('.tare').val(Math.round(value));
}
function setNetInput(tr, value) {
	$(tr).find('.net').val(Math.round(value));
}
function setCalgInput(tr, value) {
	$(tr).find('.calg').val(Number(value).toFixed(2));
}
function setCalInput(tr, value) {
	$(tr).find('.cal').val(Math.round(value));
}
function setAllInputs(tr) {
	var foodItem = $(tr).data('foodItem');
	setItemInput(tr, foodItem.item);
	setGrossInput(tr, foodItem.gross);
	setTareInput(tr, foodItem.tare);
	setNetInput(tr, foodItem.net);
	setCalgInput(tr, foodItem.calg);
	setCalInput(tr, foodItem.cal);
}
function getItemInput(tr) {
	return $(tr).find('.item').val();
}
function getGrossInput(tr) {
	var value = $(tr).find('.gross').val();
	try {
		return Math.round(eval(value ? value : 0));
	} catch (err) {
	}
	return 0;
}
function getTareInput(tr) {
	var value = $(tr).find('.tare').val();
	try {
		return Math.round(eval(value ? value : 0));
	} catch (err) {
	}
	return 0;
}
function getNetInput(tr) {
	var value = $(tr).find('.net').val();
	try {
		return Math.round(eval(value ? value : 0));
	} catch (err) {
	}
	return 0;
}
function getCalgInput(tr) {
	var value = $(tr).find('.calg').val();
	try {
		return Number(eval(value ? value : 0));
	} catch (err) {
	}
	return 0;
}
function getCalInput(tr) {
	var value = $(tr).find('.cal').val();
	try {
		return Math.round(eval(value ? value : 0));
	} catch (err) {
	}
	return 0;
}

function doMathItem(foodItem) {
	foodItem.cal = Math.round(foodItem.net * foodItem.calg);
	return foodItem;
}

function doMathGross(foodItem) {
	foodItem.net = foodItem.gross - foodItem.tare;
	foodItem.cal = Math.round(foodItem.net * foodItem.calg);
	return foodItem;
}

function doMathTare(foodItem) {
	foodItem.net = foodItem.gross - foodItem.tare;
	foodItem.cal = Math.round(foodItem.net * foodItem.calg);
	return foodItem;
}

function doMathNet(foodItem) {
	foodItem.gross = foodItem.net + foodItem.tare;
	foodItem.cal = Math.round(foodItem.net * foodItem.calg);
	return foodItem;
}

function doMathCalg(foodItem) {
	foodItem.cal = Math.round(foodItem.net * foodItem.calg);
	return foodItem;
}

function doMathCal(foodItem) {
	if (foodItem.calg !== 0) {
		foodItem.net = Math.round(foodItem.cal / foodItem.calg);
		foodItem.gross = foodItem.net + foodItem.tare;
	} else {
	}
	return foodItem;
}

function setTotals() {
	var totals = $('#wccr').data('totals');
	$('#dailyBudgeted').html(Number.format('#,###', totals.daily.budgeted));
	$('#dailyTotal').html(Number.format('#,###', totals.daily.total));

	if (totals.daily.balance < 0) {
		$('#dailyBalance').html(Number.format('(#,###)', totals.daily.balance));
	} else {
		$('#dailyBalance').html(Number.format('#,###', totals.daily.balance));
	}

	$('#weeklyBudgeted').html(Number.format('#,###', totals.weekly.budgeted));
	$('#weeklyTotal').html(Number.format('#,###', totals.weekly.total));

	if (totals.weekly.balance < 0) {
		$('#weeklyBalance').html(Number.format('(#,###)', totals.weekly.balance));
	} else {
		$('#weeklyBalance').html(Number.format('#,###', totals.weekly.balance));
	}
}

function calcDailyTotal() {
	var rows = $('#wccr tr');
	var totalCals = 0;
	$(rows).each(function(index, row) {
		totalCals += Number($(row).data('foodItem').cal);
	});

	$('#wccr').data('totals').daily.total = totalCals;

	setTotals();
}

function calcDailyBalance() {
	var totals = $('#wccr').data('totals');

	totals.daily.balance = totals.daily.budgeted - totals.daily.total;

	setTotals();
}

function calcWeeklyBudgeted() {
	var day = getDayStartingOnMonday(getPageDate().getDay());
	var weeklyBudgeted = 2300 * (day + 1);

	$('#wccr').data('totals').weekly.budgeted = weeklyBudgeted;

	setTotals();
}
function calcWeeklyTotal() {
	var totals = $('#wccr').data('totals');

	totals.weekly.total = totals.weekly.totalBeforeToday + totals.daily.total;

	setTotals();
}
function calcWeeklyBalance() {
	var totals = $('#wccr').data('totals');

	totals.weekly.balance = totals.weekly.budgeted - totals.weekly.total;

	setTotals();
}

function calcTotals() {
	calcDailyTotal();
	calcDailyBalance();
	calcWeeklyBudgeted();
	calcWeeklyTotal();
	calcWeeklyBalance();
}