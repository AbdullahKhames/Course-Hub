#!/usr/bin/python3
"""new view for Student objects that handles all default RestFul API actions"""

from course_hub.student import student_views
from course_hub.student.student_service import StudentService
from flask import jsonify, abort, request
from models import storage
from models.student import Student
from flasgger.utils import swag_from

student_service = StudentService()


@student_views.route('/students', methods=['GET'])
def get_students():
    """reterive all students from storage
    """
    return jsonify(list(map(lambda student:
                            student.to_dict(), student_service.get_students(
                                request.args.get('page', 1, type=int),
                                request.args.get('per_page', 3, type=int)
                            ))))


@student_views.route('/students/<student_id>', methods=['GET'])
def get_instrucor(student_id):
    """reterive student by id
    """
    student = storage.get(Student, student_id)
    if student is None:
        abort(404)
    return jsonify(student.to_dict())
