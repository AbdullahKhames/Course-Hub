-- MySQL dump 10.13  Distrib 8.0.34, for Linux (x86_64)
--
-- Host: localhost    Database: ch_dev_db
-- ------------------------------------------------------
-- Server version	8.0.34-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` varchar(60) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES ('8b46f1c2-5fd8-41cb-bf32-cb75e6179f2d');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `name` varchar(128) NOT NULL,
  `id` varchar(60) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('Anime','0083ded0-7472-4243-9341-3e2490717167','2023-12-15 21:41:16','2023-12-15 21:41:16'),('Programming','7ca6d7dc-8026-424b-be0f-99ca8327208f','2023-12-15 17:38:10','2023-12-15 17:38:10'),('Games','eb820948-262f-48e0-8f65-55b1195b4b96','2023-12-15 20:55:42','2023-12-15 20:55:42'),('science','ebff272c-c3ac-4601-88e0-e5680d09a10f','2023-12-15 20:44:49','2023-12-15 20:44:49');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `name` varchar(128) NOT NULL,
  `description` varchar(1024) DEFAULT NULL,
  `approved` tinyint(1) NOT NULL,
  `hours` int NOT NULL,
  `num_sections` int NOT NULL,
  `num_enrolled` int NOT NULL,
  `image` varchar(200) DEFAULT NULL,
  `category_id` varchar(60) DEFAULT NULL,
  `instructor_id` varchar(60) NOT NULL,
  `id` varchar(60) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `instructor_id` (`instructor_id`),
  CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `courses_ibfk_2` FOREIGN KEY (`instructor_id`) REFERENCES `instructors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES ('Introduction to Astrophysics','Embark on a fascinating journey into the cosmos with our Introduction to Astrophysics course. Explore the wonders of the universe, from celestial bodies to the fundamental laws governing the cosmos. No prior knowledge of physics is required – just a curiosity about the mysteries of space and time!',1,15,3,0,'02b03905-a096-436b-9a21-67e76d08bd8d.png','ebff272c-c3ac-4601-88e0-e5680d09a10f','691a40cf-e9d7-4eb7-ab86-f63c3be19f5c','02b03905-a096-436b-9a21-67e76d08bd8d','2023-12-15 20:51:21','2023-12-15 21:57:41'),('Game Development Fundamentals','Dive into the exciting world of game development with our Game Development Fundamentals course. Whether you\'re a budding game designer or a programming enthusiast, this course covers the essential concepts and skills needed to create your own interactive games.',1,18,2,0,'2d186370-2c8a-42d4-907b-4cce7d35a6f8.png','eb820948-262f-48e0-8f65-55b1195b4b96','834904ce-9e16-41b9-8f3d-c3065ed37549','2d186370-2c8a-42d4-907b-4cce7d35a6f8','2023-12-15 20:59:41','2023-12-15 22:23:42'),('Mastering Rocket League','Elevate your Rocket League gameplay with our Mastering Rocket League course. Whether you\'re a beginner or an experienced player, this course provides advanced techniques, strategies, and tips to take your skills to the next level.',1,10,4,1,'41a7519d-e09a-4ec5-adcc-c5522f94f7cf.png','eb820948-262f-48e0-8f65-55b1195b4b96','834904ce-9e16-41b9-8f3d-c3065ed37549','41a7519d-e09a-4ec5-adcc-c5522f94f7cf','2023-12-15 21:27:38','2023-12-15 22:22:41'),('Mastering GTA V','Elevate your gameplay in Grand Theft Auto V with our Mastering GTA V course. Whether you\'re a seasoned player or just starting, this course provides advanced strategies, tips, and tricks to enhance your skills and enjoyment of the game.',1,12,4,1,'d2b3e897-6767-40dc-854e-aacccab7d01c.png','eb820948-262f-48e0-8f65-55b1195b4b96','834904ce-9e16-41b9-8f3d-c3065ed37549','d2b3e897-6767-40dc-854e-aacccab7d01c','2023-12-15 21:06:47','2023-12-15 22:22:54'),('Attack on Titan','Dive into the world of Attack on Titan with this comprehensive course. Explore the intriguing story, characters, and themes that make Attack on Titan one of the most captivating anime series. Perfect for anime enthusiasts and newcomers alike.',1,8,3,2,'da45b642-3ca7-49ab-a0c6-559513f6841d.png','0083ded0-7472-4243-9341-3e2490717167','002b5194-59e5-4f3d-8cd7-210fa2d21d41','da45b642-3ca7-49ab-a0c6-559513f6841d','2023-12-15 21:53:02','2023-12-17 12:38:31'),('Introduction to Python','Learn the basics of Python programming language.',1,10,3,1,'e3920f85-4af9-4c7c-b418-1d58fa0ce446.png','7ca6d7dc-8026-424b-be0f-99ca8327208f','691a40cf-e9d7-4eb7-ab86-f63c3be19f5c','e3920f85-4af9-4c7c-b418-1d58fa0ce446','2023-12-15 20:24:24','2023-12-17 11:43:01'),('Web Development Bootcamp','Join our comprehensive Web Development Bootcamp and embark on a journey to become a skilled web developer. This course covers HTML, CSS, JavaScript, and popular web development frameworks.',1,20,5,1,'e7a65c49-f4d4-4590-ac7a-e491982a3f86.png','7ca6d7dc-8026-424b-be0f-99ca8327208f','691a40cf-e9d7-4eb7-ab86-f63c3be19f5c','e7a65c49-f4d4-4590-ac7a-e491982a3f86','2023-12-15 20:32:19','2023-12-17 12:38:08'),('One Piece','Journey through One Piece: Adventure on the Grand Line',1,12,4,0,'ea89c016-ff5d-47df-ae89-d4521301b708.png','0083ded0-7472-4243-9341-3e2490717167','002b5194-59e5-4f3d-8cd7-210fa2d21d41','ea89c016-ff5d-47df-ae89-d4521301b708','2023-12-17 20:53:22','2023-12-17 21:06:07');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enrollments` (
  `student_id` varchar(60) NOT NULL,
  `course_id` varchar(60) NOT NULL,
  `completed` int NOT NULL,
  `enrolled_date` datetime DEFAULT NULL,
  PRIMARY KEY (`student_id`,`course_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  CONSTRAINT `enrollments_chk_1` CHECK (((`completed` >= 0) and (`completed` <= 100)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
INSERT INTO `enrollments` VALUES ('32d227f5-2522-4bea-a434-1a3d47e68d68','41a7519d-e09a-4ec5-adcc-c5522f94f7cf',0,'2023-12-15 22:22:41'),('32d227f5-2522-4bea-a434-1a3d47e68d68','d2b3e897-6767-40dc-854e-aacccab7d01c',0,'2023-12-15 22:22:54'),('32d227f5-2522-4bea-a434-1a3d47e68d68','da45b642-3ca7-49ab-a0c6-559513f6841d',0,'2023-12-15 22:08:42'),('32d227f5-2522-4bea-a434-1a3d47e68d68','e3920f85-4af9-4c7c-b418-1d58fa0ce446',0,'2023-12-15 22:23:20'),('f699a263-5b10-47ec-88b9-afac05b1f4a7','da45b642-3ca7-49ab-a0c6-559513f6841d',0,'2023-12-17 12:38:31'),('f699a263-5b10-47ec-88b9-afac05b1f4a7','e7a65c49-f4d4-4590-ac7a-e491982a3f86',0,'2023-12-17 12:38:07');
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructors`
--

DROP TABLE IF EXISTS `instructors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instructors` (
  `total_students` int NOT NULL,
  `id` varchar(60) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `instructors_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructors`
--

LOCK TABLES `instructors` WRITE;
/*!40000 ALTER TABLE `instructors` DISABLE KEYS */;
INSERT INTO `instructors` VALUES (2,'002b5194-59e5-4f3d-8cd7-210fa2d21d41'),(1,'691a40cf-e9d7-4eb7-ab86-f63c3be19f5c'),(2,'834904ce-9e16-41b9-8f3d-c3065ed37549');
/*!40000 ALTER TABLE `instructors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lessons`
--

DROP TABLE IF EXISTS `lessons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lessons` (
  `name` varchar(128) NOT NULL,
  `lesson_num` int NOT NULL,
  `content` text NOT NULL,
  `section_id` varchar(60) DEFAULT NULL,
  `id` varchar(60) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `section_id` (`section_id`),
  CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lessons`
--

LOCK TABLES `lessons` WRITE;
/*!40000 ALTER TABLE `lessons` DISABLE KEYS */;
INSERT INTO `lessons` VALUES ('The Big Bang and Beyond',2,'Explore the history and evolution of the universe. Learn about the Big Bang theory and the current state of cosmological research.','34b72f3a-2b4c-4420-8f1b-93f2d2ff48e4','048c13b1-fb07-4f88-a65c-ed9d20f68571','2023-12-15 20:51:21','2023-12-15 20:51:21'),('Themes and Symbolism in Attack on Titan',2,'Explore the themes and symbolism present in Attack on Titan, addressing social, political, and philosophical aspects.','100cca13-236c-4a1f-8533-c2c1e29ed40a','0c7a224b-cf39-4c4b-90e5-c7ad63998786','2023-12-15 21:53:02','2023-12-15 21:53:02'),('Armored Titan',2,'the Armored Titan\'s greatest strength is the incredibly hard skin that covers most of its body','c55f0e60-5bed-4dd6-b521-7be448320f0f','0f9472aa-b9d3-4107-9ae4-01c909beaa13','2023-12-15 21:53:02','2023-12-15 21:53:02'),('Building Single Page Applications with React.js',1,'Learn how to build modern, single-page applications using React.js. Explore component-based architecture and the power of React for UI development.','cf3730e4-f81c-4aae-9386-2cd0774b47c0','240d1aa4-6bdc-4913-8b1f-172a9984eeaa','2023-12-15 20:32:19','2023-12-15 20:32:19'),('JavaScript Functions and Objects',1,'Take your JavaScript skills to the next level by understanding functions and working with objects. Enhance your ability to create dynamic and interactive web applications.','2df0b7e6-480f-4888-aade-09d72cfc2dc3','2d1e37b6-f151-4d9d-b9f6-2b93e87c8d7f','2023-12-15 20:32:19','2023-12-15 20:32:19'),('Overview of One Piece',1,'Gain an overview of the One Piece series, its creation, and its enduring popularity.','3a8754f7-79c7-46b0-9cd7-8a4c5ba6399b','3192b893-10c9-4be6-aec3-204c5565b341','2023-12-17 20:53:22','2023-12-17 20:53:22'),('Overview of Attack on Titan',1,'Get an overview of the Attack on Titan series, its creation, and its impact on the anime industry.','5a36d01f-3c4f-43d7-ab0e-3516949e0ceb','31fdabe1-a103-4683-8d57-025af6448002','2023-12-15 21:53:02','2023-12-15 21:53:02'),('Server-Side Development with Node.js and Express.js',1,'Delve into server-side development with Node.js and Express.js. Understand how to create APIs and server-side logic for your web applications.','788cdeb1-b967-4f6d-91d8-ddc09299eafa','324f376f-867e-4898-af99-9ad657b3dcc8','2023-12-15 20:32:19','2023-12-15 20:32:19'),('Character Spotlight: Eren Yeager',2,'Analyze the main protagonist, Eren Yeager, and explore his character development throughout the series.','5a36d01f-3c4f-43d7-ab0e-3516949e0ceb','369b03ab-8a38-441e-9419-e2c2cd251760','2023-12-15 21:53:02','2023-12-15 21:53:02'),('Optimizing Vehicle Handling',1,'Learn how to master the handling of various vehicles in GTA V, from cars to motorcycles. Discover techniques for precise control and quick getaways.','6cea45fd-3ad1-44d6-a9aa-81503080d1f5','3713b0c4-cead-4918-8670-2b15257e2630','2023-12-15 21:06:47','2023-12-15 21:06:47'),('Strategies for Climbing the Ranks',1,'Develop strategies and tactics to climb the ranks in Rocket League\'s competitive mode.\nLearn how to adapt to different opponents and increase your competitive ranking.','2db332dc-c9a4-4fee-8f03-f8ec726efa24','390b87f1-305b-4edd-9692-6b7048e79cd0','2023-12-15 21:27:38','2023-12-15 21:27:38'),('CSS Flexbox and Grid',1,'Master the art of styling with CSS. Explore Flexbox and Grid layouts to create responsive and visually appealing web pages.','5ce61b42-e2b2-42c1-a9a8-3a8255bfef95','39613d7c-3f4c-457b-974a-1285646b514f','2023-12-15 20:32:19','2023-12-15 20:32:19'),('Effective Team Coordination',2,'Elevate your gameplay by mastering team coordination. Communicate effectively, position yourself strategically, and secure victories with your teammates.','2db332dc-c9a4-4fee-8f03-f8ec726efa24','3cbf0022-2d91-4796-92fc-06f91004b0b5','2023-12-15 21:27:38','2023-12-15 21:27:38'),('Introduction to Unity',1,'Get hands-on experience with Unity, a popular game development engine.\nExplore the Unity interface and learn the basics of creating game scenes.','7154cda0-09ca-498f-a8bf-f39606c5f0b1','3d2c86ba-c34b-498b-94c0-f1624b39c0d5','2023-12-15 20:59:41','2023-12-15 20:59:41'),('Dominating GTA Online',1,'Take your skills to the online multiplayer realm. Learn effective strategies for missions, races, and interactions with other players in GTA Online.','190f5189-af73-40f7-94e4-d96f455ee760','4093f397-e0d1-4e76-a5fc-0ff8fc472a2f','2023-12-15 21:06:47','2023-12-15 21:06:47'),('Combat Strategies and Weapon Choice',1,'Improve your combat skills by understanding weapon mechanics and choosing the right tools for different situations. Master the art of aiming and dodging.','a38d5190-cc43-4e50-be7b-0dc32aa46cbc','4a9d44d2-ed01-49b2-93de-4f2d0798514d','2023-12-15 21:06:47','2023-12-15 21:06:47'),('War Hammer Titan',9,'The final Titan to be revealed in the series, the War Hammer Titan, uses the common ability of Titans to harden their skin to create weapons made of their crystalized flesh.','c55f0e60-5bed-4dd6-b521-7be448320f0f','4e6164a7-cb42-4b02-a2f0-bd51324aa8dc','2023-12-15 21:53:02','2023-12-15 21:53:02'),('Lesson 5',1,'Learn how to create reusable code and enhance your Python skills.','e5c80515-0a8a-4b35-8297-d8aff4900960','4e6d5c59-7651-408a-ae99-91073db1db58','2023-12-15 20:24:24','2023-12-15 20:24:24'),('Advanced Ball Dribbling Techniques',1,'Dive into advanced ball control techniques, including dribbling and flicks.\nSurprise your opponents with unpredictable maneuvers on the field.','1cdb5886-1817-414f-b27f-d1de3f7cc9f6','555db531-b864-4002-9cae-c10aacd8021e','2023-12-15 21:27:38','2023-12-15 21:27:38'),('Unraveling the Plot Twists',1,'Delve into the complex plot and story arcs of Attack on Titan, including major plot twists and revelations.','100cca13-236c-4a1f-8533-c2c1e29ed40a','6011f844-a53e-4adb-8916-90bdf162d824','2023-12-15 21:53:02','2023-12-15 21:53:02'),('Jaw Titan',6,'Easily the smallest and weakest of the shifter Titan forms, the Jaw Titan uses its size to its advantage by being uncharacteristically mobile for a Titan','c55f0e60-5bed-4dd6-b521-7be448320f0f','67ff9919-86d2-4834-ad90-f4ca01bc15d9','2023-12-15 21:53:02','2023-12-15 21:53:02'),('Perfecting Aerial Shots',1,'Learn the intricacies of executing perfect aerial shots in Rocket League.\nMaster the art of flying, boosting, and scoring goals with precision.','d4abc6a9-c93f-47c6-b795-082384f36628','69e5c7d6-dea8-4b17-b422-202bb34345b9','2023-12-15 21:27:38','2023-12-15 21:27:38'),('Principles of Game Design',1,'Learn the fundamental principles of game design, including game mechanics,\n player engagement, and creating compelling narratives for video games.','c91d4fab-babb-4da0-a014-bcda2283a4f8','6ee8df63-5929-4059-a73e-d2ccbc5db23c','2023-12-15 20:59:41','2023-12-15 20:59:41'),('Optimal Positioning and Rotation',1,'Understand the importance of positioning and rotation in Rocket League.\nImprove your decision-making skills and enhance team coordination.','c32c65a3-013f-4f9a-8e96-292559821bac','6f4365fa-2946-495b-8b64-f8170a5f74a2','2023-12-15 21:27:38','2023-12-15 21:27:38'),('Creating Multiplayer Games',2,'Delve into the challenges and opportunities of multiplayer game development.\nLearn how to implement online features and create engaging multiplayer experiences.','7154cda0-09ca-498f-a8bf-f39606c5f0b1','70c169c5-3d42-4264-88e2-675e5464dbe6','2023-12-15 20:59:41','2023-12-15 20:59:41'),('Navigating the Grand Line',1,'Dive into the mysterious and perilous Grand Line, the setting for many of the series adventures.','6c869cf3-6e02-487e-9e21-3baeaff68042','79395eba-764d-4aad-b43c-13ef58e96ab7','2023-12-17 20:53:22','2023-12-17 20:53:22'),('Iconic Characters of One Piece',1,'Explore the diverse and memorable characters that populate the world of One Piece, from Luffy to Zoro.','5d90394c-9214-474c-84ea-2712962ede7d','7f2684d1-f19f-4913-b7a7-af68f2613dfe','2023-12-17 20:53:22','2023-12-17 20:53:22'),('Small Intro and description',1,'Embark on an epic journey through the world of One Piece with this captivating course.\nExplore the vast oceans, encounter legendary pirates, and uncover the mysteries of the Grand Line.\nPerfect for fans of the long-running and beloved anime and manga series, One Piece.','3a8754f7-79c7-46b0-9cd7-8a4c5ba6399b','8e97d40c-4366-4b20-9a68-a0cdc1414c11','2023-12-17 20:53:22','2023-12-17 20:53:22'),('Beast Titan',5,'The Beast Titan\'s main ability is taking the form and characteristics of an animal, the specifics of which varies depending on the user of the Titan; Zeke Yaegar\'s is a giant monkey','c55f0e60-5bed-4dd6-b521-7be448320f0f','9c22cad9-950c-4c45-8a1b-3a9fb28df6a9','2023-12-15 21:53:02','2023-12-15 21:53:02'),('Themes and Values in One Piece',1,'Examine the overarching themes and values present in One Piece, including friendship, freedom, and justice.','adb26deb-87f6-426c-b780-57206bcc27c6','9fae992d-c887-4e73-bc61-38f2678e0d03','2023-12-17 20:53:22','2023-12-17 20:53:22'),('Female Titan',4,'While the Female Titan has no inherent powers of its own, it is capable of mimicking the powers of other Titans by consuming parts of them.','c55f0e60-5bed-4dd6-b521-7be448320f0f','a898c717-1e39-4d7f-a2da-cffa616d56ea','2023-12-15 21:53:02','2023-12-15 21:53:02'),('Colossal Titan',1,'Arguably the mascot of the franchise, the unforgettable Colossal Titan is the largest Titan of them all, standing at a massive 60 meters','c55f0e60-5bed-4dd6-b521-7be448320f0f','b114b69a-78d5-4772-9267-db5f828ea87b','2023-12-15 21:53:02','2023-12-15 21:53:02'),('Lesson 2',2,'Building on the fundamentals, Lesson 2 will explore control, structures such as loops and conditional statements. Mastering these concepts is crucial for writing efficient programs.','fd38e887-8b8d-49f0-a7ae-acb738e96d8d','b2a20370-dc4e-480b-a34b-b3e424848a85','2023-12-15 20:24:24','2023-12-15 20:24:24'),('Lesson 1',1,'In this lesson, we will cover the basic syntax of Python, including variables, data types, and simple operations. Get ready to dive into the exciting world of programming!','fd38e887-8b8d-49f0-a7ae-acb738e96d8d','b6d71731-50c4-47f9-a941-3236ae7364c2','2023-12-15 20:24:24','2023-12-15 20:24:24'),('Introduction to HTML',1,'Dive into the world of HTML (Hypertext Markup Language), the backbone of web development. Learn about tags, elements, and document structure.','e5329edd-5534-4a74-9262-9bd6fb9f5c65','bccc2d32-3e73-4b98-8627-f0d2cffe2097','2023-12-15 20:32:19','2023-12-15 20:32:19'),('Lesson 3',1,'Welcome to the world of functions and modular programming. Learn how to create reusable code and enhance your Python skills.','3e7dae59-3db5-4701-9982-aab219da6253','c2d4e169-6bca-4d5a-8d0a-744a1d02f222','2023-12-15 20:24:24','2023-12-15 20:24:24'),('Founding Titan',6,'The most important Titan of all and what Marley\'s Warriors were sent to Paradis to retreive. The Founding Titan\'s owner is capable of using their screams to control other Titans','c55f0e60-5bed-4dd6-b521-7be448320f0f','d5f85e40-56d0-43ff-9d6c-3c8748b37ef8','2023-12-15 21:53:02','2023-12-15 21:53:02'),('Lesson 4',2,'Lesson Four','3e7dae59-3db5-4701-9982-aab219da6253','dd193d10-c1f7-4177-8a48-d943abf5455e','2023-12-15 20:24:24','2023-12-15 20:24:24'),('Understanding Gravity',1,'Delve into the force that governs the cosmos – gravity. Learn about Newton\'s laws of motion and the principles of orbital mechanics that keep celestial bodies in motion.','34b72f3a-2b4c-4420-8f1b-93f2d2ff48e4','dea4f351-cde2-4cdb-83b9-025ee0fbbe43','2023-12-15 20:51:21','2023-12-15 20:51:21'),('Exploration and Hidden Secrets',2,'Uncover hidden secrets and easter eggs scattered throughout the vast world of GTA V. Enhance your exploration experience with valuable tips and locations.','63c81d17-0751-4c85-83ff-1fdc0f21bba8','deedf413-d888-4715-82b0-0cbfca3a8546','2023-12-15 21:06:47','2023-12-15 21:06:47'),('Telescopes and Observational Techniques',2,'Uncover the secrets of observational astronomy. Explore different types of telescopes and observational techniques used by astronomers to study the universe.','5aa1cf3f-39e3-482e-9f8e-cfc1690c5450','e8a8bda7-2dfd-4d56-817d-1a9d956f866a','2023-12-15 20:51:21','2023-12-15 20:51:21'),('Attack Titan',3,'Attack Titan is a lean form that is well built for close combat','c55f0e60-5bed-4dd6-b521-7be448320f0f','ed6ae957-c251-433f-a2f6-15ea6a04ab3e','2023-12-15 21:53:02','2023-12-15 21:53:02'),('Navigating the Stars',1,'Discover the constellations and celestial objects visible in the night sky. Learn how ancient civilizations used the stars for navigation and storytelling.','5aa1cf3f-39e3-482e-9f8e-cfc1690c5450','f841d532-a237-4600-b431-414792d1c537','2023-12-15 20:51:21','2023-12-15 20:51:21'),('Life Cycle of Stars',1,'Journey through the life cycle of stars, from their formation to supernova explosions. Understand the different types of stars and their impact on the universe.','51e423e6-70de-46a4-a92f-ed18725862b1','fa1759e9-db78-49df-9d38-266e13baba59','2023-12-15 20:51:21','2023-12-15 20:51:21'),('Cart Titan',8,'The Cart Titan is a unique form that exclusively maneuvers on all fours. Like the Jaw Titan, it is small and without much in the way of defense','c55f0e60-5bed-4dd6-b521-7be448320f0f','fa2a37f7-7835-42a1-a45f-94270dddfb5b','2023-12-15 21:53:02','2023-12-15 21:53:02'),('Heist Planning and Execution',1,'Dive into the intricacies of planning and executing heists in GTA V.\nExplore different approaches, gather the right crew, and maximize rewards.','63c81d17-0751-4c85-83ff-1fdc0f21bba8','fc98b751-26aa-47fa-90f1-d51e8a045695','2023-12-15 21:06:47','2023-12-15 21:06:47');
/*!40000 ALTER TABLE `lessons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sections`
--

DROP TABLE IF EXISTS `sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sections` (
  `name` varchar(128) NOT NULL,
  `section_num` int NOT NULL,
  `course_id` varchar(60) NOT NULL,
  `id` varchar(60) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `sections_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sections`
--

LOCK TABLES `sections` WRITE;
/*!40000 ALTER TABLE `sections` DISABLE KEYS */;
INSERT INTO `sections` VALUES ('Plot and Symbolism',2,'da45b642-3ca7-49ab-a0c6-559513f6841d','100cca13-236c-4a1f-8533-c2c1e29ed40a','2023-12-15 21:53:02','2023-12-15 21:53:02'),('Online Multiplayer Strategies',3,'d2b3e897-6767-40dc-854e-aacccab7d01c','190f5189-af73-40f7-94e4-d96f455ee760','2023-12-15 21:06:47','2023-12-15 21:06:47'),('Advanced Ball Control',3,'41a7519d-e09a-4ec5-adcc-c5522f94f7cf','1cdb5886-1817-414f-b27f-d1de3f7cc9f6','2023-12-15 21:27:38','2023-12-15 21:27:38'),('Rank Climbing Strategies',4,'41a7519d-e09a-4ec5-adcc-c5522f94f7cf','2db332dc-c9a4-4fee-8f03-f8ec726efa24','2023-12-15 21:27:38','2023-12-15 21:27:38'),('JavaScript Essentials',4,'e7a65c49-f4d4-4590-ac7a-e491982a3f86','2df0b7e6-480f-4888-aade-09d72cfc2dc3','2023-12-15 20:32:19','2023-12-15 20:32:19'),('Gravity and Orbital Mechanics',2,'02b03905-a096-436b-9a21-67e76d08bd8d','34b72f3a-2b4c-4420-8f1b-93f2d2ff48e4','2023-12-15 20:51:21','2023-12-15 20:51:21'),('Introduction to One Piece',1,'ea89c016-ff5d-47df-ae89-d4521301b708','3a8754f7-79c7-46b0-9cd7-8a4c5ba6399b','2023-12-17 20:53:22','2023-12-17 20:53:22'),('Intermediate Concepts',2,'e3920f85-4af9-4c7c-b418-1d58fa0ce446','3e7dae59-3db5-4701-9982-aab219da6253','2023-12-15 20:24:24','2023-12-15 20:24:24'),('Stellar Evolution',3,'02b03905-a096-436b-9a21-67e76d08bd8d','51e423e6-70de-46a4-a92f-ed18725862b1','2023-12-15 20:51:21','2023-12-15 20:51:21'),('Introduction to Attack on Titan',1,'da45b642-3ca7-49ab-a0c6-559513f6841d','5a36d01f-3c4f-43d7-ab0e-3516949e0ceb','2023-12-15 21:53:02','2023-12-15 21:53:02'),('The Night Sky',1,'02b03905-a096-436b-9a21-67e76d08bd8d','5aa1cf3f-39e3-482e-9f8e-cfc1690c5450','2023-12-15 20:51:21','2023-12-15 20:51:21'),('CSS Styling Techniques',2,'e7a65c49-f4d4-4590-ac7a-e491982a3f86','5ce61b42-e2b2-42c1-a9a8-3a8255bfef95','2023-12-15 20:32:19','2023-12-15 20:32:19'),('Legendary Characters',3,'ea89c016-ff5d-47df-ae89-d4521301b708','5d90394c-9214-474c-84ea-2712962ede7d','2023-12-17 20:53:22','2023-12-17 20:53:22'),('Heists and Missions',3,'d2b3e897-6767-40dc-854e-aacccab7d01c','63c81d17-0751-4c85-83ff-1fdc0f21bba8','2023-12-15 21:06:47','2023-12-15 21:06:47'),('Exploring the Grand Line',2,'ea89c016-ff5d-47df-ae89-d4521301b708','6c869cf3-6e02-487e-9e21-3baeaff68042','2023-12-17 20:53:22','2023-12-17 20:53:22'),('Vehicle Mastery',1,'d2b3e897-6767-40dc-854e-aacccab7d01c','6cea45fd-3ad1-44d6-a9aa-81503080d1f5','2023-12-15 21:06:47','2023-12-15 21:06:47'),('Programming for Games',2,'2d186370-2c8a-42d4-907b-4cce7d35a6f8','7154cda0-09ca-498f-a8bf-f39606c5f0b1','2023-12-15 20:59:41','2023-12-15 20:59:41'),('Node.js and Express.js',5,'e7a65c49-f4d4-4590-ac7a-e491982a3f86','788cdeb1-b967-4f6d-91d8-ddc09299eafa','2023-12-15 20:32:19','2023-12-15 20:32:19'),('Combat Tactics',2,'d2b3e897-6767-40dc-854e-aacccab7d01c','a38d5190-cc43-4e50-be7b-0dc32aa46cbc','2023-12-15 21:06:47','2023-12-15 21:06:47'),('Themes and Values',4,'ea89c016-ff5d-47df-ae89-d4521301b708','adb26deb-87f6-426c-b780-57206bcc27c6','2023-12-17 20:53:22','2023-12-17 20:53:22'),('Positioning and Rotation',2,'41a7519d-e09a-4ec5-adcc-c5522f94f7cf','c32c65a3-013f-4f9a-8e96-292559821bac','2023-12-15 21:27:38','2023-12-15 21:27:38'),('Titans',3,'da45b642-3ca7-49ab-a0c6-559513f6841d','c55f0e60-5bed-4dd6-b521-7be448320f0f','2023-12-15 21:53:02','2023-12-15 21:53:02'),('Introduction to Game Design',1,'2d186370-2c8a-42d4-907b-4cce7d35a6f8','c91d4fab-babb-4da0-a014-bcda2283a4f8','2023-12-15 20:59:41','2023-12-15 20:59:41'),('React.js Framework',4,'e7a65c49-f4d4-4590-ac7a-e491982a3f86','cf3730e4-f81c-4aae-9386-2cd0774b47c0','2023-12-15 20:32:19','2023-12-15 20:32:19'),('Aerial Mastery',1,'41a7519d-e09a-4ec5-adcc-c5522f94f7cf','d4abc6a9-c93f-47c6-b795-082384f36628','2023-12-15 21:27:38','2023-12-15 21:27:38'),('HTML Fundamentals',1,'e7a65c49-f4d4-4590-ac7a-e491982a3f86','e5329edd-5534-4a74-9262-9bd6fb9f5c65','2023-12-15 20:32:19','2023-12-15 20:32:19'),('Advanced Topics',3,'e3920f85-4af9-4c7c-b418-1d58fa0ce446','e5c80515-0a8a-4b35-8297-d8aff4900960','2023-12-15 20:24:24','2023-12-15 20:24:24'),('Introduction',1,'e3920f85-4af9-4c7c-b418-1d58fa0ce446','fd38e887-8b8d-49f0-a7ae-acb738e96d8d','2023-12-15 20:24:24','2023-12-15 20:24:24');
/*!40000 ALTER TABLE `sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `interested` varchar(60) DEFAULT NULL,
  `id` varchar(60) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `interested` (`interested`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`interested`) REFERENCES `categories` (`id`),
  CONSTRAINT `students_ibfk_2` FOREIGN KEY (`id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES ('0083ded0-7472-4243-9341-3e2490717167','32d227f5-2522-4bea-a434-1a3d47e68d68'),('7ca6d7dc-8026-424b-be0f-99ca8327208f','f699a263-5b10-47ec-88b9-afac05b1f4a7');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blocklist`
--

DROP TABLE IF EXISTS `token_blocklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blocklist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `jti` varchar(60) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blocklist`
--

LOCK TABLES `token_blocklist` WRITE;
/*!40000 ALTER TABLE `token_blocklist` DISABLE KEYS */;
INSERT INTO `token_blocklist` VALUES (1,'db6d3e73-a7b0-40b4-9c78-4a8eb3723450','2023-12-15 17:36:48'),(2,'ce1f705d-27ab-49df-b563-1073f11fd715','2023-12-15 20:44:00'),(3,'13323340-dca6-42df-840b-f2bf67c747e6','2023-12-15 20:44:56'),(4,'4f647d50-6fed-45af-b13a-8696ece6f5b2','2023-12-15 20:45:13'),(5,'34e0501f-f402-432e-896a-f90c784ac34f','2023-12-15 20:53:59'),(6,'852dca32-edee-439d-92b4-cdf680cdb43a','2023-12-15 21:41:26'),(7,'63f71508-1a85-4e75-abf4-e73663e13f86','2023-12-15 22:06:34'),(8,'56732ff4-9e17-4e1c-80af-e8a0e035bc8e','2023-12-17 12:36:45'),(9,'fd8114d2-3a00-44fd-91cb-a81c11c9b85b','2023-12-17 20:12:35'),(10,'8d38059a-749b-4b20-a3c9-4fdbc9a1b48d','2023-12-17 21:05:01');
/*!40000 ALTER TABLE `token_blocklist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `email` varchar(45) NOT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(150) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `role` int NOT NULL,
  `id` varchar(60) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('Turkey@gmail.com','$2b$12$t.y.BCaJelZoZxrFRQdJseeI4g6GqnMl8a13Ejkpjw6a6fEPdYfVW','Mahmoud Turkey',20,1,'002b5194-59e5-4f3d-8cd7-210fa2d21d41','2023-12-15 21:43:12','2023-12-15 21:43:12'),('Bastawesse@gmail.com','$2b$12$UjaTXM0d0GnbHC/.5SC69eNvW7mP6u726Wl.40wcw9Orr1Xl5aKB6','Mohammed',20,2,'32d227f5-2522-4bea-a434-1a3d47e68d68','2023-12-15 22:07:31','2023-12-15 22:07:31'),('youssefahmedbakier@gmail.com','$2b$12$JIe1Ya8Iu3XIY5k15XRQn.0wC5KtCbrO4iP8QxjSo.ELIZ.uBMP9K','Youssef Instructor',19,1,'691a40cf-e9d7-4eb7-ab86-f63c3be19f5c','2023-12-15 17:39:46','2023-12-15 17:39:46'),('Fathy.reda.ahmed66@gmail.com','$2b$12$X0.TdEeuh34siOBGStsDROmc553Ebx9s6SHdTGSOgnUGWSW/qHFnC','Fathy Instructor',23,1,'834904ce-9e16-41b9-8f3d-c3065ed37549','2023-12-15 20:54:36','2023-12-15 20:54:36'),('admin@gmail.com','$2b$12$.smnfQ63vir8.VltpwwCD.7TUTSu5uSQyjfs1UVuK9.5asyMTRUkq','Admin',20,0,'8b46f1c2-5fd8-41cb-bf32-cb75e6179f2d','2023-12-15 17:36:12','2023-12-15 17:36:12'),('yuossefbakier@gmail.com','$2b$12$jYte7J1IS8OD2..Jo5moLeqe/m6ba..iL1BiWXG7vyHCWqwERdxq2','Youssef Ahmed',19,2,'f699a263-5b10-47ec-88b9-afac05b1f4a7','2023-12-15 17:38:58','2023-12-15 17:38:58');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-17 23:12:16
