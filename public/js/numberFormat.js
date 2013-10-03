Number.addCommas = function(number) {
	var parts = number.toString().split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
};

Number.removeCommas = function(number) {
	return String(number).replace(/,/g, '');
};

Number.format = function(formatString, number) {
	if (number === undefined) {
		return 0;
	}

	if (formatString === '(#,###.##)') {
		return "(" + this.addCommas(Math.abs(number).toFixed(2)) + ")";
	}
	else if (formatString === '(#,###)') {
		return "(" + this.addCommas(Math.round(Math.abs(number))) + ")";
	}
	else if (formatString === "#,###.##") {
		return Number.addCommas(Number(number).toFixed(2));
	}
	else if (formatString === "#,###") {
		return Number.addCommas(Math.round(number));
	}
	else if (formatString === "####.##") {
		return Number(number).toFixed(2);
	}
	else if (formatString === '####') {
		return Math.round(number);
	}
	else {
		console.log("I don't know how to format that yet.");
	}
	return 0;
};

Number.parse = function(number) {
	if (number === undefined) {
		return 0;
	}

	number = String(number).replace(/[$\(,\)]/g, '');

	return Number(number);
};

Math.isStatement = function(statement) {
	return /^\d+(\.\d+)?([-+\/*]\d+(\.\d+)?)+$/.exec(statement) !== null;

};

Date.prototype.toJSON = function() {
	var str = this.toLocaleDateString().split('/');
	var month = str[0] < 10 ? '0' + str[0] : str[0];
	var day = str[1] < 10 ? '0' + str[1] : str[1];
	var year = str[2];

	return "" + year + '-' + month + '-' + day;
};
