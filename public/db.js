let db;

// Indexed database for budget
const request = indexedDB.open('budget', 1);

// Upgrade newest version
request.onupgradeneeded = function (event) {
    db = event.target.result;
    db.createObjectStore('budgetStore', { autoIncrement: true });
};

// Checks for online status of browser
request.onsuccess = function (event) {
    db = event.target.result;
    if (navigator.onLine) {
        goDB();
    }
};

// If error
request.onerror = function (event) {
    console.log(`Error: ${event.target.errorCode}`);
};

// Pulls database data
function goDB() {
    let transaction = db.transaction(['budgetStore'], 'readwrite');
    const store = transaction.objectStore('budgetStore');
    const allData = store.allData();

    // Checks for success of pulls/sets
    allData.onsuccess = function () {
        if (allData.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(allData.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then(() => {
                    const transaction = db.transaction(['budgetStore'], 'readwrite');
                    const store = transaction.objectStore('budgetStore');
                    store.clear();
                });
        }
    };
}

// Saves data
const saveData = (data) => {
    const transaction = db.transaction(['budgetStore'], 'readwrite');
    const store = transaction.objectStore('budgetStore');
    store.add(data);
};

// Checks for online status and starts database
window.addEventListener('online', goDB);