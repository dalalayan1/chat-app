$( document ).ready(function() {
    let $username = $('#username'),
        $loginForm = $('#loginForm'),
        $chatForm = $('#chatForm'),
        $message = $('#message'),
        $chatArea = $('#chatArea'),
        $onlineUsers = $('#onlineUsers'),
        $usersList = $('#usersList'),
        $status = $('#status'),
        socket;
    
    
    socket = io.connect();

    onSignIn = (googleUser) => {
        let profile = googleUser.getBasicProfile();
        let userDetails = {
            id: profile.getId(),
            name: profile.getName(),
            img: profile.getImageUrl(),
            email: profile.getEmail()
        };
        console.log(userDetails)
        socket.emit('new user', userDetails);
        showChatArea(username);
    }

    showChatArea = (username) => {
        $loginForm.css('display','none');
        $chatForm.css('display','block');
        $onlineUsers.css('display','block');
        $($chatForm).children('h4').html(`Hey ${username}! Start texting...`)
        $chatForm.submit((e) => sendMessage(e, username, $message.val()));
    }

    sendMessage = (evt, username, message) => {
        debugger
    evt.preventDefault();
    if(message === '') {
        return;
    }
    $('#message').val('');
    socket.emit('send message', {name: username, msg: message});
    }

    socket.on('status', (msg) => {
        console.log('st ',msg)
        $status.html(msg);
    })

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

    socket.on('new message', (rawData) => {
        const data = JSON.parse(rawData);
        data.forEach( (datum) => {
            $chatArea.append(`<div class="message-text">
                <b>${datum.name.toUpperCase()}</b> : ${datum.msg}
                </div>`);
        });
    });

});