chrome.storage.local.get(['cleaningAlarm'], function(result) {
	console.log('cleaningAlarm currently is ' + result.cleaningAlarm);
	if (!result.cleaningAlarm) {
		console.log('configuring alarm')
		chrome.alarms.create('cleaningAlarm', {delayInMinutes: 1, periodInMinutes: 6 * 60});
        chrome.storage.sync.set({cleaningAlarm: true}, function() {
        	console.log('cleaningAlarm is set to true');
        });	
    }
});

chrome.alarms.onAlarm.addListener(function(alarm) {
	if (alarm.name === 'cleaningAlarm') {
		console.log('Cleaning');
		chrome.history.deleteRange( {startTime: new Date(1970, 0, 0).getTime(), endTime: Date.now() - 3 * 30 * 24 * 60 * 60 * 1000 } , function(){ 
		    console.log("History Removed");
		});
	}
});