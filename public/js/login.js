'use strict';

$(function() {
	$.get('/user', function(data) {
		if (data.success) {
			window.location = '/';
		}
	});

	bindLogin();
});

function bindLogin() {
	$('#login').click(function() {

		var user = {
			user: $('#user').val(),
			pass: $('#pass').val()
		};

		$.post('/login', {user: user}, function(data) {
			if (!data.success) {
				$('.error').text(data.err);
			} else {
				window.location = '/';
			}
		});

		return false;
	});
}