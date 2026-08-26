import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Submission, TestResult, User
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
    submission_id: str
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
    # Find existing submission or create new one if triggered directly
    submission = db.query(Submission).filter(Submission.id == payload.submission_id).first()
    
    if not submission:
        # Replay/duplicate check or invalid ID check
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission ID not found."
        )
        
    # Prevent duplicate grading processing (replay attack / duplicate event logic)
    if submission.compile_success or submission.compiler_error_log:
        return {"status": "ignored", "reason": "submission already graded"}

    # Update submission
    submission.compile_success = payload.compile_success
    submission.compiler_error_log = payload.compiler_error_log
    submission.correctness_score = payload.correctness_score
    submission.created_at = datetime.utcnow() # Finished time

    # Check for anomaly/cheating signals
    # Plan: "commit frequency/time-to-completion as an anomaly signal"
    # For now, let's flag as suspicious if correctness score is 100 but compilation succeeded immediately
    # We can fetch other student submissions to check commit timing if we had the repository metrics.
    # We mock this suspicion check:
    student_submissions_count = db.query(Submission).filter(
        Submission.student_id == submission.student_id,
        Submission.assignment_id == submission.assignment_id
    ).count()
    
    # If the student got 100 on their 1st commit within short timeframe (metadata can track it)
    if payload.correctness_score == 100 and student_submissions_count <= 1:
        # In a real app we check the duration since repository assignment creation
        submission.suspicion_flag = True

    db.commit()

    # Save test case outcomes
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
