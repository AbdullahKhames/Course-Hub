#!/usr/bin/python3
""" validation for class Lesson"""

from marshmallow import Schema, fields, INCLUDE, post_load
from marshmallow import validate, validates, ValidationError

from models import storage
from models.lesson import Lesson
from models.section import Section

from course_hub.course.views import course_service


class LessonSchema(Schema):
    class Meta:
        unknown = INCLUDE
    name = fields.String(required=True)
    lesson_num = fields.Integer(validate=validate.Range(min=1))
    section_id = fields.String(required=True)
    content = fields.String(required=True)

    @validates('name')
    def validate_name(self, value):
        if len(value) < 3:
            raise ValidationError("Name cannot be less than 3 characters")

    @validates('section_id')
    def validate_section_id(self, value):
        if not storage.get(Section, value):
            raise ValidationError("section doesn't exist")

    @validates('lesson_num')
    def validate_lesson_num(self, value):
        section_id = self.context.get('data', {}).get('section_id')
        section = storage.get(Section, section_id)
        lesson = self.context.get('instance', None)
        if section:
            list_lessons = section.lessons
            if lesson:
                list_lessons = [one for one in list_lessons
                                if one.id != lesson.id]

            lesson_nums = [one.lesson_num for one in list_lessons]

            if value in lesson_nums:
                raise ValidationError("lesson_num already exists")


class CreateLessonSchema(LessonSchema):
    @post_load
    def make_lesson(self, data, **kwargs):
        return Lesson(**data)


class UpdateLessonSchema(LessonSchema):
    @post_load
    def update_lection(self, data, **kwargs):
        lesson = self.context.get('instance', None)
        if lesson:
            for key, value in data.items():
                if key == 'section_id':
                    if not course_service.check_same_class(lesson.section_id,
                                                           value):
                        raise ValidationError("Not same Course")

                if key not in ['id', 'created_at', 'updated_at']:
                    setattr(lesson, key, value)
        return lesson
