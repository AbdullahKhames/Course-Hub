#!/usr/bin/python3
""" holds class Courses"""

from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, Integer, DateTime, Boolean
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

from models.instructor import Instructor
from models.category import Category


class Course(BaseModel, Base):
    """Representation of a Course """
    __tablename__ = 'courses'
    name = Column(String(128), nullable=False)
    description = Column(String(1024), nullable=True)
    approved = Column(Boolean(), nullable=False, default=False)
    hours = Column(Integer, nullable=False)
    num_sections = Column(Integer, nullable=False, default=0)
    num_enrolled = Column(Integer, nullable=False, default=0)
    image = Column(String(200))
    sections = relationship("Section", backref="course", cascade='all, delete-orphan')

    category_id = Column(String(60),
                         ForeignKey('categories.id'),
                         nullable=True)
    instructor_id = Column(String(60),
                           ForeignKey('instructors.id'),
                           nullable=False)
    students = relationship('Student',
                            secondary='enrollments', viewonly=False,
                            back_populates='my_courses')

    def to_dict(self):
        """returns dict representation of course"""
        from models import storage
        new_dict = super().to_dict()
        instructor = storage.get(Instructor, self.instructor_id)
        category = storage.get(Category, self.category_id)
        if instructor:
            new_dict['instructor_name'] = instructor.user.name
        if category:
            new_dict['category_name'] = category.name
        new_dict['total_students'] = instructor.total_students
        new_dict['sections'] = [section.to_dict() for section in self.sections]
        # order sections by section number
        new_dict['sections'].sort(key=lambda section: section['section_num'])
        return new_dict
