from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User, Submission, TestResult
from security.auth import get_current_user

router = APIRouter(prefix="/submissions", tags=["submissions"])

@router.get("/{submission_id}")
def get_submission_details(
    submission_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found."
        )

    # RBAC + IDOR Protection: Student can only view their own submission
    if current_user.role != "admin" and submission.student_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. You cannot view other students' submissions."
        )

    # Fetch test results
    test_results = db.query(TestResult).filter(TestResult.submission_id == submission_id).all()

    status_str = "Passed"
    if not submission.compile_success and not submission.compiler_error_log:
        status_str = "Queued"
    elif not submission.compile_success:
        status_str = "Syntax error"
    elif submission.correctness_score < 100:
        status_str = "Failed tests"

    # Formatted output matching frontend state
    formatted_results = [
        {
            "id": r.id,
            "name": r.test_case_name,
            "passed": r.passed,
            "input": r.student_output, # Standard layout mapping
            "expected": r.expected_output,
            "output": r.student_output
        }
        for r in test_results
    ]

    return {
        "id": submission.id,
        "assignmentId": submission.assignment_id,
        "assignmentTitle": submission.assignment.title if submission.assignment else "Unknown",
        "commitHash": submission.commit_hash,
        "timestamp": submission.created_at,
        "status": status_str,
        "score": submission.correctness_score,
        "compileSuccess": submission.compile_success,
        "compilerLog": submission.compiler_error_log if not submission.compile_success else "Compilation successful.",
        "testResults": formatted_results
    }
