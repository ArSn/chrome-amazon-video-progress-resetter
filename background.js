'use strict';

chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { hostContains: '.amazon.' },
                    })
                ],
                actions: [ new chrome.declarativeContent.ShowPageAction() ]
            }
        ]);
    });

    chrome.pageAction.onClicked.addListener(function (tab) {

        console.log('clicked...');
        chrome.tabs.sendMessage(tab.id, {text: 'reset_progress'});

    });
});


console.log('background registered');