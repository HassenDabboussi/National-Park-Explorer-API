from db import db
from models.park import park_flora

class FloraModel(db.Model):
    __tablename__ = 'flora'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    scientific_name = db.Column(db.String(150))
    description = db.Column(db.Text)

    # Reverse relationship to parks
    parks = db.relationship(
        'ParkModel',
        secondary=park_flora,
        back_populates='flora',
        lazy = 'dynamic'
    )