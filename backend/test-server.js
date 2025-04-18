const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000/api';

async function testServer() {
    console.log('Testing server endpoints...\n');

    // Test 1: Get all news (should be empty)
    console.log('Test 1: GET /api/news');
    try {
        const response = await fetch(`${API_BASE_URL}/news`);
        const data = await response.json();
        console.log('Response:', data);
        console.log('Status:', response.status);
        console.log('Test 1: ✅ Success\n');
    } catch (error) {
        console.error('Test 1: ❌ Failed', error);
    }

    // Test 2: Add a news item
    console.log('Test 2: POST /api/news');
    try {
        const formData = new FormData();
        formData.append('title', 'Test News');
        formData.append('date', '2024-04-04');
        formData.append('description', 'This is a test news item');

        const response = await fetch(`${API_BASE_URL}/news`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        console.log('Response:', data);
        console.log('Status:', response.status);
        console.log('Test 2: ✅ Success\n');
        
        // Store the ID for later tests
        const newsId = data.id;

        // Test 3: Get the added news item
        console.log('Test 3: GET /api/news (after adding)');
        const getResponse = await fetch(`${API_BASE_URL}/news`);
        const newsData = await getResponse.json();
        console.log('Response:', newsData);
        console.log('Status:', getResponse.status);
        console.log('Test 3: ✅ Success\n');

        // Test 4: Update the news item
        console.log('Test 4: PUT /api/news/:id');
        const updateFormData = new FormData();
        updateFormData.append('title', 'Updated Test News');
        updateFormData.append('date', '2024-04-05');
        updateFormData.append('description', 'This is an updated test news item');

        const updateResponse = await fetch(`${API_BASE_URL}/news/${newsId}`, {
            method: 'PUT',
            body: updateFormData
        });
        const updateData = await updateResponse.json();
        console.log('Response:', updateData);
        console.log('Status:', updateResponse.status);
        console.log('Test 4: ✅ Success\n');

        // Test 5: Delete the news item
        console.log('Test 5: DELETE /api/news/:id');
        const deleteResponse = await fetch(`${API_BASE_URL}/news/${newsId}`, {
            method: 'DELETE'
        });
        const deleteData = await deleteResponse.json();
        console.log('Response:', deleteData);
        console.log('Status:', deleteResponse.status);
        console.log('Test 5: ✅ Success\n');

    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Run the tests
testServer(); 