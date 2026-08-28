from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User, Assignment, Submission
from schemas import AssignmentCreate
from security.auth import get_current_user, get_admin_user

router = APIRouter(prefix="/assignments", tags=["assignments"])

@router.get("/{assignment_id}")
def get_assignment_details(
    assignment_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found."
        )

    # Fetch submissions for this assignment by the current user (if student), or all (if admin)
    submissions_query = db.query(Submission).filter(Submission.assignment_id == assignment_id)
    if current_user.role != "admin":
        submissions_query = submissions_query.filter(Submission.student_id == current_user.id)
        
    submissions = submissions_query.order_by(Submission.created_at.desc()).all()

    formatted_submissions = []
    for sub in submissions:
        status_str = "Passed"
        if not sub.compile_success and not sub.compiler_error_log:
            status_str = "Queued"
        elif not sub.compile_success:
            status_str = "Syntax error"
        elif sub.correctness_score < 100:
            status_str = "Failed tests"

        formatted_submissions.append({
            "id": sub.id,
            "commitHash": sub.commit_hash,
            "timestamp": sub.created_at,
            "status": status_str,
            "score": sub.correctness_score
        })

    return {
        "id": assignment.id,
        "title": assignment.title,
        "deadline": assignment.deadline,
        "templateRepo": assignment.template_repo_url,
        "submissions": formatted_submissions
    }

@router.post("", status_code=status.HTTP_201_CREATED)
def create_assignment(
    assignment_in: AssignmentCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    # Only admins can create assignments
    assignment = Assignment(
        title=assignment_in.title,
        folder_name=assignment_in.folder_name,
        deadline=assignment_in.deadline,
        template_repo_url=assignment_in.template_repo_url
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment
