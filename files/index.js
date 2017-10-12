$( document ).ready(function() {
    let $username = $('#username'),
        $loginSection = $('#loginSection'),
        $logoutBtn = $('#logoutBtn'),
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
        showChatArea(userDetails);
    }

    showChatArea = (userDetails) => {
        $loginSection.css('display','none');
        $chatForm.css('display','block');
        $onlineUsers.css('display','block');
        $logoutBtn.css('display','block');
        $($chatForm).children('h4').html(`Hey ${userDetails.name}! Start texting...`)
        $chatForm.submit((e) => sendMessage(e, userDetails, $message.val()));
    }

    signOut = () => {
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then( () => {
        console.log('User signed out.');
        $loginSection.css('display','block');
        $chatForm.css('display','none');
        $onlineUsers.css('display','none');
        $logoutBtn.css('display','none');
        });
    }

    sendMessage = (evt, userDetails, message) => {
    evt.preventDefault();
    if(message === '') {
        return;
    }
    $('#message').val('');
    socket.emit('send message', {details: userDetails, msg: message});
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
                        <img class="profile-pic" src="${eachUser.img}">
                        ${eachUser.name}
                    </li>`);
        })
        $usersList.html(html);
    });

    socket.on('new message', (rawData) => {
        const data = JSON.parse(rawData);
        data.forEach( (datum) => {
            $chatArea.append(`<div class="message-text">
                <b>${datum.details.name.toUpperCase()}</b> : ${datum.msg}
                </div>`);
        });
    });

});