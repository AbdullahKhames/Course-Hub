#!/usr/bin/python3
""" validation for class Category"""

from marshmallow import Schema, fields, INCLUDE, post_load
from marshmallow import validate, validates, ValidationError

from models import storage
from models.category import Category



class CategorySchema(Schema):
    class Meta:
        unknown = INCLUDE
    name = fields.String(required=True)


    @validates('name')
    def validate_name(self, value):
        if len(value) < 3:
            raise ValidationError("Name cannot be less than 3 characters")


class CreateCategorySchema(CategorySchema):
    @post_load
    def make_category(self, data, **kwargs):
        return Category(**data)


class UpdateCategorySchema(CategorySchema):
    @post_load
    def update_category(self, data, **kwargs):
        category = self.context.get('instance', None)
        if category:
            for key, value in data.items():
                if key not in ['id', 'created_at', 'updated_at']:
                    setattr(category, key, value)
        return category
