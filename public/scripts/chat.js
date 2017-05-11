//var isOpen = false;
//function popupToggle(){
//    var popup = document.getElementById("chat-popup");
//    if(isOpen){
//        popup.style.animationName = "popup_close";
//        isOpen = false;
//    }else{
//        popup.style.animationName = "popup_open";
//        isOpen = true;
//    }
//}
$(document).ready(function () {
    var isOpen = false;
    $('.chat-header').click(function () {
        if (isOpen) {
            isOpen = false;
            $('.chat-popup').css({
                "animation-name": "popup_close"
            });
            $('.chat-body').css({
                "animation-name": "hide_chat"
            });
            $('.chat-footer').css({
                "animation-name": "hide_chat"
            });
        }
        else {
            isOpen = true;
            $('.chat-popup').css({
                "animation-name": "popup_open"
            });
            $('.chat-body').css({
                "animation-name": "show_chat"
            });
            $('.chat-footer').css({
                "animation-name": "show_chat"
            });
        }
    });
});


var params = {},
    watson = 'Watson',
    context;

function userMessage(message) {
    
    params.text = message;
    if (context) {
        params.context = context;    
    }
    var xhr = new XMLHttpRequest();
    var uri = '/api/watson';
    xhr.open('POST', uri, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        // Verify if there is a success code response and some text was sent
        if (xhr.status === 200 && xhr.responseText) {
            var response = JSON.parse(xhr.responseText);
            text = response.output.text; // Only display the first response
            context = response.context; // Store the context for next round of questions
            console.log("Got response from Ana: ", JSON.stringify(response));
            
            
            if(context.iframeTrack){
                displaySpotify(context.trackURI,watson);
                delete context.iframeTrack;
            }
            if(context.clipeID){
                displayVideo(context.clipeID,watson);
                delete context.clipeID;
            }
            
            if(context.showLyrics){
                displayMessage(context.showLyrics,watson);
                displayMessage("Aproveite!",watson);
                context ={};
                
                
            }
            
            if(context.artistAlbums && context.isArtist){
                
                for(var album in context.artistAlbums){
                    displayMessage(context.artistAlbums[album].name,watson);
                    
                }
                delete context.isArtist;
            }
            
//            if(context.showLyrics){
                
//            }
           
            for (var txt in text) {
                displayMessage(text[txt], watson);
            }
            

        }
        else {
            console.error('Server error for Conversation. Return status of: ', xhr.statusText);
            displayMessage("Putz, deu um tilt aqui. Você pode tentar novamente.", watson);
        }
    };
    xhr.onerror = function () {
        console.error('Network error trying to send message!');
        displayMessage("Ops, acho que meu cérebro está offline. Espera um minutinho para continuarmos por favor.", watson);
    };
    console.log(JSON.stringify(params));
    xhr.send(JSON.stringify(params));
}

function newEvent(event) {
    // Only check for a return/enter press - Event 13
    if (event.which === 13 || event.keyCode === 13) {
        var userInput = document.getElementById('chatInput');
        text = userInput.value; // Using text as a recurring variable through functions
        text = text.replace(/(\r\n|\n|\r)/gm, ""); // Remove erroneous characters
        // If there is any input then check if this is a claim step
        // Some claim steps are handled in newEvent and others are handled in userMessage
        if (text) {
            // Display the user's text in the chat box and null out input box
            //            userMessage(text);
            displayMessage(text, 'user');
            userInput.value = '';
            userMessage(text);
        }
        else {
            // Blank user message. Do nothing.
            console.error("No message.");
            userInput.value = '';
            return false;
        }
    }
}

function displayMessage(text, user) {
    var chat_body = document.getElementById('chat-body');
    var bubble = document.createElement('div');
    bubble.setAttribute("class", "bubble");
    if (user == "user") {
        bubble.className += " user";
    }
    else {
        bubble.className += " watson";
    }
    bubble.innerHTML = text;
    chat_body.appendChild(bubble);
    chat_body.scrollTop = chat_body.scrollHeight;
}



function displaySpotify(uri, watson) {
    uri = uri.replace(new RegExp('\\"', "g"), "");
    var chat_body = document.getElementById('chat-body');
    var bubble = document.createElement('div');
    var main = document.getElementById('main');
    bubble.innerHTML += '<iframe src="https://embed.spotify.com/?uri=' + uri + '" width="270" height="80" frameborder="0" allowtransparency="true"></iframe>';
    chat_body.appendChild(bubble);
    chat_body.scrollTop = chat_body.scrollHeight; // Move chat down to the last message displayed
    document.getElementById('chatInput').focus();
    
}

function displayVideo(videoId, watson) {
    
    var chat_body = document.getElementById('chat-body');
    var bubble = document.createElement('div');
    var main = document.getElementById('main');
    bubble.innerHTML += '<iframe src="http://www.youtube.com/embed/'+videoId+'" width="360" height="260"></iframe>';
    
   
   
   chat_body.appendChild(bubble);
    chat_body.scrollTop = chat_body.scrollHeight; // Move chat down to the last message displayed
    document.getElementById('chatInput').focus();
}

userMessage('');