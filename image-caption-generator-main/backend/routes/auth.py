from flask import Blueprint, jsonify, request, current_app, redirect, url_for
from bcrypt import hashpw, gensalt, checkpw
from bson.objectid import ObjectId # Used to handle unique MongoDB IDs for reset process
import requests
import os

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/register', methods=['POST'])
def register():
    mongo = current_app.mongo
    users_collection = mongo.db.users

    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')
    
    # NEW: Security fields for password recovery
    security_question = data.get('security_question')
    security_answer = data.get('security_answer')

    # 1. Input Validation: Check that all required fields are present
    if not all([username, email, password, confirm_password, security_question, security_answer]):
        return jsonify({"message": "All fields are required"}), 400
    
    # 2. Password Match Check
    if password != confirm_password:
        return jsonify({"message": "Passwords do not match"}), 400

    # 3. Uniqueness Check
    if users_collection.find_one({"username": username}) or users_collection.find_one({"email": email}):
        return jsonify({"message": "Username or Email already exists"}), 409

    # Hash the password AND the security answer for secure storage
    hashed_password = hashpw(password.encode('utf-8'), gensalt())
    hashed_answer = hashpw(security_answer.encode('utf-8'), gensalt())

    # Insert the new user into the database
    users_collection.insert_one({
        "username": username,
        "email": email, 
        "password": hashed_password.decode('utf-8'),
        "security_question": security_question,
        "security_answer_hash": hashed_answer.decode('utf-8')
    })
    return jsonify({"message": "User registered successfully"}), 201

@auth_blueprint.route('/login', methods=['POST'])
def login():
    mongo = current_app.mongo
    users_collection = mongo.db.users

    data = request.get_json()
    login_id = data.get('username')
    password = data.get('password')

    if not login_id or not password:
        return jsonify({"message": "Username/Email and password are required"}), 400

    # User lookup: Find user by either username OR email
    user = users_collection.find_one({"$or": [{"username": login_id}, {"email": login_id}]})
    
    if not user:
        return jsonify({"message": "Invalid credentials"}), 401

    if checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({"message": "Login successful", "username": user['username'], "email": user['email']}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

# --- FORGOT PASSWORD FLOW STAGE 1: GET SECURITY QUESTION ---
@auth_blueprint.route('/get_security_question', methods=['POST'])
def get_security_question():
    mongo = current_app.mongo
    users_collection = mongo.db.users
    data = request.get_json()
    email = data.get('email')
    
    # Find user by email and project only the question and ID fields
    user = users_collection.find_one({"email": email}, {"security_question": 1})
    
    if not user:
        return jsonify({"message": "Email not found"}), 404
    
    # Convert MongoDB's ObjectId to a string for the JSON response
    user_id_str = str(user.get('_id'))
    
    return jsonify({
        "message": "Question retrieved",
        "question": user.get('security_question', 'What is your favorite color?'), 
        "user_id": user_id_str 
    }), 200

# --- FORGOT PASSWORD FLOW STAGE 2: VERIFY AND RESET ---
@auth_blueprint.route('/reset_password_challenge', methods=['POST'])
def reset_password_challenge():
    mongo = current_app.mongo
    users_collection = mongo.db.users
    data = request.get_json()
    
    # Fields received from the frontend challenge
    user_id = data.get('user_id')
    answer = data.get('answer')
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')

    if not all([user_id, answer, new_password, confirm_password]):
        return jsonify({"message": "All fields are required"}), 400

    if new_password != confirm_password:
        return jsonify({"message": "New passwords do not match"}), 400
    
    # 1. Find the user by ID
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
    except Exception:
        return jsonify({"message": "Invalid user ID format."}), 400
        
    if not user:
        return jsonify({"message": "User not found"}), 404

    # 2. Verify the security answer hash
    stored_hash = user.get('security_answer_hash').encode('utf-8')
    if not checkpw(answer.encode('utf-8'), stored_hash):
        return jsonify({"message": "Security answer is incorrect."}), 401

    # 3. Hash the new password and update the user document
    new_hashed_password = hashpw(new_password.encode('utf-8'), gensalt())
    
    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"password": new_hashed_password.decode('utf-8')}}
    )
    
    return jsonify({"message": "Password successfully reset. You can now log in."}), 200

