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
		
		if(user.pass !== $('#pass2').val()){
			$('.error').text('The passwords don\'t match.');
			return false;
		}

		$.post('/signup', {user: user}, function(data) {
			if (!data.success) {
				$('.error').text(data.err);
			} else {
				window.location = '/';
			}
		});

		return false;
	});
}

