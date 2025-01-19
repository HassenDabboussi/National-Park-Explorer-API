from db import db

# Association table for parks and flora
park_flora = db.Table(
    'park_flora',
    db.Column('park_id', db.Integer, db.ForeignKey('parks.id'), primary_key=True),
    db.Column('flora_id', db.Integer, db.ForeignKey('flora.id'), primary_key=True)
)

# Association table for parks and fauna
park_fauna = db.Table(
    'park_fauna',
    db.Column('park_id', db.Integer, db.ForeignKey('parks.id'), primary_key=True),
    db.Column('fauna_id', db.Integer, db.ForeignKey('fauna.id'), primary_key=True)
)

# Association table for parks and activities
park_activities = db.Table(
    'park_activities',
    db.Column('park_id', db.Integer, db.ForeignKey('parks.id'), primary_key=True),
    db.Column('activity_id', db.Integer, db.ForeignKey('activities.id'), primary_key=True)
)

class ParkModel(db.Model):
    __tablename__ = 'parks'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    size = db.Column(db.String(50))
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255))

    # Relationships
    flora = db.relationship(
        'FloraModel',
        secondary=park_flora,
        back_populates='parks',
        lazy='dynamic'
    )
    fauna = db.relationship(
        'FaunaModel',
        secondary=park_fauna,
        back_populates='parks',
        lazy='dynamic'
    )
    activities = db.relationship(
        'ActivityModel',
        secondary=park_activities,
        back_populates='parks',
        lazy='dynamic'
    )
