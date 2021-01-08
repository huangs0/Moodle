# API Document for Moodle
### Author Huang Songlin
API follows RESTful standard

Javascript using ES6 standard

Default Running Port: **3001**, you can visit ./bin/www to change the port

# List of Routes
1. **/login**       Login to system
2. **/course**      Get details of a course
3. **/forum**       Post new questions or answers, Get forum details
4. **/message**     Get messages, delete specific message
5. **/news**        Get news of a course, post new news if you'r instructor of course
6. **/setting**     Get user info details, Post new details
7. **/source**      Get a source, Post a source
8. **/section**     Post new section or subsection, get details of a section
9. **/file**        Upload a source file or assignment file
10. **/assignment** Get list of assignment, Post new assignment or new submission
11. **/dashboard**  Get list of course for a student

## /login

#### Login to Webapp
```
type: POST
url: /login
post body: user_id, password
return: JSON Object with following two key 
status: status of login, in Boolean
    if status == false:
        error: details of error, in String
```

## /course

#### Get Course detail
```
type: GET
url: /course/:course_id
url params: course_id
get params: None
return: JSON Object with following two key
    status: status of get, in Boolean
    if status == false:
        error: details of error, in String
    if status == true:
        title: title of class, in String
        section: list of section, in JSON Array
          Each Entry has:
            section_id: id of section, in Number
            title: title of section, in String
            content: content of section, in String
            source: list of source of section, in JSON Array
              Each Entry has:
                title: title of source file
                file_name: file name of source
                subsection: list of subsection of section, in JSON Array
                  Every Entry has:
                    subsection_id: id of subsection
                    title: title of subsection
                    type: type of subsection
                    content: content of subsection
                    source: list of source of subsection, in JSON Array
                      Every Entry has:
                        title: title of source of subsection
                        file_name: file_name of source of subsection
```

## /forum

#### Get question details
``` 
type: GET
url: /forum/:course_id
url params: course_id
get params: None
return: JSON Object with following keys
    status: status of get, in Boolean
    if status == false:
        error: details of error, in String
    if status == true:
        question: details of question, in JSON Array
          Each Entry has:
            question_id: id of question, in Number
            creator_name: name of creator, in String
            title: title of question, in String
            content: content of question, in String
            time: time of creation, in String
            topic: topic of question, in String
            answer: details of answer, in JSON Array
              Each Entry has:
                creator_name: name of creator, in String
                content: content of answer, in String
                time: time of creation, in String
```   
#### Post new question

```
type: POST
url: /forum/question/:course_id
url params: course_id
post body: title, content, topic
return: JSON Object with following keys
    status: status of post, in Boolean
    if status == false:
        error: details of error, in String
```
#### Post new answer
```
type: POST
url: /forum/answer/:question_id
url params: question_id
post body: content
return: JSON Object with following keys
    status: status of post, in Boolean
    if status == false:
        error: details of error, in String
```

## /message

#### Get messages
```
type: GET
url: /message/
url params: None
get params: None
return: JSON Object with following keys
    status: status of get, in Boolean
    if status == false:
        error: details of error, in String
    if status == true:
        message: details of messages, in JSON Array
          Each Entry has:
            message_id: id of message, in Number
            title: title of message
            content: content of message
```
#### Delete messages
```
type: DELETE
url: /message/:message_id
url params: message_id
delete params: None
return: JSON Object with following keys
    status: status of delete, in Boolean
    if status == false:
        error: details of error, in String
```

## /news

#### Get news of a course
```
type: GET
url: /news/:course_id
url params: course_id
get params: None
return: JSON Object with following keys
    status: status of get, in Boolean
    if status == false:
        error: details of error, in String
    if status == true: 
        news: details of news, in JSON Array
          Each Entry has:
            time: time of creation
            title: title of news
            content: content of news
            creator_name: name of creator of news
```

#### Post news to a course
**Special Note: Only instructors of that course can post news**
```
type: POST
url: /news/:course_id
url params: course_id
post body: title, content
return: JSON Object with following keys
    status: status of post, in Boolean
    if status == false:
        error: details of error, in String
```

## /setting

