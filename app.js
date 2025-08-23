// Main application logic
let users = [];
let luckyPicksCount = 0;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadUsersFromStorage();
    displayUsers();
    updateStats();
    setupEventListeners();
});

// Load users from localStorage on page load
function loadUsersFromStorage() {
    const storedUsers = localStorage.getItem('luckyWinnerUsers');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    }
    
    const storedLuckyCount = localStorage.getItem('luckyWinnerLuckyCount');
    if (storedLuckyCount) {
        luckyPicksCount = parseInt(storedLuckyCount);
    }
}

// Save users to localStorage
function saveUsersToStorage() {
    localStorage.setItem('luckyWinnerUsers', JSON.stringify(users));
    localStorage.setItem('luckyWinnerLuckyCount', luckyPicksCount.toString());
}

// Setup event listeners for Enter key and file upload
function setupEventListeners() {
    document.getElementById('newName').addEventListener('keypress', handleEnter);
    document.getElementById('newLottery').addEventListener('keypress', handleEnter);
    
    // File upload event listener
    document.getElementById('excelFile').addEventListener('change', handleFileSelect);
}

// Handle Enter key in input fields
function handleEnter(event) {
    if (event.key === 'Enter') {
        addUser();
    }
}

// Load default users
function loadDefaultUsers() {
    const defaultUsers = [
        {
            name: "Mukund Bondre",
            lottery: "1234567"
        },
        {
            name: "Purvak Tayade",
            lottery: "2345678"
        },
        {
            name: "Shubham Kokate",
            lottery: "3456789"
        },
        {
            name: "Jivan Mohite",
            lottery: "4567890"
        },
        {
            name: "Ajay Khalate",
            lottery: "5678901"
        },
        {
            name: "Prathamesh Mulik",
            lottery: "6789012"
        }
    ];
    
    // Add default users to the array
    users.push(...defaultUsers);
    
    // Save to localStorage
    saveUsersToStorage();
    
    // Update display
    displayUsers();
    updateStats();
    
    // Show success message
    showResult('addResult', `Successfully loaded ${defaultUsers.length} default users!`, 'success');
}

// Clear all users
function clearUsers() {
    if (users.length === 0) {
        showResult('addResult', 'No users to clear!', 'info');
        return;
    }
    
    if (confirm(`Are you sure you want to clear all ${users.length} users? This action cannot be undone.`)) {
        users = [];
        luckyPicksCount = 0;
        
        // Clear localStorage
        localStorage.removeItem('luckyWinnerUsers');
        localStorage.removeItem('luckyWinnerLuckyCount');
        
        // Update display
        displayUsers();
        updateStats();
        
        // Show success message
        showResult('addResult', 'All users have been cleared successfully!', 'success');
    }
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    const fileName = document.getElementById('fileName');
    const uploadBtn = document.getElementById('uploadBtn');
    
    if (file) {
        fileName.textContent = file.name;
        uploadBtn.style.display = 'inline-block';
    } else {
        fileName.textContent = '';
        uploadBtn.style.display = 'none';
    }
}

// Upload and process Excel file
function uploadExcelFile() {
    const fileInput = document.getElementById('excelFile');
    const file = fileInput.files[0];
    
    if (!file) {
        showResult('uploadResult', 'Please select a file first', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Get the first worksheet
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            if (jsonData.length === 0) {
                showResult('uploadResult', 'Excel file is empty', 'error');
                return;
            }
            
            // Process the data
            processExcelData(jsonData);
            
        } catch (error) {
            showResult('uploadResult', 'Error reading Excel file: ' + error.message, 'error');
        }
    };
    
    reader.readAsArrayBuffer(file);
}

// Process Excel data and add to users array
function processExcelData(data) {
    let addedCount = 0;
    let skippedCount = 0;
    let errors = [];
    
    data.forEach((row, index) => {
        // Check if required fields exist (case-insensitive)
        const name = getFieldValue(row, ['name', 'Name', 'fullname', 'FullName', 'full_name']);
        const lottery = getFieldValue(row, ['lottery', 'lottery_number', 'lottery', 'Lottery', 'number', 'Number']);
        
        if (!name || !lottery) {
            errors.push(`Row ${index + 2}: Missing required fields (name, lottery)`);
            skippedCount++;
            return;
        }
        
        // Validate lottery number length (must be more than 6 digits)
        const lotteryStr = String(lottery).trim();
        if (lotteryStr.length <= 6) {
            errors.push(`Row ${index + 2}: Lottery number must be more than 6 digits (got ${lotteryStr.length} digits)`);
            skippedCount++;
            return;
        }
        
        // Check for duplicates
        const lotteryExists = users.some(user => user.lottery === lotteryStr);
        
        if (lotteryExists) {
            errors.push(`Row ${index + 2}: Lottery number '${lottery}' already exists`);
            skippedCount++;
            return;
        }
        
        // Add user to array
        const newUser = {
            name: String(name).trim(),
            lottery: lotteryStr
        };
        
        users.push(newUser);
        addedCount++;
    });
    
    // Save to localStorage
    saveUsersToStorage();
    
    // Update display
    displayUsers();
    updateStats();
    
    // Clear file input
    document.getElementById('excelFile').value = '';
    document.getElementById('fileName').textContent = '';
    document.getElementById('uploadBtn').style.display = 'none';
    
    // Show results
    let message = `Successfully added ${addedCount} users`;
    if (skippedCount > 0) {
        message += `, skipped ${skippedCount} rows`;
    }
    
    let resultType = addedCount > 0 ? 'success' : 'error';
    showResult('uploadResult', message, resultType);
    
    // Show errors if any
    if (errors.length > 0) {
        setTimeout(() => {
            showResult('uploadResult', `${errors.length} errors occurred. Check console for details.`, 'error');
        }, 3000);
    }
}

