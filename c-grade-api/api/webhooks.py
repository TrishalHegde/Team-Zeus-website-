import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Assignment, Submission, TestResult, User
from security.webhook import verify_webhook_signature
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/webhooks", tags=["webhooks"])

class TestResultSchema(BaseModel):
    test_case_name: str
    passed: bool
    student_output: Optional[str] = None
    expected_output: Optional[str] = None

class GradingPayload(BaseModel):
    assignment_folder: str       # e.g. "lab1" — matched to Assignment.folder_name
    student_github_id: str       # github.actor — matched to User.github_id
    commit_hash: str
    compile_success: bool
    compiler_error_log: Optional[str] = None
    correctness_score: int
    test_results: List[TestResultSchema]

@router.post("/github", dependencies=[Depends(verify_webhook_signature)])
def receive_grading_result(
    payload: GradingPayload,
    db: Session = Depends(get_db)
):
    # 1. Look up the assignment by folder_name
    assignment = db.query(Assignment).filter(
        Assignment.folder_name == payload.assignment_folder
    ).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No assignment found with folder_name='{payload.assignment_folder}'. "
                   f"Please create the assignment in the admin panel with this folder name."
        )

    # 2. Look up the student by github_id; auto-create if they are a new org member
    student = db.query(User).filter(User.github_id == payload.student_github_id).first()
    if not student:
        student = User(
            github_id=payload.student_github_id,
            role="student",
            avatar_url=None
        )
        db.add(student)
        db.commit()
        db.refresh(student)

    # 3. Check for a duplicate in-flight submission (same student + assignment + commit)
    existing = db.query(Submission).filter(
        Submission.student_id == student.id,
        Submission.assignment_id == assignment.id,
        Submission.commit_hash == payload.commit_hash,
    ).first()
    if existing and (existing.compile_success or existing.compiler_error_log):
        return {"status": "ignored", "reason": "duplicate commit already graded"}

    # 4. Create the Submission record
    submission = Submission(
        student_id=student.id,
        assignment_id=assignment.id,
        commit_hash=payload.commit_hash,
        compile_success=payload.compile_success,
        compiler_error_log=payload.compiler_error_log,
        correctness_score=payload.correctness_score,
        created_at=datetime.utcnow()
    )

    # 5. Anomaly / anti-cheat signal
    previous_submissions = db.query(Submission).filter(
        Submission.student_id == student.id,
        Submission.assignment_id == assignment.id,
    ).count()
    if payload.correctness_score == 100 and previous_submissions == 0:
        submission.suspicion_flag = True

    db.add(submission)
    db.commit()
    db.refresh(submission)

    # 6. Save test results
    for test in payload.test_results:
        result_record = TestResult(
            submission_id=submission.id,
            test_case_name=test.test_case_name,
            passed=test.passed,
            student_output=test.student_output,
            expected_output=test.expected_output
        )
        db.add(result_record)

    db.commit()
    return {"status": "success", "submission_id": submission.id}
