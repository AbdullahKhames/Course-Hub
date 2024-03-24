#!/usr/bin/python3
""" validation for class Section"""

from marshmallow import Schema, fields, INCLUDE, post_load
from marshmallow import validate, validates, ValidationError

from models import storage
from models.lesson import Lesson
from models.section import Section
from models.course import Course
class LessonSchema(Schema):
    class Meta:
        unknown = INCLUDE
    name = fields.Str(required=True)
    content = fields.Str(required=True)
    lesson_num = fields.Int()
    # completed = fields.Bool()

class SectionSchema(Schema):
    class Meta:
        unknown = INCLUDE
    name = fields.String(required=True)
    section_num = fields.Integer(validate=validate.Range(min=1))
    course_id = fields.String(required=True)
    lessons = fields.Nested(LessonSchema, many=True)

    @validates('name')
    def validate_name(self, value):
        if len(value) < 3:
            raise ValidationError("Name cannot be less than 3 characters")

    @validates('course_id')
    def validate_course_id(self, value):
        if not storage.get(Course, value):
            raise ValidationError("Course doesn't exist")

    @validates('section_num')
    def validate_section_num(self, value):
        course_id = self.context.get('data', {}).get('course_id')
        course = storage.get(Course, course_id)
        section = self.context.get('instance', None)
        if course:
            list_sections = course.sections
            if section:
                list_sections = [one for one in list_sections
                                if one.id != section.id]

            section_nums = [section.section_num for section in course.sections]

            if value in section_nums:
                raise ValidationError("section_num already exists")


class CreateSectionSchema(SectionSchema):
    @post_load
    def make_Section(self, data, **kwargs):
        lessons_data = data.pop('lessons', [])
        lessons = [Lesson(**lesson_data) for lesson_data in lessons_data]
        section = Section(lessons=lessons, **data)
        return section


class UpdateSectionSchema(Schema):
    class Meta:
        unknown = INCLUDE
    name = fields.String(required=True)
    section_num = fields.Integer(validate=validate.Range(min=1))
    course_id = fields.String(required=True)
    lessons = fields.Nested(LessonSchema, many=True)

    @validates('name')
    def validate_name(self, value):
        if len(value) < 3:
            raise ValidationError("Name cannot be less than 3 characters")

    @validates('course_id')
    def validate_course_id(self, value):
        if not storage.get(Course, value):
            raise ValidationError("Course doesn't exist")
    @post_load
    def update_Section(self, data, **kwargs):
        section = self.context.get('instance', None)
        if section:
            lessons_data = data.pop('lessons', [])
            lessons = []

            for lesson_data in lessons_data:
                lesson_id = lesson_data.get('id')
                existing_lesson = next((l for l in section.lessons if l.id == lesson_id), None) if section else None

                if existing_lesson:
                    existing_lesson.name = lesson_data.get('name', existing_lesson.name)
                    existing_lesson.content = lesson_data.get('content', existing_lesson.content)
                    existing_lesson.lesson_num = lesson_data.get('lesson_num', existing_lesson.lesson_num)
                    # existing_lesson.completed = lesson_data.get('completed', existing_lesson.completed)
                    lessons.append(existing_lesson)
                else:
                    lessons.append(Lesson(**lesson_data))
            section.lessons = lessons
            for key, value in data.items():
                if key not in ['id', 'created_at', 'updated_at', 'course_id']:
                    setattr(section, key, value)
        return section
