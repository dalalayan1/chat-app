$( document ).ready(function() {
    let $username = $('#username'),
        $loginForm = $('#loginForm'),
        $chatForm = $('#chatForm'),
        socket;
    
    $loginForm.submit((evt)=> {
        evt.preventDefault();
        if ($username.val() === '') {
            return;
        }
        startActiveConnection();
    })

    startActiveConnection = () => {
        socket = io.connect();
        showChatArea();
    }

    showChatArea = () => {
        $loginForm.css('display','none');
        $chatForm.css('display','block');
        socket.emit()
    }
});