#!/usr/bin/python3
""" holds class Lesson"""

from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, Integer, Boolean, Text
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from models.section import Section


class Lesson(BaseModel, Base):
    """Representation of a Lesson """
    __tablename__ = 'lessons'
    name = Column(String(128), nullable=False)
    lesson_num = Column(Integer, nullable=False)
    # completed = Column(Boolean, nullable=False, default=False)
    content = Column(Text, nullable=False)
    section_id = Column(String(60),
                        ForeignKey('sections.id'),
                        nullable=True)

    def to_dict(self):
        """returns dict representation of lesson"""
        from models import storage
        new_dict = super().to_dict()
        section = storage.get(Section, self.section_id)
        if section:
            new_dict['section_name'] = section.name
            new_dict['section_num'] = section.section_num
        return new_dict
