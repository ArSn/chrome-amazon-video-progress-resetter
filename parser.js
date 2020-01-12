"use strict";

console.log('start of parser');

function pageLooksLikeSeasonPage() {
    return true;
}


chrome.runtime.onMessage.addListener(function (msg, sender) {

    console.log('message received');

    if (msg.text === 'reset_progress') {
        console.log('parsing ...');
        if (pageLooksLikeSeasonPage()) {
            let confirmation = confirm('Are you sure you want to reset the progress?');
            console.log('continue resetting? ', confirmation);
        } else {
            alert('No seasons found on this page');
        }
    }
});

console.log('parser registered');