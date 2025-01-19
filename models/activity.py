from db import db
from models.park import park_activities

class ActivityModel(db.Model):
    __tablename__ = "activities"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    difficulty = db.Column(db.String(50))
    duration = db.Column(db.String(50))
    description = db.Column(db.Text)

    parks = db.relationship(
        'ParkModel',
        secondary=park_activities,
        back_populates='activities',
        lazy='dynamic'
    )

