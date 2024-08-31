from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex 

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

    preferences = db.relationship('UserPreference', backref='user', lazy=True)

    def __repr__(self):
        return f'<Movie {self.title}>'
    

class UserPreference(db.Model):
    __tablename__ = 'user_preferences'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    selected_genres = db.Column(db.String(200), nullable=True)  # Comma-separated genres
    selected_actors = db.Column(db.String(200), nullable=True)  # Comma-separated actors

    def __repr__(self):
        return f'<UserPreference for user_id={self.user_id}>'

