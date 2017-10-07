$( document ).ready(function() {
    let $username = $('#username'),
        $loginForm = $('#loginForm'),
        $chatForm = $('#chatForm'),
        $message = $('#message'),
        $chatArea = $('#chatArea'),
        $onlineUsers = $('#onlineUsers'),
        $usersList = $('#usersList'),
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
        socket.emit('new user', username);
        showChatArea(username);
    }

    showChatArea = (username) => {
        $loginForm.css('display','none');
        $chatForm.css('display','block');
        $onlineUsers.css('display','block');
        $($chatForm).children('h4').html(`Hey ${username}! Start texting...`)
        $chatForm.submit((e) => sendMessage(e, $message.val()));
    }

    sendMessage = (evt, message) => {
    evt.preventDefault();
    if(message === '') {
        return;
    }
    $('#message').val('');
    socket.emit('send message', message);
    }

    socket.on('add user', (onlineUsers) => {
        $usersList.html('');
        let html = '';
        onlineUsers.forEach((eachUser) => {
            html += (`<li class="user">
                                    ${eachUser}
                                    </li>`);
        })
        $usersList.html(html);
    });

    socket.on('new message', (data) => {
        data.forEach( (datum) => {
            $chatArea.append(`<div class="message-text">
                <b>${datum.user}</b> : ${datum.msg}
                </div>`);
        });
    });

});