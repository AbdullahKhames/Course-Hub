#!/usr/bin/python3
"""new view for Course objects that handles all default RESTFul API actions"""

from flask_jwt_extended import jwt_required, current_user
from utils.auth_utils import user_required
from course_hub.course import course_views
from flask import jsonify, abort, request
from models import storage
from models.course import Course
from models.section import Section
from flasgger.utils import swag_from
from course_hub.course.views import course_service
from marshmallow import ValidationError
from course_hub.course.schemas.section_schema import SectionSchema
from course_hub.course.schemas.section_schema import CreateSectionSchema
from course_hub.course.schemas.section_schema import UpdateSectionSchema


@course_views.route('/courses/<course_id>/sections', methods=['GET'])
@swag_from('../documentation/sections/all_sections_course.yml', methods=['GET'])
def get_section_course(course_id):
    """list all section by course in storage"""
    course = storage.get(Course, course_id)
    if course is None:
        abort(404)

    return jsonify(list(map(lambda section:
                            section.to_dict(),
                            course_service.get_sections_by_course(
                                course_id,
                                request.args.get('page', 1, type=int),
                                request.args.get('per_page', 3, type=int)
                            ))))
    # return jsonify([section.to_dict() for section in course.sections])


@course_views.route('/sections/<section_id>', methods=['GET'])
@swag_from('../documentation/sections/get_section.yml', methods=['GET'])
def get_section(section_id):
    """reterive section by id
    """
    section = storage.get(Section, section_id)
    if section is None:
        abort(404)
    return jsonify(section.to_dict())


# admin permission or instructor of this course permission
@course_views.route('/sections/<section_id>', methods=['DELETE'])
@swag_from('../documentation/sections/delete_section.yml', methods=['DELETE'])
def delete_section(section_id):
    """delete Course by id
    """
    section = storage.get(Section, section_id)
    if section is None:
        abort(404)
    section.delete()
    storage.save()
    return jsonify({}), 200


# admin permission or instructor of this course permission
@course_views.route('/courses/<course_id>/sections', methods=['POST'])
@swag_from('../documentation/sections/post_section.yml', methods=['POST'])
def create_section(course_id):
    """post section to storage
    """
    data = request.get_json()
    if not data:
        abort(400, "Not a JSON")

    if not data.get('course_id'):
        data['course_id'] = course_id

    try:
        new_section = CreateSectionSchema(context={'data': data}).load(data)
    except ValidationError as err:
        return jsonify({'validation_error': err.messages}), 422

    new_section.save()
    return jsonify(SectionSchema().dump(new_section)), 201


# admin permission or instructor of this course permission
@course_views.route('/sections/<section_id>', methods=['PUT'])
@swag_from('../documentation/sections/put_section.yml', methods=['PUT'])
def update_section(section_id):
    """update section to storage
    """
    section = storage.get(Section, section_id)
    if not section:
        abort(404)
    data = request.get_json()
    if not data:
        abort(400, 'Not a JSON')

    new_data = SectionSchema().dump(section)
    new_data.update(data)

    try:
        UpdateSectionSchema(context={
            'data': new_data, 'instance': section
        }).load(new_data)
    except ValidationError as err:
        return jsonify({'validation_error': err.messages}), 422

    section.save()
    return jsonify(SectionSchema().dump(section))

@course_views.route('/sections/<filter_by>/<search_term>', methods=['GET'])
def search_section(filter_by, search_term):
    """reterive course by filter type with same search term
    """
    sections = course_service.get_section_by_search_term(filter_by=filter_by, search_term=search_term)
    if sections is not None:
        return jsonify({
            'message': 'success',
            'data': list(map(lambda category:
                            category.to_dict(), sections))
        })
    else:
        return jsonify({
            'message': "fail",
            "data": []
        })


@course_views.route('/instructor/sections', methods=['GET'])
@jwt_required()
@user_required([1])
def get_all_instructor_sections():
    """return list of all instructor's sections"""
    return jsonify({
        "messsage": "successfully retrieved sections",
        "data": list(map(lambda section: section.to_dict(),
                         course_service.get_all_instructor_sections(current_user.id)))
    })
