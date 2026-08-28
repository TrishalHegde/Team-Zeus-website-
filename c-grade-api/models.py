import uuid
from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base

# Fallback for SQLite which doesn't natively support UUID type in the same way Postgres does
# Using String(36) as a standard fallback.
class UUIDType(String):
    def __init__(self):
        super().__init__(36)

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    github_id = Column(String, unique=True, index=True)
    role = Column(String, default="student") # student or admin
    avatar_url = Column(String, nullable=True)

    submissions = relationship("Submission", back_populates="student")

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, index=True)
    folder_name = Column(String, unique=True, nullable=True, index=True)  # e.g. "lab1" — the folder in the submissions repo
    deadline = Column(DateTime(timezone=True), nullable=True)
    template_repo_url = Column(String, nullable=True)

    submissions = relationship("Submission", back_populates="assignment")

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("users.id"))
    assignment_id = Column(String(36), ForeignKey("assignments.id"))
    commit_hash = Column(String, nullable=True)
    compile_success = Column(Boolean, default=False)
    compiler_error_log = Column(Text, nullable=True)
    correctness_score = Column(Integer, default=0)
    suspicion_flag = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), nullable=True)

    student = relationship("User", back_populates="submissions")
    assignment = relationship("Assignment", back_populates="submissions")
    test_results = relationship("TestResult", back_populates="submission")

class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    submission_id = Column(String(36), ForeignKey("submissions.id"))
    test_case_name = Column(String, index=True)
    passed = Column(Boolean, default=False)
    student_output = Column(Text, nullable=True)
    expected_output = Column(Text, nullable=True)

    submission = relationship("Submission", back_populates="test_results")
