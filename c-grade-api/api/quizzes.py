import os
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Quiz, QuizQuestion, QuizSubmission, User
from schemas import Quiz as QuizSchema, QuizCreate, QuizSubmission as QuizSubmissionSchema, QuizSubmissionCreate
from security.auth import get_current_user

router = APIRouter(prefix="/quizzes", tags=["quizzes"])

@router.post("/", response_model=QuizSchema)
def create_quiz(
    quiz_in: QuizCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only teachers can create quizzes")
    
    quiz = Quiz(title=quiz_in.title, status=quiz_in.status)
    db.add(quiz)
    db.commit()
    db.refresh(quiz)

    for q_in in quiz_in.questions:
        question = QuizQuestion(
            quiz_id=quiz.id,
            text=q_in.text,
            options=q_in.options,
            correct_answer=q_in.correct_answer
        )
        db.add(question)
    
    db.commit()
    db.refresh(quiz)
    return quiz

@router.post("/{quiz_id}/start", response_model=QuizSchema)
def start_quiz(
    quiz_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only teachers can start quizzes")
    
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Mark all other active quizzes as completed
    active_quizzes = db.query(Quiz).filter(Quiz.status == "active").all()
    for aq in active_quizzes:
        aq.status = "completed"
    
    quiz.status = "active"
    db.commit()
    db.refresh(quiz)
    return quiz

@router.post("/{quiz_id}/stop", response_model=QuizSchema)
def stop_quiz(
    quiz_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only teachers can stop quizzes")
    
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    quiz.status = "completed"
    db.commit()
    db.refresh(quiz)
    return quiz

@router.get("/active", response_model=QuizSchema)
def get_active_quiz(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    quiz = db.query(Quiz).filter(Quiz.status == "active").first()
    if not quiz:
        raise HTTPException(status_code=404, detail="No active quiz")
    
    return quiz

@router.post("/{quiz_id}/submit", response_model=QuizSubmissionSchema)
def submit_quiz_answer(
    quiz_id: str,
    submission_in: QuizSubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz or quiz.status != "active":
        raise HTTPException(status_code=400, detail="Quiz is not active")
    
    # Check if already submitted
    existing = db.query(QuizSubmission).filter(
        QuizSubmission.quiz_id == quiz_id,
        QuizSubmission.student_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already submitted an answer")
    
    submission = QuizSubmission(
        quiz_id=quiz_id,
        question_id=submission_in.question_id,
        student_id=current_user.id,
        chosen_answer=submission_in.chosen_answer
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission

@router.get("/{quiz_id}/results")
def get_quiz_results(
    quiz_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only teachers can view aggregate results")
    
    submissions = db.query(QuizSubmission).filter(QuizSubmission.quiz_id == quiz_id).all()
    results = {}
    for sub in submissions:
        if sub.chosen_answer not in results:
            results[sub.chosen_answer] = 0
        results[sub.chosen_answer] += 1
    
    return {"quiz_id": quiz_id, "results": results}