#### Get info of a person
```
type: GET
url: /setting/
url params: None
get params: None
return JSON Object with following keys
    status: status of get, in Boolean
    if status == false:
        error: details of error, in String
    if status == true:
        info: JSON Object with following keys
            user_id: String
            name: String
            phone: String
            faculty: String
            department: String
            first_major: String
            second_major: String
            first_minor: String
            second_minor: String
```

#### POST changes to info
**Special Notes: You can only change phone, second_major, first_minor, second_minor**
```
type: POST
url: /setting/
url params: None
POST body: phone, second_majorm, first_minor, second_minor
return: JSON Object with following keys
    status: status of post, in Boolean
    if status == false:
        error: details of error, in String
```

## /source

#### Get source under a course
```
type: GET
url: /source/:course_id
url params: course_id
get params: None
return: JSON Object with following keys
    status: status of get, in Boolean
    if status == false:
        error: details of error, in String
    if status == true:
        source: JSON Object with following keys
        lecture: JSON Array 
          Each Entry has:
            title: title of source
            file_name: file_name of source
        tutorial: JSON Array
          Each Entry has:
            title: title of source
            file_name: file_name of source
        workshop: JSON Array
          Each Entry has:
            title: title of source
            file_name: file_name of source
        reading: JSON Array
          Each Entry has:
            title: title of source
            file_name: file_name of source
        assignment: JSON Array
          Each Entry has:
            title: title of source
            file_name: file_name of source
```

#### Post a source to a course
```
type: POST
url: /source/:course_id
url params: course_id
post body: type, title, file_name, section_id, subsection_id, assignment_id
If type == 'lecture' provide section_id
If type == 'assignment' provide assignment_id
Else provide subsection_id
return: JSON Object
    status: status of post, in Boolean
    if status == false:
        error: details of error, in String
```

## /section

#### Post new section
```
type: POST
url: /section/section/:course_id
url params: course_id
post body: title, content
return JSON Object
    status: status of post, in Boolean
    if status == false: 
        error: details of error, in String
```
#### Post new subsection
```
type: POST
url: /section/subsection/:section_id
url params: section_id
post body: title, type, content
return: JSON Object
    status: status of post, in Boolean
    if status == false:
        error: details of error, in Strng
```

## /file
**Special Notes: Please set content-type='multipart/form-data' to upload files**
#### Post new files to source
```
type: POST
url: /file/source/:course_id
url params: course_id
post body: file
return: JSON Object
    status: status of post, in Boolean
    if status == false:
        error: details of error, in String
    if status == true:
        file_name: name of file, in String
```

#### Post new submission to assignment
```
type: POST
url: /file/submission/:assignment_id
url params: assignment_id
post body: file
return: JSON Object
    status: status of post, in Boolean
    if status == false:
        error: details of error, in String
    if status == true:
        time: time of submission
        file_name: name of file
```

## /assignment

#### Post new submission to assignment
```
type: POST
url: /assignment/submission/:assignment_id
url params: assignment_id
post body: time file_name
return: JSON Object
    status: status of post, in Boolean
    if status == false:
        error: details of error, in String
```

#### Post new assignment
```
type: POST
url: /assignemnt/:course_id
url params: course_id
post body: title, content, deadline
return: JSON Object
    status: status of post, in Boolean
    if status == false:
        error: details of error, in String
```

#### Get assignemnts under a course
```
type: GET
url: /assignment/:course_id
url params: course_id
post body: title, content, deadline
return: JSON Object
    status: status of post, in Boolean
    if status == false:
        error: details of error, in String
    if status == true: 
        assignment: JSON Array
          Each Entry has:
            assignment_id: Numer
            title: String
            content: String
            deadline: String
            source: JSON Array
              Each Entry has:
                title: 
                file_name:
            submission: JSON Array
              Each Entry has:
                title:
                file_name:
```

## /dashboard

#### Get courses of a person
```
type: GET
url: /dashboard/
url params: None
get params: None
return: JSON Object 
    status: status of get, in Boolean
    if status == true:
        error: details of error, in String
    if status == false:
        name: String, user name
        course: JSON Array
          Each Entry has:
            title: String
            course_id: String
```
