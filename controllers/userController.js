document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    fetch('/update-profile', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
});



// Client-side JavaScript
document.addEventListener('DOMContentLoaded', async () => {
    // Fetch user data from the server
    const userData = await fetchUserData();
    populateForm(userData);

    // Add event listener for form submission
    const form = document.getElementById('userForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const updatedUserData = {};
        for (const [key, value] of formData.entries()) {
            updatedUserData[key] = value;
        }
        await updateUser(updatedUserData);
        alert('User data updated successfully!');
    });
});

async function fetchUserData() {
    const response = await fetch('/api/user'); // Assuming '/api/user' is the endpoint to fetch user data
    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }
    return await response.json();
}

async function updateUser(userData) {
    const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    if (!response.ok) {
        throw new Error('Failed to update user data');
    }
}

function populateForm(userData) {
    document.getElementById('firstnameInput').value = userData.first_name;
    document.getElementById('lastnameInput').value = userData.last_name;
    document.getElementById('emailInput').value = userData.email;
    // Populate other input fields as needed
}
