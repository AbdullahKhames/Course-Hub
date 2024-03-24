#!/usr/bin/python3
"""service for course"""

from os import getenv
from flask import jsonify
from marshmallow import ValidationError

from sqlalchemy import create_engine, func, and_
from sqlalchemy.orm import scoped_session, sessionmaker, aliased
from course_hub.course.schemas.course_schema import CourseSchema, UpdateCourseSchema

from models.course import Course
from models.section import Section
from models.lesson import Lesson
from models.category import Category
from models.instructor import Instructor
from utils import sess_manager
from utils.file_service import save_base64_image, save_image
class CourseService:

    def __init__(self):

        sess_manager.reload()
        self.__session = sess_manager.session
        
    def get_courses(self, page, per_page):
        """method to paginate courses"""
        offset = (page - 1) * per_page

        results = self.__session.query(Course)\
            .offset(offset)\
                .limit(per_page).all()
        return results
    
    def get_not_approved_courses(self, page, per_page, currentUser):
        """method to paginate courses"""
        offset = (page - 1) * per_page
        results = []

        if currentUser.role == 1:
            results = self.__session.query(Course)\
                .filter(and_(Course.approved == False,
                            Course.instructor_id == currentUser.id))\
                .offset(offset)\
                .limit(per_page).all()
        elif currentUser.role == 0:
            results = self.__session.query(Course)\
                .filter(Course.approved == False)\
                .offset(offset)\
                .limit(per_page).all()

        return results

    def get_courses_without_category(self, page, per_page):
        """method to paginate courses"""
        offset = (page - 1) * per_page

        results = self.__session.query(Course).filter(Course.category_id.is_(None)) \
            .offset(offset)\
                .limit(per_page).all()
        return results
    

    def get_courses_by_instructor(self, instructor_id, page, per_page):
        """method to paginate courses"""
        offset = (page - 1) * per_page

        results = self.__session.query(Course)\
            .filter(Course.instructor_id == instructor_id)\
            .offset(offset)\
                .limit(per_page).all()
        return results

    def get_courses_by_category(self, category_id, page, per_page):
        """method to paginate courses"""
        offset = (page - 1) * per_page

        results = self.__session.query(Course)\
            .filter(Course.category_id == category_id)\
            .offset(offset)\
                .limit(per_page).all()
        return results

    def get_categories(self, page, per_page):
        """method to paginate categories"""
        offset = (page - 1) * per_page

        results = self.__session.query(Category)\
            .offset(offset)\
                .limit(per_page).all()
        return results

    def get_sections_by_course(self, course_id, page, per_page):
        """method to paginate sections"""
        offset = (page - 1) * per_page

        results = self.__session.query(Section)\
            .filter(Section.course_id == course_id)\
            .offset(offset)\
                .limit(per_page).all()
        return results

    def get_lessons_by_section(self, section_id, page, per_page):
        """method to paginate lessons"""
        offset = (page - 1) * per_page

        results = self.__session.query(Lesson)\
            .filter(Lesson.section_id == section_id)\
            .offset(offset)\
                .limit(per_page).all()
        return results

    def check_same_class(self, section_1, section_2):
        """check if sections same class"""
        from models import storage
        section_1 = storage.get(Section, section_1)
        section_2 = storage.get(Section, section_2)

        return (section_1.course_id == section_2.course_id)
    
    def get_course_by_search_term(self, filter_by, search_term):
        """get course by filkter by and search term

        Args:
            filter_by (id, name): _description_
            search_term (the given id or name): _description_
        """
        if filter_by.lower() == 'id':
            return self.__session.query(Course).filter(Course.id == search_term).all()
        elif filter_by.lower() == 'name':
            return self.__session.query(Course).filter(func.lower(Course.name).like(f"%{search_term.lower()}%")).all()
        else:
            return None


    def get_lesson_by_search_term(self, filter_by, search_term):
        """get course by filkter by and search term

        Args:
            filter_by (id, name): _description_
            search_term (the given id or name): _description_
        """
        if filter_by.lower() == 'id':
            return self.__session.query(Lesson).filter(Lesson.id == search_term).all()
        elif filter_by.lower() == 'name':
            return self.__session.query(Lesson).filter(func.lower(Lesson.name).like(f"%{search_term.lower()}%")).all()
        else:
            return None


    def get_section_by_search_term(self, filter_by, search_term):
        """get course by filkter by and search term

        Args:
            filter_by (id, name): _description_
            search_term (the given id or name): _description_
        """
        if filter_by.lower() == 'id':
            return self.__session.query(Section).filter(Section.id == search_term).all()
        elif filter_by.lower() == 'name':
            return self.__session.query(Section).filter(func.lower(Section.name).like(f"%{search_term.lower()}%")).all()
        else:
            return None

    def update_course(self, existing_course, data):
        # update logic !
        sections_data = data.pop('sections', [])
        sections = []
        
        for section_data in sections_data:
            section_id = section_data.get('id')
            existing_section = next((s for s in existing_course.sections if s.id == section_id), None) if existing_course else None

            lessons_data = section_data.pop('lessons', [])
            lessons = []

            for lesson_data in lessons_data:
                lesson_id = lesson_data.get('id')
                existing_lesson = next((l for l in existing_section.lessons if l.id == lesson_id), None) if existing_section else None

                if existing_lesson:
                    existing_lesson.name = lesson_data.get('name', existing_lesson.name)
                    existing_lesson.content = lesson_data.get('content', existing_lesson.content)
                    existing_lesson.lesson_num = lesson_data.get('lesson_num', existing_lesson.lesson_num)
                    # existing_lesson.completed = lesson_data.get('completed', existing_lesson.completed)
                    lessons.append(existing_lesson)
                else:
                    lessons.append(Lesson(**lesson_data))

            if existing_section:
                existing_section.name = section_data.get('name', existing_section.name)
                existing_section.section_num = section_data.get('section_num', existing_section.section_num)
                # existing_section.completed = section_data.get('completed', existing_section.completed)
                existing_section.lessons = lessons
                sections.append(existing_section)
            else:
                section = Section(lessons=lessons, **section_data)
                sections.append(section)

        existing_course.name = data.get('name', existing_course.name)
        existing_course.description = data.get('description', existing_course.description)
        existing_course.hours = data.get('hours', existing_course.hours)
        # image_path = save_image(image=image, course_id=existing_course.id)
        # if image_path is not None:
        #     existing_course.image = image_path
        image_base64 = data.get('imageBase64')
        image_path = None
        if image_base64:
            image_filename = f"{existing_course.id}.png"
            image_path = save_base64_image(image_base64, image_filename)
        if image_path:
            existing_course.image = image_path
        existing_course.num_sections = data.get('num_sections', existing_course.num_sections)
        existing_course.num_enrolled = data.get('num_enrolled', existing_course.num_enrolled)
        existing_course.category_id = data.get('category_id', existing_course.category_id)
        existing_course.sections = sections
        existing_course.save()
        
        return jsonify(
         {   
            "message": "success",
            "data": CourseSchema().dump(existing_course)
        })


    def get_category_by_search_term(self, filter_by, search_term):
        """get category by filkter by and search term

        Args:
            filter_by (id, name): _description_
            search_term (the given id or name): _description_
        """
        if filter_by.lower() == 'id':
            return self.__session.query(Category).filter(Category.id == search_term).all()
        elif filter_by.lower() == 'name':
            return self.__session.query(Category).filter(func.lower(Category.name).like(f"%{search_term.lower()}%")).all()
        else:
            return None

    def get_all_instructor_lessons(self, instructor_id):
        """return list of all instructor's lessons"""
        CourseAlias = aliased(Course)
        SectionAlias = aliased(Section)
        lessons = (
            self.__session.query(Lesson)
                            .join(SectionAlias, Lesson.section_id == SectionAlias.id)
                            .join(CourseAlias, SectionAlias.course_id == CourseAlias.id)
                            .filter(and_(CourseAlias.instructor_id == instructor_id,
                                    CourseAlias.approved == True))
                            .all())
        return lessons

    def get_all_instructor_sections(self, instructor_id):
        """return list of all instructor's sections"""
        CourseAlias = aliased(Course)
        sections = (
            self.__session.query(Section)
                            .join(CourseAlias, Section.course_id == CourseAlias.id)
                            .filter(and_(CourseAlias.instructor_id == instructor_id,
                                    CourseAlias.approved == True))
                            .all())
        
        return sections

    def get_courses_best_choise(self, page, per_page):
        """method to filter courses by number of enrolled students"""
        offset = (page - 1) * per_page

        results = self.__session.query(Course)\
            .order_by(Course.num_enrolled.desc())\
            .offset(offset)\
                .limit(per_page).all()
        return results
