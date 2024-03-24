#!/usr/bin/python3
"""Module for enrollment schemas"""

from marshmallow import INCLUDE, Schema, fields, validates, ValidationError, post_load, validates_schema

from models.enrollment import Enrollment
from models.course import Course
from models.student import Student

from course_hub.course.schemas.course_schema import CourseSchema

class EnrollmentSchema(Schema):
    class Meta:
        unknown = INCLUDE
    course_id = fields.String(required=True)
    student_id = fields.String(required=True)
    completed = fields.Boolean(missing=False,default=False)
    enrolled_date = fields.DateTime()
    course = fields.Nested(CourseSchema, dump_only=True)

    @validates('course_id')
    def validate_course_id(self, value):
        from models import storage
        if not storage.get(Course, value):
            raise ValidationError("Course doesn't exist")

    @validates('student_id')
    def validate_student_id(self, value):
        from models import storage
        if not storage.get(Student, value):
            raise ValidationError("Student doesn't exist")

    @validates('enrolled_date')
    def validate_enrolled_date(self, value):
        if value is None:
            raise ValidationError("Enrolled date cannot be null")

    @post_load
    def make_enrollment(self, data, **kwargs):
        return Enrollment(**data)

