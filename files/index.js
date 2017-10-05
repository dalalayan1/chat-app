$( document ).ready(function() {
    let $username = $('#username'),
        $loginForm = $('#loginForm'),
        $chatForm = $('#chatForm'),
        $message = $('#message'),
        $chatArea = $('#chatArea'),
        socket;
    
    
    socket = io.connect();

    $loginForm.submit((evt)=> {
        evt.preventDefault();
        if ($username.val() === '') {
            return;
        }
        startActiveConnection($username.val());
    })

    startActiveConnection = (username) => {
        showChatArea(username);
    }

    showChatArea = (username) => {
        $loginForm.css('display','none');
        $chatForm.css('display','block');
        $($chatForm).children('h4').html(`Hey ${username}! Start texting...`)
        $chatForm.submit((e) => sendMessage(e, $message.val()));
    }

    sendMessage = (evt, message) => {
    evt.preventDefault();
    if (message === '') {
        return;
    }
    socket.emit('send message', message);
    }

    socket.on('new message', (messageRecieved) => {
        $chatArea.append(`<div class="message-text">
                            ${messageRecieved.msg}
                            </div>`);
    });

});