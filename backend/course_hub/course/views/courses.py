#!/usr/bin/python3
"""new view for Course objects that handles all default RESTFul API actions"""

from course_hub.course import course_views
from flask import jsonify, abort, request, send_from_directory
from models import storage
from models.course import Course
from models.instructor import Instructor
from flasgger.utils import swag_from
from course_hub.course.views import course_service
from course_hub.course.schemas.course_schema import CourseSchema, ViewCourseSchema, UpdateCourseSchema
from marshmallow import ValidationError
from flask_jwt_extended import current_user, jwt_required
from models.lesson import Lesson
from models.section import Section
from utils.auth_utils import user_required
from utils.file_service import save_base64_image, save_image, get_upload_dir


@course_views.route('/courses', methods=['GET'])
@swag_from('../documentation/courses/all_courses.yml', methods=['GET'])
def get_courses():
    """reterive all courses from storage
    """
    approved = eval(request.args.get("approved", "false", type=str).capitalize())
    courses = course_service.get_courses(
        request.args.get("page", 1, type=int),
        request.args.get("per_page", 3, type=int)
    )
    if (approved):
        courses = list(filter(lambda course: course.approved, courses))

    return jsonify(list(map(lambda course:
                            course.to_dict(), courses)))


@course_views.route('/courses/noCategory', methods=['GET'])
@swag_from('../documentation/courses/all_courses.yml', methods=['GET'])
def get_courses_without_category():
    """reterive all courses from storage
    """
    return jsonify(list(map(lambda course:
                            course.to_dict(), course_service.get_courses_without_category(
                                request.args.get("page", 1, type=int),
                                request.args.get("per_page", 3, type=int)
                            ))))

@course_views.route('/courses/best', methods=['GET'])
def get_courses_best():
    """
    reterive course from most number enrollend and with instructor have most students
    """
    return jsonify(list(map(lambda course:
                            course.to_dict(), course_service.get_courses_best_choise(
                                request.args.get("page", 1, type=int),
                                request.args.get("per_page", 3, type=int)
                            ))))

@course_views.route('/instructors/<instructor_id>/courses', methods=['GET'])
@swag_from('../documentation/courses/all_courses_instructor.yml', methods=['GET'])
def get_courses_instructor(instructor_id):
    """list all courses by instructor in storage"""
    instructor = storage.get(Instructor, instructor_id)
    if instructor is None:
        abort(404)

    approved = eval(request.args.get("approved", "false", type=str).capitalize())
    courses = course_service.get_courses_by_instructor(
        instructor_id,
        request.args.get("page", 1, type=int),
        request.args.get("per_page", 3, type=int)
    )
    if (approved):
        courses = list(filter(lambda course: course.approved, courses))

    return jsonify(list(map(lambda course:
                            course.to_dict(), courses)))
    # return jsonify([course.to_dict() for course in instructor.courses])


@course_views.route('/courses/<course_id>', methods=['GET'])
@swag_from('../documentation/courses/get_course.yml', methods=['GET'])
def get_course(course_id):
    """reterive course by id
    """
    course = storage.get(Course, course_id)
    if course is None:
        abort(404)
    return jsonify({
        'message': 'success',
        'data': course.to_dict()
    })


@course_views.route('/courses/<filter_by>/<search_term>', methods=['GET'])
def search_course(filter_by, search_term):
    """reterive course by filter type with same search term
    """
    courses = course_service.get_course_by_search_term(filter_by=filter_by, search_term=search_term)
    if courses is not None:
        return jsonify({
            'message': 'success',
            'data': UpdateCourseSchema(many=True).dump(courses, many=True)
        })
    else:
        return jsonify({
            'message': "fail",
            "data": []
        })

# admin permission or instructor of this course permission
@course_views.route('/courses/<course_id>', methods=['DELETE'])
@jwt_required()
@user_required([0, 1])
@swag_from('../documentation/courses/delete_course.yml', methods=['DELETE'])
def delete_course(course_id):
    """delete Course by id
    """
    course = storage.get(Course, course_id)
    if course is None:
        abort(404)
    if current_user.role == 1 and current_user.id != course.instructor_id:
        abort(403)
    course.delete()
    storage.save()
    return jsonify({
            "message": "deleted successfully",
            "data":  list(map(lambda course:
                        course.to_dict(), course_service.get_courses_by_instructor(
                            current_user.id,
                            request.args.get("page", 1, type=int),
                            request.args.get("per_page", 3, type=int)
                            )))
        }), 200


@course_views.route('/instructors/<instructor_id>/courses', methods=['POST'])
@jwt_required()
@user_required([1])
@swag_from('../documentation/courses/post_course.yml', methods=['POST'])
def create_course(instructor_id):
    """post course to storage
    """
    data = request.get_json()
    if current_user.id != instructor_id:
        abort(403)
    if not data:
        abort(400, "Not a JSON")
    if not data.get('instructor_id'):
        data['instructor_id'] = instructor_id
    # image = request.files.get('image')
    createCourseSchema = CourseSchema()
    try:
        new_course = CourseSchema(context={'data': data}).load(data)
    except ValidationError as err:
        return jsonify({'validation_error': err.messages}), 422
    # image_path = save_image(image=image, course_id=new_course.id)
    # if image_path is not None:
    #     new_course.image = image_path
    image_base64 = data.get('imageBase64')
    image_path = None
    if image_base64:
        image_filename = f"{new_course.id}.png"
        image_path = save_base64_image(image_base64, image_filename)
    if image_path:
        new_course.image = image_path
    new_course.save()
    return jsonify({
        "message" : "success",
        "data": createCourseSchema.dump(new_course)    
    }), 201


# admin permission or instructor of this course permission
@course_views.route('/courses/<course_id>', methods=['PUT'])
@jwt_required()
@user_required([1])
@swag_from('../documentation/courses/put_course.yml', methods=['PUT'])
def update_course(course_id):
    """update Course to storage
    """

    course = storage.get(Course, course_id)
    if not course:
        abort(404)
        
    if current_user.id != course.instructor_id:
        abort(403)
    data = request.get_json()
    # image = request.files.get('image')
    if not data:
        abort(400, 'Not a JSON')
    try:
        new_data = UpdateCourseSchema().load(data)
    except ValidationError as err:
        return jsonify({'validation_error': err.messages}), 422
    return course_service.update_course(course, data)


@course_views.route('/courses/not-approved', methods=['GET'])
@jwt_required()
@user_required([0, 1])
def get_not_approved_courses():
    """reterive all not approved courses from storage
    """
    return jsonify({
        "message": "successfully retrived not approved courses",
        "data": list(map(lambda course:
                            course.to_dict(), course_service.get_not_approved_courses(
                                request.args.get("page", 1, type=int),
                                request.args.get("per_page", 3, type=int),
                                current_user
                            )))
    })

@course_views.route('/courses/<course_id>/approve', methods=['PUT'])
@jwt_required()
@user_required([0])
def approve_courses(course_id):
    """approved courses from storage
    """
    course = storage.get("Course", course_id)
    if not course:
        abort(404)
    course.approved = True
    course.save()
    return jsonify({
        "message": "successfully approved course",
        "data": CourseSchema().dump(course)
    })
    