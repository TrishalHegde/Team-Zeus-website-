from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import User, Submission, Assignment, TestResult
from security.auth import get_admin_user

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/dashboard")
def get_admin_dashboard(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    # Total enrollment
    student_count = db.query(User).filter(User.role == "student").count()
    
    # Total submissions
    submission_count = db.query(Submission).count()
    
    # Average score across all successful submissions
    avg_score_res = db.query(func.avg(Submission.correctness_score)).filter(Submission.compile_success == True).first()
    average_score = int(avg_score_res[0]) if avg_score_res and avg_score_res[0] is not None else 0

    # Running / Pending jobs
    pending_jobs = db.query(Submission).filter(
        Submission.compile_success == False,
        Submission.compiler_error_log == None
    ).count()

    # Flagged submissions count
    flagged_count = db.query(Submission).filter(Submission.suspicion_flag == True).count()

    # Flagged submissions queue
    flagged_submissions = db.query(Submission).filter(
        Submission.suspicion_flag == True
    ).order_by(Submission.created_at.desc()).limit(10).all()

    formatted_flags = []
    for sub in flagged_submissions:
        # Generate custom suspicion reasons for mock demonstration, or fetch from DB metadata
        # In a real app we might store suspicion reasons in the DB
        reason = "Unusually high commit frequency"
        if sub.correctness_score == 100:
            reason = "Suspiciously fast completion speed"
            
        formatted_flags.append({
            "id": sub.id,
            "studentName": sub.student.github_id if sub.student else "Unknown Student",
            "assignmentTitle": sub.assignment.title if sub.assignment else "Unknown Assignment",
            "timestamp": sub.created_at,
            "reason": reason,
            "status": "Review recommended"
        })

    # Failure Analytics
    # Get test results that failed and group them
    failed_tests = db.query(
        TestResult.test_case_name,
        func.count(TestResult.id).label("failed_count")
    ).filter(TestResult.passed == False).group_by(TestResult.test_case_name).order_by(func.count(TestResult.id).desc()).limit(5).all()

    total_failed_runs = db.query(Submission).filter(Submission.compile_success == True, Submission.correctness_score < 100).count()

    common_failures = []
    for item in failed_tests:
        percentage = int((item.failed_count / total_failed_runs) * 100) if total_failed_runs else 0
        common_failures.append({
            "id": len(common_failures) + 1,
            "name": item.test_case_name,
            "count": item.failed_count,
            "percentage": percentage
        })

    return {
        "stats": {
            "studentCount": student_count,
            "submissionCount": submission_count,
            "averageScore": average_score,
            "pendingJobs": pending_jobs,
            "flaggedCount": flagged_count
        },
        "flaggedSubmissions": formatted_flags,
        "commonFailures": common_failures
    }


@router.get("/students")
def get_all_students(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    """Returns all enrolled students with per-student metrics for the admin directory."""
    students = db.query(User).filter(User.role == "student").all()

    result = []
    for student in students:
        submissions = db.query(Submission).filter(Submission.student_id == student.id).all()
        submission_count = len(submissions)

        # Average score across compiled submissions only
        scored = [s.correctness_score for s in submissions if s.compile_success]
        avg_score = int(sum(scored) / len(scored)) if scored else 0

        # Suspicion flag: True if any submission is flagged
        is_flagged = any(s.suspicion_flag for s in submissions)

        result.append({
            "id": student.id,
            "github_id": student.github_id,
            "avatar_url": student.avatar_url,
            "submissionsCount": submission_count,
            "avgScore": avg_score,
            "status": "Review recommended" if is_flagged else "Clean"
        })

    return result
