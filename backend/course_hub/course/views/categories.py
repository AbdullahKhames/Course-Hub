#!/usr/bin/python3
"""hold class Category"""

from flask_jwt_extended import jwt_required
from course_hub.course import course_views
from flask import jsonify, abort, request
from models import storage
from models.category import Category
from flasgger.utils import swag_from
from course_hub.course.views import course_service
from marshmallow import ValidationError
from course_hub.course.schemas.category_schema import CreateCategorySchema
from course_hub.course.schemas.category_schema import UpdateCategorySchema
from course_hub.course.schemas.category_schema import CategorySchema
from utils.auth_utils import user_required


@course_views.route('/categories', methods=['GET'])
@swag_from('../documentation/categories/all_categories.yml', methods=['GET'])
def get_categories():
    """reterive all categories from storage
    """
    return jsonify(list(map(lambda category:
                            category.to_dict(), course_service.get_categories(
                                request.args.get('page', 1, type=int),
                                request.args.get('per_page', 3, type=int)
                            ))))


@course_views.route('/categories/<category_id>', methods=['GET'])
@swag_from('../documentation/categories/get_category.yml', methods=['GET'])
def get_category(category_id):
    """reterive category by id
    """
    category = storage.get(Category, category_id)
    if category is None:
        abort(404)
    return jsonify(category.to_dict())


@course_views.route('/categories/<category_id>/courses', methods=['GET'])
@swag_from('../documentation/categories/all_courses_category.yml', methods=['GET'])
def get_courses_category(category_id):
    """list all courses by category in storage"""
    category = storage.get(Category, category_id)
    if category is None:
        abort(404)

    approved = eval(request.args.get("approved", "false", type=str).capitalize())
    courses = course_service.get_courses_by_category(
        category_id,
        request.args.get("page", 1, type=int),
        request.args.get("per_page", 3, type=int)
    )
    if approved:
        courses = list(filter(lambda course: course.approved, courses))

    return jsonify(list(map(lambda category:
                            category.to_dict(), courses)))
    # return jsonify([course.to_dict() for course in category.courses])


# admin permission
@course_views.route('/categories/<category_id>', methods=['DELETE'])
@jwt_required()
@user_required([0])
@swag_from('../documentation/categories/delete_category.yml', methods=['DELETE'])
def delete_category(category_id):
    """delete category by id
    """
    category = storage.get(Category, category_id)
    if category is None:
        abort(404)
    category.delete()
    storage.save()
    return jsonify(list(map(lambda category:
                            category.to_dict(), course_service.get_categories(
                                request.args.get('page', 1, type=int),
                                request.args.get('per_page', 3, type=int)
                            ))))


@course_views.route('/categories/<filter_by>/<search_term>', methods=['GET'])
def search_category(filter_by, search_term):
    """reterive course by filter type with same search term
    """
    categories = course_service.get_category_by_search_term(filter_by=filter_by, search_term=search_term)
    if categories is not None:
        return jsonify({
            'message': 'success',
            'data': list(map(lambda category:
                            category.to_dict(), categories))
        })
    else:
        return jsonify({
            'message': "fail",
            "data": []
        })

# admin permission
@course_views.route('/categories', methods=['POST'])
@jwt_required()
@user_required([0])
@swag_from('../documentation/categories/post_category.yml', methods=['POST'])
def create_category():
    """post category to storage
    """
    data = request.get_json()
    if not data:
        abort(400, "Not a JSON")

    try:
        new_category = CreateCategorySchema().load(data)
    except ValidationError as err:
        return jsonify({'validation error': err.messages}), 422


    new_category.save()
    return jsonify(new_category.to_dict()), 201


# admin permission
@course_views.route('/categories/<category_id>', methods=['PUT'])
@jwt_required()
@user_required([0])
@swag_from('../documentation/categories/put_category.yml', methods=['PUT'])
def update_category(category_id):
    """update category to storage
    """
    category = storage.get(Category, category_id)
    if category is None:
        abort(404)

    data = request.get_json()
    if not data:
        abort(400, "Not a JSON")

    new_data = CategorySchema().dump(category)
    new_data.update(data)

    try:
        UpdateCategorySchema(context={
            'data': new_data, 'instance': category
        }).load(new_data)
    except ValidationError as err:
        return jsonify({'validation error': err.messages}), 422

    category.save()
    return jsonify(category.to_dict()), 200


# admin permission
@course_views.route('/categories/<category_id>/add-courses', methods=['PUT'])
@jwt_required()
@user_required([0])
def add_courses_to_category(category_id):
    """update category to storage
    """
    category = storage.get(Category, category_id)
    if category is None:
        abort(404)

    data = request.get_json()
    if not data:
        abort(400, "Not a JSON")

    courses_ids = data.get('courses')
    if not courses_ids:
        abort(400, "Not a JSON")
    for course_id in courses_ids:
         add_course_from_list(category=category, course_id=course_id)

    category.save()
    return jsonify({
        "message": "courses added successfully to category",
        "data": CategorySchema().dump(category)
    })


# admin permission
@course_views.route('/categories/<category_id>/remove-courses', methods=['PUT'])
@jwt_required()
@user_required([0])
def remove_courses_from_category(category_id):
    """update category to storage
    """
    category = storage.get(Category, category_id)
    if category is None:
        abort(404)

    data = request.get_json()
    if not data:
        abort(400, "Not a JSON")

    courses_ids = data.get('courses')
    if not courses_ids:
        abort(400, "Not a JSON")
    
    for course_id in courses_ids:
         remove_course_from_list(category=category, course_id=course_id)
    category.save()
    return jsonify({
        "message": "courses removed successfully from category",
        "data": CategorySchema().dump(category)
    })


def remove_course_from_list(category, course_id):
    course = storage.get("Course", course_id)
    if not course:
        return
    course.category_id = None
    if course in category.courses:
        category.courses.remove(course)
    
def add_course_from_list(category, course_id):
    course = storage.get("Course", course_id)
    if not course:
        return
    course.category_id = category.id
    category.courses.append(course)
