#!/usr/bin/python3
"""holds class Enrollment"""

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import CheckConstraint as Check
from sqlalchemy.orm import relationship
from models.category import Category
from models.base_model import BaseModel, Base
from models.base_model_role import BaseRole
from datetime import datetime
from models.student import Student
from models.course import Course


class Enrollment(BaseRole, Base):
    """Representation of a Enrollment """
    __tablename__ = 'enrollments'
    student_id = Column(String(60),
                        ForeignKey('students.id'),
                        primary_key=True, nullable=False)
    course_id = Column(String(60),
                       ForeignKey('courses.id'),
                       primary_key=True, nullable=False)
    completed = Column(Integer,
                       Check('completed >= 0 AND completed <= 100'),
                       nullable=False)
    enrolled_date = Column(DateTime, default=datetime.utcnow)

    # course = relationship("Course", backref="enrollments")

    def __init__(self, *args, **kwargs):
        """initializes Enrollment"""
        super().__init__(*args, **kwargs)
        if not self.enrolled_date:
            self.enrolled_date = datetime.utcnow()


    def save(self):
        """saves enrollment to database"""
        from models import storage
        storage.new(self)
        storage.save()

    def to_dict(self):
        """returns dict representation of enrollment"""
        from models import storage
        new_dict = super().to_dict()
        student = storage.get(Student, self.student_id)
        course = storage.get(Course, self.course_id)
        if student:
            new_dict['student_name'] = student.user.name
        if course:
            new_dict['course_name'] = course.name
        return new_dict

    def dump(self):
        """returns dict representation of enrollment"""
        from models import storage
        from course_hub.enrollment.schemas import EnrollmentSchema
        student = storage.get(Student, self.student_id)
        course = storage.get(Course, self.course_id)
        enrollment_schema = EnrollmentSchema()
        new_dict = enrollment_schema.dump(self)
        new_dict['student'] = student.to_dict()
        new_dict['course'] = course.to_dict()
        return new_dict
