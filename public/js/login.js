
function bindLogin() {
    $('#login').click(function() {

        var user = {
            user: $('#user').val(),
            pass: $('#pass').val()
        };

        $.post('/wccr_functional/ajax/login.php', {user: user}, function(data) {
            if (data.success) {
                window.location = '/wccr_functional';
            }
        });

        return false;
    });
}

$.get('/wccr_functional/ajax/user.php', function(data) {
    if (data.success) {
        window.location = '/wccr_functional';
    }
});

bindLogin();