// Helper function to get field value with different possible names
function getFieldValue(row, fieldNames) {
    for (let fieldName of fieldNames) {
        if (row.hasOwnProperty(fieldName) && row[fieldName] !== null && row[fieldName] !== undefined) {
            return row[fieldName];
        }
    }
    return null;
}

// Pick lucky user function
function pickLuckyUser() {
    if (users.length === 0) {
        showResult('luckyResult', '❌ No users to pick from! Please add some users first.', 'error');
        return;
    }
    
    // Show loader overlay
    const loaderOverlay = document.getElementById('loaderOverlay');
    loaderOverlay.style.display = 'flex';
    
    // Remove previous lucky winner highlighting
    document.querySelectorAll('.username-item').forEach(item => {
        item.classList.remove('lucky-winner');
    });
    
    // Pick random user
    const randomIndex = Math.floor(Math.random() * users.length);
    const luckyUser = users[randomIndex];
    
    // Wait for 5 seconds to show the loader
    setTimeout(() => {
        // Hide loader
        loaderOverlay.style.display = 'none';
        
        // Highlight the lucky winner
        const userItems = document.querySelectorAll('.username-item');
        if (userItems[randomIndex]) {
            userItems[randomIndex].classList.add('lucky-winner');
        }
        
        // Show lucky result
        const luckyResult = document.getElementById('luckyResult');
        luckyResult.innerHTML = `
            🎉 CONGRATULATIONS! 🎉<br>
            <span style="font-size: 28px; margin: 10px 0; display: block;">${luckyUser.name}</span>
            is the lucky winner! 🍀<br>
            <span style="font-size: 16px; margin-top: 10px; display: block;">Lottery #${luckyUser.lottery}</span>
        `;
        luckyResult.style.display = 'block';
        
        // Update lucky picks count
        luckyPicksCount++;
        updateStats();
        
        // Save to localStorage
        saveUsersToStorage();
        
        // Auto-hide result after 8 seconds
        setTimeout(() => {
            luckyResult.style.display = 'none';
            // Remove highlighting after result is hidden
            document.querySelectorAll('.username-item').forEach(item => {
                item.classList.remove('lucky-winner');
            });
        }, 8000);
    }, 5000); // 5 second delay
}

// Display users in the grid - showing only usernames
function displayUsers() {
    const emptyState = document.getElementById('emptyState');
    const usernameList = document.getElementById('usernameList');
    const clearUsersSection = document.getElementById('clearUsersSection');
    
    if (users.length === 0) {
        emptyState.style.display = 'block';
        usernameList.style.display = 'none';
        clearUsersSection.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        usernameList.style.display = 'grid';
        clearUsersSection.style.display = 'block';
        
        usernameList.innerHTML = '';
        users.forEach((user, index) => {
            const item = document.createElement('div');
            item.className = 'username-item';
            item.innerHTML = `
                <div class="user-name">${user.name}</div>
                <button class="delete-btn" onclick="deleteUser(${index})" title="Delete">×</button>
            `;
            usernameList.appendChild(item);
        });
    }
}

// Add new user
function addUser() {
    const newName = document.getElementById('newName').value.trim();
    const newLottery = document.getElementById('newLottery').value.trim();
    
    if (!newName || !newLottery) {
        showResult('addResult', 'Please fill in all fields', 'error');
        return;
    }
    
    // Validate lottery number length (must be more than 6 digits)
    if (newLottery.length <= 6) {
        showResult('addResult', `Lottery number must be more than 6 digits (got ${newLottery.length} digits)`, 'error');
        return;
    }
    
    // Check if lottery number already exists
    if (users.some(user => user.lottery === newLottery)) {
        showResult('addResult', `Lottery number ${newLottery} already exists`, 'error');
        return;
    }
    
    const newUser = {
        name: newName,
        lottery: newLottery
    };
    
    users.push(newUser);
    
    // Save to localStorage
    saveUsersToStorage();
    
    displayUsers();
    updateStats();
    showResult('addResult', `User '${newName}' added successfully!`, 'success');
    clearNewUser();
}

// Delete user
function deleteUser(index) {
    if (confirm(`Are you sure you want to delete '${users[index].name}'?`)) {
        const deletedUser = users.splice(index, 1)[0];
        
        // Save to localStorage
        saveUsersToStorage();
        
        displayUsers();
        updateStats();
        showResult('addResult', `User '${deletedUser.name}' deleted successfully!`, 'success');
    }
}

// Update statistics
function updateStats() {
    document.getElementById('totalCount').textContent = users.length;
    document.getElementById('luckyCount').textContent = luckyPicksCount;
}

// Show result message
function showResult(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `result ${type}`;
    element.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

// Clear functions
function clearNewUser() {
    document.getElementById('newName').value = '';
    document.getElementById('newLottery').value = '';
    document.getElementById('addResult').style.display = 'none';
} 