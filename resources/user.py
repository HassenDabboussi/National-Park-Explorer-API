from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError
from models import UserModel
from models import BlacklistedToken
from schemas import UserSchema
from db import db
from werkzeug.security import check_password_hash, generate_password_hash
import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
from middleware import jwt_required
import os

# Load environment variables
load_dotenv()

# Get the SECRET_KEY from .env
SECRET_KEY = os.getenv("SECRET_KEY")


blp = Blueprint("Users", __name__, description="Operations on Users")

@blp.route("/register")
class UserRegister(MethodView):
    @blp.arguments(UserSchema)
    @blp.response(201, UserSchema)
    def post(self, user_data):
        """Register a new user."""
        print("Received data:", user_data)  
        try:
            # Hash the password before storing it
            hashed_password = generate_password_hash(user_data["password"], method="pbkdf2:sha256", salt_length=8)
            user = UserModel(
                username=user_data["username"],
                email=user_data["email"],
                password=hashed_password,
                role="user"  # Default role is 'user'
            )
            db.session.add(user)
            db.session.commit()
            return user
        except SQLAlchemyError as e:
            abort(500, message=f"An error occurred while registering the user: {str(e)}")

@blp.route("/login")
class UserLogin(MethodView):
    def post(self):
        """Authenticate user and return a JWT."""
        from flask import request

        # Get login data from request
        login_data = request.get_json()
        if not login_data or "username" not in login_data or "password" not in login_data:
            abort(400, message="Username and password are required.")

        # Retrieve user from database
        user = UserModel.query.filter_by(username=login_data["username"]).first()
        if not user or not check_password_hash(user.password, login_data["password"]):
            abort(401, message="Invalid username or password.")

        # Generate JWT
        token = jwt.encode(
            {
                "user_id": user.id,
                "username": user.username,
                "role": user.role,
                "exp": datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        return {"access_token": token}, 200

@blp.route("/promote")
class UserPromote(MethodView):
    @jwt_required(required_role="admin")  
    def post(self):
        """Promote a user to admin role."""
        from flask import request

        # Extract the user_id from the request payload
        promote_data = request.get_json()
        if not promote_data or "user_id" not in promote_data:
            abort(400, description="User ID is required.")

        # Retrieve the user from the database
        user = UserModel.query.get(promote_data["user_id"])
        if not user:
            abort(404, description="User not found.")

        # Update the user's role to admin
        try:
            user.role = "admin"
            db.session.commit()
            return {"message": f"User '{user.username}' promoted to admin."}, 200
        except SQLAlchemyError as e:
            abort(500, description=f"An error occurred while promoting the user: {str(e)}")

@blp.route("/logout")
class UserLogout(MethodView):
    @jwt_required()  
    def post(self):
        """Log out the user by blacklisting their token."""
        from flask import request

        auth_header = request.headers.get("Authorization")
        if not auth_header or " " not in auth_header:
            abort(400, description="Authorization header is missing or malformed.")

        token = auth_header.split(" ")[1]

        try:
            # Check if the token is already blacklisted
            if BlacklistedToken.query.filter_by(token=token).first():
                return {"message": "Token is already blacklisted."}, 200

            # Add the token to the blacklist
            blacklisted_token = BlacklistedToken(token=token)
            print(f"Adding token: {token} to the blacklist...")
            db.session.add(blacklisted_token)
            print("Added to session. Attempting commit...")
            db.session.commit()
            print("Commit successful!")
            
            return {"message": "Successfully logged out."}, 200
        except Exception as e:
            print(f"Error occurred: {str(e)}")  
            abort(500, description=f"An error occurred while logging out: {str(e)}")