# --- OAUTH CALLBACK ROUTES ---
'''@auth_blueprint.route('/google/callback', methods=['GET'])
def google_callback():
    """Handle Google OAuth callback"""
    code = request.args.get('code')
    error = request.args.get('error')
    
    if error:
        return redirect(f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/login?error=oauth_denied")
    
    if not code:
        return redirect(f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/login?error=no_code")
    
    try:
        # Exchange code for access token
        token_url = 'https://oauth2.googleapis.com/token'
        google_redirect_uri = f"{os.getenv('BACKEND_URL', 'http://localhost:5123')}/api/auth/google/callback"
        print(f"[DEBUG] Google OAuth Redirect URI: {google_redirect_uri}") # Log constructed redirect_uri
        print(f"[DEBUG] Google OAuth Code: {code}") # Log incoming code
        print(f"[DEBUG] Google OAuth Error: {error}") # Log incoming error

        token_data = {
            'client_id': os.getenv('GOOGLE_CLIENT_ID'),
            'client_secret': os.getenv('GOOGLE_CLIENT_SECRET'),
            'code': code,
            'grant_type': 'authorization_code',
            'redirect_uri': google_redirect_uri
        }
        
        token_response = requests.post(token_url, data=token_data)
        token_json = token_response.json()
        
        if 'access_token' not in token_json:
            return redirect(f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/login?error=token_failed")
        
        # Get user info from Google
        user_info_url = 'https://www.googleapis.com/oauth2/v2/userinfo'
        headers = {'Authorization': f"Bearer {token_json['access_token']}"}
        user_response = requests.get(user_info_url, headers=headers)
        user_info = user_response.json()
        
        # Create or find user in database
        mongo = current_app.mongo
        users_collection = mongo.db.users
        
        # Check if user exists by email
        existing_user = users_collection.find_one({"email": user_info['email']})
        
        if existing_user:
            # Update existing user with Google ID if not present
            if 'google_id' not in existing_user:
                users_collection.update_one(
                    {"_id": existing_user['_id']},
                    {"$set": {"google_id": user_info['id']}}
                )
        else:
            # Create new user
            users_collection.insert_one({
                "username": user_info['name'].replace(' ', '_').lower(),
                "email": user_info['email'],
                "google_id": user_info['id'],
                "password": None,  # No password for OAuth users
                "oauth_provider": "google"
            })
        
        # Redirect to frontend with success
        return redirect(f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/login?success=google_login")
        
    except Exception as e:
        print(f"Google OAuth error: {str(e)}")
        return redirect(f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/login?error=oauth_failed")

@auth_blueprint.route('/facebook/callback', methods=['GET'])
def facebook_callback():
    """Handle Facebook OAuth callback"""
    code = request.args.get('code')
    error = request.args.get('error')
    
    if error:
        return redirect(f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/login?error=oauth_denied")
    
    if not code:
        return redirect(f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/login?error=no_code")
    
    try:
        # Exchange code for access token
        token_url = 'https://graph.facebook.com/v18.0/oauth/access_token'
        token_data = {
            'client_id': os.getenv('FACEBOOK_APP_ID'),
            'client_secret': os.getenv('FACEBOOK_APP_SECRET'),
            'code': code,
            'redirect_uri': f"{os.getenv('BACKEND_URL', 'http://localhost:5123')}/api/auth/facebook/callback"
        }
        
        token_response = requests.get(token_url, params=token_data)
        token_json = token_response.json()
        
        if 'access_token' not in token_json:
            return redirect(f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/login?error=token_failed")
        
        # Get user info from Facebook
        user_info_url = 'https://graph.facebook.com/v18.0/me'
        params = {
            'fields': 'id,name,email',
            'access_token': token_json['access_token']
        }
        user_response = requests.get(user_info_url, params=params)
        user_info = user_response.json()
        
        # Create or find user in database
        mongo = current_app.mongo
        users_collection = mongo.db.users
        
        # Check if user exists by email
        existing_user = users_collection.find_one({"email": user_info['email']})
        
        if existing_user:
            # Update existing user with Facebook ID if not present
            if 'facebook_id' not in existing_user:
                users_collection.update_one(
                    {"_id": existing_user['_id']},
                    {"$set": {"facebook_id": user_info['id']}}
                )
        else:
            # Create new user
            users_collection.insert_one({
                "username": user_info['name'].replace(' ', '_').lower(),
                "email": user_info['email'],
                "facebook_id": user_info['id'],
                "password": None,  # No password for OAuth users
                "oauth_provider": "facebook"
            })
        
        # Redirect to frontend with success
        return redirect(f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/login?success=facebook_login")
        
    except Exception as e:
        print(f"Facebook OAuth error: {str(e)}")
        return redirect(f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/login?error=oauth_failed") '''