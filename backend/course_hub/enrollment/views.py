#!/usr/bin/python3
"""new view for Enrollment objects that handles all default RestFul API actions"""

from course_hub.enrollment import enrollment_views
from course_hub.enrollment.enroll_service import EnrollmentService
from course_hub.enrollment.schemas import EnrollmentSchema
from flask import jsonify, abort, request
from models import storage
from models.enrollment import Enrollment
from models.student import Student
from models.course import Course
from flasgger.utils import swag_from
from flask_jwt_extended import current_user, jwt_required
from utils.auth_utils import user_required
from marshmallow import ValidationError


enrollment_service = EnrollmentService()

@enrollment_views.route('/enrollments', methods=['GET'])
def get_enrollments():
    """reterive all enrollments from storage
    """
    return jsonify(list(map(lambda enrollment:
                            enrollment.dump(), enrollment_service.get_enrollments(
                                request.args.get('page', 1, type=int),
                                request.args.get('per_page', 3, type=int)
                            ))))

@enrollment_views.route('/courses/<course_id>/enrollments', methods=['GET'])
def get_enrollments_by_course(course_id):
    """reterive all enrollments from storage
    """
    return jsonify(list(map(lambda enrollment:
                            enrollment.dump(), enrollment_service.get_enrollments_by_course(
                                course_id,
                                request.args.get('page', 1, type=int),
                                request.args.get('per_page', 3, type=int)
                            ))))

@enrollment_views.route('/students/<student_id>/enrollments', methods=['GET'])
def get_enrollments_by_student(student_id):
    """reterive all enrollments from storage
    """
    return jsonify(list(map(lambda enrollment:
                            enrollment.dump(), enrollment_service.get_enrollments_by_student(
                                student_id,
                                request.args.get('page', 1, type=int),
                                request.args.get('per_page', 3, type=int)
                            ))))

@enrollment_views.route('/enrollments/<course_id>/<student_id>', methods=['GET'])
@jwt_required()
@user_required([0, 2])
def get_enrollment(course_id, student_id):
    """reterive enrollment by id
    """
    if current_user.role == 2 and current_user.id != student_id:
        abort(403)

    student = storage.get(Student, student_id)
    course = storage.get(Course, course_id)
    if student is None or course is None:
        abort(404)

    enrollment = enrollment_service.get_enrollment(course_id, student_id)
    if enrollment is None:
        return jsonify({
            'message': 'enrollment not found',
            'status': False,
            'data': None
        })
    return jsonify({
        'message': 'enrollment found',
        'status': True,
        'data': enrollment.dump(),
    })

@enrollment_views.route('/enrollments/<course_id>/<student_id>', methods=['POST'])
@jwt_required()
@user_required([2])
def create_enrollment(course_id, student_id):
    """create a new enrollment
    """
    student = storage.get(Student, student_id)
    course = storage.get(Course, course_id)
    try:
        data = request.get_json()
    except:
       data = {}

    if student is None or course is None:
        abort(404)

    if current_user.id != student_id:
        abort(403)

    if not data.get('student_id'):
        data['student_id'] = student_id
    else:
        if data['student_id'] != student_id:
            abort(403, "student_id in body not equal to student_id in url")

    if not data.get('course_id'):
        data['course_id'] = course_id
    createEnrollSchema = EnrollmentSchema()
    try:
        enrollment = createEnrollSchema.load(data)
    except ValidationError as err:
        return jsonify({'validation_error': err.messages}), 422

    enrollment.save()
    course.num_enrolled += 1
    course.save()
    return jsonify({
        "message" : "success",
        "data": enrollment.dump()  
    }), 201


@enrollment_views.route('/enrollments/<course_id>/<student_id>', methods=['DELETE'])
@jwt_required()
@user_required([2])
def delete_enrollment(course_id, student_id):
    """delete an enrollment
    """
    if current_user.role == 2 and current_user.id != student_id:
        abort(403)
    if not enrollment_service.delete_enrollment(course_id, student_id):
        abort(404)
    course = storage.get(Course, course_id)
    course.num_enrolled -= 1
    course.save()
    return jsonify({
        "message": "deleted successfully",
        "data": []
    }), 200

@enrollment_views.route('/enrollments/<course_id>/<student_id>/complete', methods=['PUT'])
def complete_enrollment(course_id, student_id):
    """complete an enrollment
    """
    enrollment = enrollment_service.get_enrollment(course_id, student_id)
    if enrollment is None:
        abort(404)
    enrollment_service.complete_enrollment(enrollment)
    return jsonify(enrollment.dump()), 200

@enrollment_views.route('/enrollments/<course_id>/<student_id>/uncomplete', methods=['PUT'])
def uncomplete_enrollment(course_id, student_id):
    """uncomplete an enrollment
    """
    enrollment = enrollment_service.get_enrollment(course_id, student_id)
    if enrollment is None:
        abort(404)
    enrollment_service.uncomplete_enrollment(course_id, student_id)
    return jsonify(enrollment.dump()), 200

@enrollment_views.route('/enrollments/<course_id>/last', methods=['GET'])
@jwt_required()
@user_required([0, 1])
def get_last_enrollment(course_id):
    """reterive last enrollment from storage
    """
    enrollment = enrollment_service.get_last_enrollment(course_id)
    if enrollment is None:
        abort(404)
    return jsonify(enrollment.dump()), 200
