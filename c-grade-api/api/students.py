from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import User, Assignment, Submission
from security.auth import get_current_user
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/students", tags=["students"])


class SubmitRequest(BaseModel):
    assignment_id: str
    commit_hash: Optional[str] = None


@router.post("/submit", status_code=status.HTTP_201_CREATED)
def create_submission(
    body: SubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Called when a student pushes code. Creates a queued Submission record.
    Returns the submission_id which GitHub Actions uses as SUBMISSION_ID env var."""
    assignment = db.query(Assignment).filter(Assignment.id == body.assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found."
        )

    submission = Submission(
        student_id=current_user.id,
        assignment_id=body.assignment_id,
        commit_hash=body.commit_hash,
        compile_success=False,
        compiler_error_log=None,  # None = still queued/running
        correctness_score=0,
        created_at=datetime.utcnow()
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return {"submission_id": submission.id, "status": "queued"}

@router.get("/{student_id}/dashboard")
def get_student_dashboard(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # RBAC + IDOR Protection: Students can only access their own dashboard, Admins can access any
    if current_user.role != "admin" and current_user.id != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. You can only access your own dashboard."
        )
        
    student = db.query(User).filter(User.id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found."
        )

    # Fetch assignments
    assignments = db.query(Assignment).all()
    
    # Fetch student submissions
    submissions = db.query(Submission).filter(Submission.student_id == student_id).order_by(Submission.created_at.desc()).all()

    # Calculate statistics
    total_assignments = len(assignments)
    
    # Completed assignments (at least one submission that compiled successfully)
    # Group submissions by assignment
    completed_assignments_ids = set()
    total_correctness_scores = []
    
    for sub in submissions:
        if sub.compile_success:
            completed_assignments_ids.add(sub.assignment_id)
            total_correctness_scores.append(sub.correctness_score)
            
    completed_count = len(completed_assignments_ids)
    average_correctness = int(sum(total_correctness_scores) / len(total_correctness_scores)) if total_correctness_scores else 0
    pending_count = db.query(Submission).filter(
        Submission.student_id == student_id,
        Submission.compile_success == False, # Representing queued or running
        # Wait, if compile_success is false but compiler_error_log is populated, it's finished with syntax error
        Submission.compiler_error_log == None
    ).count()

    # Format assignments output with status and latest score
    assignments_list = []
    for assign in assignments:
        # Get latest submission for this assignment
        latest_sub = db.query(Submission).filter(
            Submission.student_id == student_id,
            Submission.assignment_id == assign.id
        ).order_by(Submission.created_at.desc()).first()
        
        status = "Not started"
        score = 0
        if latest_sub:
            score = latest_sub.correctness_score
            if not latest_sub.compile_success and not latest_sub.compiler_error_log:
                status = "Queued"
            elif not latest_sub.compile_success:
                status = "Syntax error"
            elif latest_sub.correctness_score == 100:
                status = "Passed"
            else:
                status = "Failed tests"
                
        assignments_list.append({
            "id": assign.id,
            "title": assign.title,
            "deadline": assign.deadline,
            "template_repo_url": assign.template_repo_url,
            "status": status,
            "score": score
        })

    # Format recent submissions
    submissions_list = []
    for sub in submissions[:5]:
        status = "Passed"
        if not sub.compile_success and not sub.compiler_error_log:
            status = "Queued"
        elif not sub.compile_success:
            status = "Syntax error"
        elif sub.correctness_score < 100:
            status = "Failed tests"
            
        submissions_list.append({
            "id": sub.id,
            "assignment_id": sub.assignment_id,
            "assignment_title": sub.assignment.title if sub.assignment else "Unknown",
            "commit_hash": sub.commit_hash,
            "timestamp": sub.created_at,
            "status": status,
            "score": sub.correctness_score
        })

    return {
        "student": {
            "id": student.id,
            "github_id": student.github_id,
            "avatar_url": student.avatar_url,
        },
        "stats": {
            "totalAssignments": total_assignments,
            "completed": completed_count,
            "averageCorrectness": average_correctness,
            "pending": pending_count
        },
        "assignments": assignments_list,
        "submissions": submissions_list
    }
