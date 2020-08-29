
function show_message(message) {
    var status = document.getElementById('status');
    status.textContent = message;
    setTimeout(function() {
      status.textContent = '';
    }, 10000);
}

function save_options() {
    var enabled = document.getElementById('enabled').checked;
    var olderThan = document.getElementById('olderThan').value;
    var period = document.getElementById('period').value;
    chrome.storage.sync.set({
        olderThanInMilliseconds: olderThan,
        periodInMinutes: period,
        enabled: enabled,
    }, function() {console.log('saved');});
}

function restore_options() {
    chrome.storage.sync.get({
        olderThanInMilliseconds: 3 * 30 * 24 * 60 * 60 * 1000,
        periodInMinutes: 6 * 60,
        enabled: false,
    }, function(items) {
        document.getElementById('enabled').checked = items.enabled;
        document.getElementById('olderThan').value = items.olderThanInMilliseconds;
        document.getElementById('period').value = items.periodInMinutes;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    restore_options();
    document.getElementById('enabled').addEventListener('change', function() {
        if (document.getElementById('enabled').checked) {
            show_message('The changes will take effect in 1 minute.\r\nWARNING! History items will be deleted and cannot be restored.');
        }
        save_options();
    });
    document.getElementById('olderThan').addEventListener('change', save_options);
    document.getElementById('period').addEventListener('change', save_options);
});
