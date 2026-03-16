// Your personal information - UPDATE THESE VALUES
const yourInfo = {
    id: 0,
    firstname: "Albert", // Replace with your firstname
    lastname: "Viñegas", // Replace with your lastname
    username: "albert42", // Replace with your username
    email: "albert.vinegas@nmsc.edu.ph", // Replace with your email
    zipcode: "7009", // Replace with your zipcode
    latitude: "7.727252", // Replace with your latitude
    longitude: "123.060429" // Replace with your longitude
};

// Function to fetch data from API
async function fetchUserData() {
    const tableElement = document.getElementById('userTable');
    
    try {
        // Fetch data from the API
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const users = await response.json();
        
        // Transform API data to match our required format
        const apiUsers = users.map(user => ({
            id: user.id,
            firstname: user.name.split(' ')[0] || user.name,
            lastname: user.name.split(' ').slice(1).join(' ') || '',
            username: user.username,
            email: user.email,
            zipcode: user.address.zipcode,
            latitude: user.address.geo.lat,
            longitude: user.address.geo.lng
        }));
        
        // Combine your info with API data (your info at the beginning)
        const allUsers = [yourInfo, ...apiUsers];
        
        // Display the data in table format
        displayUserTable(allUsers);
        
    } catch (error) {
        console.error('Error fetching data:', error);
        tableElement.innerHTML = `<div class="error">
            Error loading data: ${error.message}. Please try again later.
        </div>`;
    }
}

// Function to display users in table format
function displayUserTable(users) {
    let tableHTML = `
        <table>
            <caption>User Information Table</caption>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Zipcode</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Add each user as a table row
    users.forEach((user, index) => {
        // Add special class for your info (first row)
        const rowClass = index === 0 ? 'class="your-info"' : '';
        
        tableHTML += `
            <tr ${rowClass}>
                <td>${user.id}</td>
                <td>${user.firstname}</td>
                <td>${user.lastname}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.zipcode}</td>
                <td>${user.latitude}</td>
                <td>${user.longitude}</td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    // Display the table
    document.getElementById('userTable').innerHTML = tableHTML;
    
    // Log success message to console
    console.log(`Successfully loaded ${users.length} users (including your info)`);
}

// Add a retry mechanism
async function fetchWithRetry(retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            await fetchUserData();
            break; // Success, exit loop
        } catch (error) {
            if (i === retries - 1) {
                // Last retry failed
                document.getElementById('userTable').innerHTML = `
                    <div class="error">
                        Failed to load data after ${retries} attempts. 
                        Please check your internet connection.
                    </div>
                `;
            } else {
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchWithRetry(3);
});

// Optional: Add refresh button functionality
function addRefreshButton() {
    const container = document.querySelector('.container');
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = 'Refresh Data';
    refreshBtn.style.cssText = `
        display: block;
        margin: 20px auto;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s ease;
    `;
    
    refreshBtn.addEventListener('mouseenter', () => {
        refreshBtn.style.backgroundColor = '#45a049';
    });
    
    refreshBtn.addEventListener('mouseleave', () => {
        refreshBtn.style.backgroundColor = '#4CAF50';
    });
    
    refreshBtn.addEventListener('click', () => {
        document.getElementById('userTable').innerHTML = '<div class="loading">Refreshing data...</div>';
        fetchWithRetry(3);
    });
    
    container.insertBefore(refreshBtn, document.getElementById('userTable'));
}

// Uncomment the line below if you want to add a refresh button
// document.addEventListener('DOMContentLoaded', addRefreshButton);