from marshmallow import Schema, fields, INCLUDE, post_load
from marshmallow import validate, validates, ValidationError

from models import storage
from models.course import Course
from models.instructor import Instructor
from models.category import Category
from models.lesson import Lesson
from models.section import Section


class BaseSchema(Schema):
    class Meta:
        unknown = INCLUDE


class LessonSchema(BaseSchema):
    name = fields.Str(required=True)
    content = fields.Str(required=True)
    lesson_num = fields.Int()
    # completed = fields.Bool()


class SectionSchema(BaseSchema):
    name = fields.Str(required=True)
    section_num = fields.Int()
    # completed = fields.Bool()
    lessons = fields.Nested(LessonSchema, many=True)


class CourseSchema(BaseSchema):
    name = fields.Str(required=True)
    description = fields.Str()
    approved = fields.Boolean(missing=False,default=False)
    hours = fields.Int(required=True)
    num_sections = fields.Int()
    num_enrolled = fields.Int()
    category_id = fields.String()
    instructor_id = fields.String(required=True)
    sections = fields.Nested(SectionSchema, many=True)
    imageBase64 = fields.String()
    @validates('category_id')
    def validate_category_id(self, value):
        if value is not None and not storage.get(Category, value):
            raise ValidationError("Category doesn't exist")

    @validates('instructor_id')
    def validate_instructor_id(self, value):
        if not storage.get(Instructor, value):
            raise ValidationError("Instructor doesn't exist")

    @validates('num_sections')
    def validate_num_sections(self, value):
        course = self.context.get('instance', None)
        if course and value < len(course.sections):
            raise ValidationError("num_sections cannot be less than the number of sections that exist")
        
        
    @post_load
    def make_course(self, data, **kwargs):
        sections_data = data.pop('sections', [])
        sections = []

        for section_data in sections_data:
            lessons_data = section_data.pop('lessons', [])
            lessons = [Lesson(**lesson_data) for lesson_data in lessons_data]
            section = Section(lessons=lessons, **section_data)
            sections.append(section)

        return Course(sections=sections, **data)


class UpdateLessonSchema(BaseSchema):
    id = fields.Str()
    name = fields.Str(required=True)
    content = fields.Str(required=True)
    lesson_num = fields.Int()
    # completed = fields.Bool()


class UpdateSectionSchema(BaseSchema):
    id = fields.Str()
    name = fields.Str(required=True)
    section_num = fields.Int()
    # completed = fields.Bool()
    lessons = fields.Nested(UpdateLessonSchema, many=True)
    
class UpdateCourseSchema(BaseSchema):
    id = fields.Str()
    name = fields.Str(required=True)
    description = fields.Str()
    approved = fields.Boolean(missing=False,default=False)
    hours = fields.Int(required=True)
    num_sections = fields.Int()
    num_enrolled = fields.Int()
    category_id = fields.String()
    instructor_id = fields.String(required=True)
    sections = fields.Nested(UpdateSectionSchema, many=True)
    imageBase64 = fields.String()
    # students
    @post_load
    def update_course(self, data, **kwargs):
        course = self.context.get('instance', None)
        if course:
            for key, value in data.items():
                if key not in ['id', 'created_at', 'updated_at', 'instructor_id', 'imageBase64']:
                    setattr(course, key, value)
        return course


class ViewCourseSchema(CourseSchema):
    id = fields.Str()
    sections = fields.Nested(SectionSchema, many=True)
    
