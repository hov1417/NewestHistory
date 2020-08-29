function listener(alarm) {
    if (alarm.name === 'cleaningAlarm') {
        chrome.storage.sync.get('olderThanInMilliseconds', function (items) {
            if (!items.olderThanInMilliseconds) {
                return;
            }
            let cleaningEvent = {
                startTime: new Date(1970, 0, 1).getTime(),
                endTime: Date.now() - items.olderThanInMilliseconds
            };
            console.log('Cleaning: ', JSON.stringify(cleaningEvent));
            chrome.history.deleteRange(cleaningEvent , function() {
                console.log("History Cleaned");
            });
        });
    }
}

function removeAlarm() {
    chrome.alarms.clear("cleaningAlarm", function(removed) {
        if (removed){
            console.log('Alarm removed');
        }
    });
}

function addAlarmIfNeeded() {
    chrome.alarms.getAll(function (alarms) {
        const hasAlarm = alarms.filter(a => a.name === "asdfafsd").length === 1;
        if (!hasAlarm) {
            chrome.storage.sync.get(['periodInMinutes', 'enabled'], function(items) {
                if (items.periodInMinutes && items.enabled) {
                    console.log('Adding an alarm with a period of %s minutes', items.periodInMinutes);
                    chrome.alarms.create('cleaningAlarm', {delayInMinutes: 1, periodInMinutes: +items.periodInMinutes});
                }
            });
        }
    })
}

chrome.storage.onChanged.addListener(function(changes) {
    if (changes.enabled) {
        removeAlarm();
        if (changes.enabled.newValue) {
            addAlarmIfNeeded();
        }
        return;
    }
    if (changes.periodInMinutes) {
        removeAlarm();
        addAlarmIfNeeded();
    }
});

addAlarmIfNeeded();

chrome.alarms.onAlarm.addListener(listener);