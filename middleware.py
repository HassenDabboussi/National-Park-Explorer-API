from flask import request, abort
import jwt
import os
from dotenv import load_dotenv
from models import BlacklistedToken

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

def jwt_required(required_role=None):
    def wrapper(func):
        def decorated(*args, **kwargs):
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                abort(401, description="Authorization token is missing or invalid.")

            token = auth_header.split(" ")[1]
            try:
                # Check if token is blacklisted
                blacklisted = BlacklistedToken.query.filter_by(token=token).first()
                if blacklisted:
                    abort(401, description="Token has been revoked. Please log in again.")

                payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            except jwt.ExpiredSignatureError:
                abort(401, description="Token has expired.")
            except jwt.InvalidTokenError:
                abort(401, description="Invalid token.")

            if required_role and payload.get("role") != required_role:
                abort(403, description="Access forbidden: insufficient permissions.")

            return func(*args, **kwargs)
        return decorated
    return wrapper


