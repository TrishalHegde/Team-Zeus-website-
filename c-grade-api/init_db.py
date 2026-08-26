from database import engine, Base
from models import User, Assignment, Submission, TestResult

def init_db():
    print("Creating tables in database...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

if __name__ == "__main__":
    init_db()
