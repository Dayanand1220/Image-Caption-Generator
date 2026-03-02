import requests
import json

# The URL for your registration endpoint
url = "http://127.0.0.1:5000/api/auth/register"

# The data you want to post (a new user's username and password)
payload = {
    "username": "abca",
    "password": "abcd@123"
}

# Set the headers to specify that the content is JSON
headers = {
    "Content-Type": "application/json"
}

# Make the POST request
response = requests.post(url, data=json.dumps(payload), headers=headers)

# Print the status code and the response from the server
print(f"Status Code: {response.status_code}")
print(f"Response Body: {response.json()}")