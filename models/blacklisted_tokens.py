# models/blacklisted_tokens.py
from db import db
from datetime import datetime

class BlacklistedToken(db.Model):
    __tablename__ = "blacklisted_tokens"

    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(512), nullable=False, unique=True)
    blacklisted_on = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
