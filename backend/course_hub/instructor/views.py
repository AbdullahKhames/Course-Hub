#!/usr/bin/python3
"""new view for Instructor objects that handles all default RestFul API actions"""

from flask_jwt_extended import jwt_required
from course_hub.instructor import instructor_views
from course_hub.instructor.instructor_service import InstructorService
from flask import jsonify, abort, request
from models import storage
from models.instructor import Instructor
from flasgger.utils import swag_from

instructor_service = InstructorService()


@instructor_views.route('/instructors', methods=['GET'])
@jwt_required()
@swag_from('documentation/all_instructors.yml', methods=['GET'])
def get_instructors():
    """reterive all instructors from storage
    """
    return jsonify(list(map(lambda instructor:
                            instructor.to_dict(), instructor_service.get_instructors(
                                request.args.get('page', 1, type=int),
                                request.args.get('per_page', 3, type=int)
                            ))))


@instructor_views.route('/instructors/<instructor_id>', methods=['GET'])
@swag_from('documentation/get_instructor.yml', methods=['GET'])
def get_instrucor(instructor_id):
    """reterive instructor by id
    """
    instructor = storage.get(Instructor, instructor_id)
    if instructor is None:
        abort(404)
    instructor_service.get_total_students(instructor)
    return jsonify(instructor.to_dict())


@instructor_views.route('/instructors/<instructor_id>/total_students', methods=['GET'])
@jwt_required()
def get_total_students(instructor_id):
    """reterive total students by instructor id
    """
    instructor = storage.get(Instructor, instructor_id)
    if instructor is None:
        abort(404)
    return jsonify({"data": instructor_service.get_total_students(instructor)})
