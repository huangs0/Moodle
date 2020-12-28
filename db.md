# Setting up Database
## Environment
MySQL version used for this project is 8.0.22 Community Package

Recommand use Navicat 15 to manage the data base

## Create Database
Open MySQL Server and Connect use MySQL shell
```SQL
CREATE DATABASE Moodle
```

Please use following command to check if create database successfully
```SQL
show databases;
```
## Create Table under this database
#### Switch Database
```SQL
use Moodle;
```
#### Create table `answer`
```SQL
CREATE TABLE `answer` (
  `question_id` int NOT NULL,
  `answer_id` int NOT NULL AUTO_INCREMENT,
  `creator_name` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `content` varchar(1000) NOT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`answer_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
#### Create table `assignment`
```SQL
CREATE TABLE `assignment` (
  `assignment_id` int NOT NULL AUTO_INCREMENT,
  `course_id` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` varchar(1000) NOT NULL,
  `deadline` datetime NOT NULL,
  PRIMARY KEY (`assignment_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
#### Create table `course`
```SQL
CREATE TABLE `course` (
  `course_id` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `participator` json NOT NULL,
  `instructor` json NOT NULL,
  `topics` json DEFAULT NULL,
  `title` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`course_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
#### Create table `info`
```SQL
CREATE TABLE `info` (
  `user_id` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `phone` varchar(40)  NOT NULL,
  `faculty` varchar(40) NOT NULL,
  `department` varchar(40) NOT NULL,
  `first_major` varchar(40) NOT NULL,
  `second_major` varchar(40) NOT NULL DEFAULT 'Null',
  `first_minor` varchar(40) NOT NULL DEFAULT 'NULL',
  `second_minor` varchar(40) NOT NULL DEFAULT 'Null',
  `name` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

#### Create table `login`
```SQL
CREATE TABLE `login` (
  `user_id` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(40) NOT NULL,
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
```

#### Create table `message`
```SQL
CREATE TABLE `message` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` varchar(1000) NOT NULL,
  PRIMARY KEY (`message_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
```

#### Create table `news`
```SQL
CREATE TABLE `news` (
  `course_id` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `time` datetime NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` varchar(1000) NOT NULL,
  `creator_name` varchar(40) NOT NULL,
  `news_id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`news_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
```

#### Create table `question`
```SQL
CREATE TABLE `question` (
  `course_id` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `question_id` int NOT NULL AUTO_INCREMENT,
  `creator_name` varchar(40) NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` varchar(1000) NOT NULL,
  `time` datetime NOT NULL,
  `topic` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`question_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
```

#### Create table `section`
```SQL
CREATE TABLE `section` (
  `section_id` int NOT NULL AUTO_INCREMENT,
  `course_id` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` varchar(1000) NOT NULL,
  PRIMARY KEY (`section_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
```

#### Create table `source`
```SQL
CREATE TABLE `source` (
  `course_id` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `type` varchar(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `file_name` varchar(255)  NOT NULL,
  `source_id` int NOT NULL AUTO_INCREMENT,
  `section_id` int DEFAULT NULL,
  `subsection_id` int DEFAULT NULL,
  `assignment_id` int DEFAULT NULL,
  PRIMARY KEY (`source_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
```

#### Create table `submission`
```SQL
CREATE TABLE `submission` (
  `submission_id` int NOT NULL AUTO_INCREMENT,
  `assignment_id` int NOT NULL,
  `user_id` varchar(40) NOT NULL,
  `time` datetime NOT NULL,
  `file_name` varchar(255) NOT NULL,
  PRIMARY KEY (`submission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
```

#### Create table `subsection`
```SQL
CREATE TABLE `subsection` (
  `title` varchar(100) NOT NULL,
  `type` varchar(40) NOT NULL,
  `content` varchar(1000) NOT NULL,
  `section_id` int NOT NULL,
  `subsection_id` int NOT NULL AUTO_INCREMENT,
  `course_id` varchar(40) NOT NULL,
  PRIMARY KEY (`subsection_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
```

#### Create table `user`
```SQL
CREATE TABLE `user` (
  `user_id` varchar(40) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name` varchar(255) NOT NULL,
  `identity` varchar(20) NOT NULL,
  `course` json NOT NULL,
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
```

## Sample Data Record
Sample Records will be uploaded later
