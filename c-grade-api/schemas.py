from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    github_id: str
    role: str = "student"
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: str

    class Config:
        from_attributes = True

class AssignmentBase(BaseModel):
    title: str
    folder_name: Optional[str] = None  # e.g. "lab1" — folder name in the submissions repo
    deadline: Optional[datetime] = None
    template_repo_url: Optional[str] = None

class AssignmentCreate(AssignmentBase):
    pass

class Assignment(AssignmentBase):
    id: str

    class Config:
        from_attributes = True

class SubmissionBase(BaseModel):
    student_id: str
    assignment_id: str
    commit_hash: Optional[str] = None
    compile_success: bool = False
    compiler_error_log: Optional[str] = None
    correctness_score: int = 0
    suspicion_flag: bool = False

class SubmissionCreate(SubmissionBase):
    pass

class Submission(SubmissionBase):
    id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TestResultBase(BaseModel):
    submission_id: str
    test_case_name: str
    passed: bool = False
    student_output: Optional[str] = None
    expected_output: Optional[str] = None

class TestResultCreate(TestResultBase):
    pass

class TestResult(TestResultBase):
    id: str

    class Config:
        from_attributes = True
