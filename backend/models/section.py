#!/usr/bin/python3
""" holds class Sections"""

from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, Integer, Boolean
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from models.course import Course


class Section(BaseModel, Base):
    """Representation of a Section """
    __tablename__ = 'sections'
    name = Column(String(128), nullable=False)
    section_num = Column(Integer, nullable=False)
    # completed = Column(Boolean, nullable=False, default=False)

    course_id = Column(String(60),
                       ForeignKey('courses.id'),
                       nullable=False)

    lessons = relationship("Lesson", backref="section", cascade='all, delete-orphan')

    # def check_complete(self):
    #     """Update complete state"""
    #     total = len(self.lessons)
    #     done = 0
    #     for lesson in self.lessons:
    #         if lesson.completed:
    #             done += 1
    #     if total == done:
    #         self.completed = True

    def __init__(self, *args, **kwargs):
        """initializes user"""
        super().__init__(*args, **kwargs)

    def to_dict(self):
        """returns dict representation of section"""
        from models import storage
        new_dict = super().to_dict()
        course = storage.get(Course, self.course_id)
        if course:
            new_dict['course_name'] = course.name
            new_dict['total_sections'] = course.num_sections
        new_dict['lessons'] = [lesson.to_dict() for lesson in self.lessons]
        # order lessons by lesson number
        new_dict['lessons'].sort(key=lambda lesson: lesson['lesson_num'])
        return new_dict
