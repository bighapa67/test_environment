import sys
import os

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models.user import User
from werkzeug.security import generate_password_hash

def seed_database():
    app = create_app()
    with app.app_context():
        db.create_all()

        # Check if users already exist
        if User.query.first() is None:
            # Create sample users
            users = [
                User(username='admin', password=generate_password_hash('admin123')),
                User(username='user1', password=generate_password_hash('user123')),
                User(username='user2', password=generate_password_hash('user456'))
            ]

            # Add users to the session and commit
            for user in users:
                db.session.add(user)
            
            db.session.commit()
            print("Database seeded successfully!")
        else:
            print("Database already contains data. Skipping seed.")

if __name__ == '__main__':
    seed_database()