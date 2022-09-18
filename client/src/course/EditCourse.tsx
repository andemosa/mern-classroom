import { ArrowUpward, Delete, FileUpload } from "@mui/icons-material";
import {
  Card,
  CardHeader,
  TextField,
  Button,
  CardMedia,
  Divider,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  IconButton,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { useState, useEffect, ChangeEvent } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import auth from "auth/auth-helper";
import { read, update } from "./api-course";

import { ILesson } from "types/Course";

interface IState {
  _id: string;
  name: string;
  description: string;
  image: unknown;
  category: string;
  instructor: {
    _id?: string;
    name?: string;
  };
  lessons: ILesson[];
  published?: boolean;
}

export default function EditCourse() {
  let params = useParams();

  const [course, setCourse] = useState<IState>({
    _id: "",
    name: "",
    description: "",
    image: "",
    category: "",
    instructor: {},
    lessons: [],
  });
  const [values, setValues] = useState({
    redirect: false,
    error: "",
  });
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ courseId: params.courseId! }, signal).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        data.image = "";
        setCourse(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [params.courseId]);

  const jwt = auth.isAuthenticated();

  const handleChange =
    (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const value =
        name === "image" ? event.target.files![0] : event.target.value;
      setCourse({ ...course, [name]: value });
    };

  const handleLessonChange =
    (name: keyof typeof course.lessons[0], index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const lessons = course.lessons;
      lessons[index][name] = event.target.value;
      setCourse({ ...course, lessons: lessons });
    };

  const deleteLesson = (index: number) => () => {
    const lessons = course.lessons;
    lessons.splice(index, 1);
    setCourse({ ...course, lessons: lessons });
  };

  const moveUp = (index: number) => () => {
    const lessons = course.lessons;
    const moveUp = lessons[index];
    lessons[index] = lessons[index - 1];
    lessons[index - 1] = moveUp;
    setCourse({ ...course, lessons: lessons });
  };

  const clickSubmit = () => {
    let courseData = new FormData();
    course.name && courseData.append("name", course.name);
    course.description && courseData.append("description", course.description);
    course.image && courseData.append("image", course.image as string);
    course.category && courseData.append("category", course.category);
    courseData.append("lessons", JSON.stringify(course.lessons));
    update(
      {
        courseId: params.courseId!,
      },
      {
        t: jwt.token,
      },
      courseData
    ).then((data) => {
      if (data && data.error) {
        console.log(data.error);
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, redirect: true });
      }
    });
  };

  if (values.redirect) {
    return <Navigate to={"/teach/course/" + course?._id} />;
  }

  const imageUrl = course?._id
    ? `${process.env.REACT_APP_BASE_URL}/api/courses/photo/${
        course?._id
      }?${new Date().getTime()}`
    : "/api/courses/defaultphoto";

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "auto",
        padding: 3,
        marginTop: 6,
      }}
    >
      <Card
        sx={{
          padding: "24px 40px 40px",
        }}
      >
        <CardHeader
          title={
            <TextField
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              value={course.name}
              onChange={handleChange("name")}
            />
          }
          subheader={
            <div>
              <Link
                to={"/user/" + course?.instructor?._id}
                style={{
                  display: "block",
                  margin: "3px 0px 5px 0px",
                  fontSize: "0.9em",
                }}
              >
                By {course?.instructor?.name}
              </Link>
              {
                <TextField
                  margin="dense"
                  label="Category"
                  type="text"
                  fullWidth
                  value={course.category}
                  onChange={handleChange("category")}
                />
              }
            </div>
          }
          action={
            auth.isAuthenticated().user &&
            auth.isAuthenticated().user._id === course?.instructor?._id && (
              <span
                style={{
                  margin: "8px 24px",
                  display: "inline-block",
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={clickSubmit}
                >
                  Save
                </Button>
              </span>
            )
          }
        />
        <div
          style={{
            display: "flex",
            marginBottom: 20,
          }}
        >
          <CardMedia
            sx={{
              height: 250,
              display: "inline-block",
              width: "50%",
              marginLeft: "16px",
            }}
            image={imageUrl}
            title={course.name}
          />
          <div
            style={{
              margin: "16px",
            }}
          >
            <TextField
              margin="dense"
              multiline
              rows="5"
              label="Description"
              type="text"
              sx={{
                width: 350,
              }}
              value={course.description}
              onChange={handleChange("description")}
            />
            <br />
            <br />
            <input
              accept="image/*"
              onChange={handleChange("image")}
              style={{
                display: "none",
              }}
              id="icon-button-file"
              type="file"
            />
            <label htmlFor="icon-button-file">
              <Button variant="outlined" color="secondary" component="span">
                Change Photo
                <FileUpload />
              </Button>
            </label>{" "}
            <span
              style={{
                marginLeft: "10px",
              }}
            >
              {/* {course.image ? course.image.name : ""} */}
            </span>
            <br />
          </div>
        </div>
        <Divider />
        <div>
          <CardHeader
            title={
              <Typography
                variant="h6"
                sx={{
                  margin: "10px",
                }}
              >
                Lessons - Edit and Rearrange
              </Typography>
            }
            subheader={
              <Typography
                variant="body1"
                sx={{
                  margin: "10px",
                }}
              >
                {course.lessons && course.lessons.length} lessons
              </Typography>
            }
          />
          <List>
            {course.lessons &&
              course.lessons.map((lesson, index) => {
                return (
                  <span key={index}>
                    <ListItem
                      sx={{
                        backgroundColor: "#f3f3f3",
                      }}
                    >
                      <ListItemAvatar>
                        <>
                          <Avatar>{index + 1}</Avatar>
                          {index !== 0 && (
                            <IconButton
                              aria-label="up"
                              color="primary"
                              onClick={moveUp(index)}
                              sx={{
                                border: "2px solid #f57c00",
                                marginLeft: 3,
                                marginTop: 10,
                                padding: 4,
                              }}
                            >
                              <ArrowUpward />
                            </IconButton>
                          )}
                        </>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <>
                            <TextField
                              margin="dense"
                              label="Title"
                              type="text"
                              fullWidth
                              value={lesson.title}
                              onChange={handleLessonChange("title", index)}
                            />
                            <br />
                            <TextField
                              margin="dense"
                              multiline
                              rows="5"
                              label="Content"
                              type="text"
                              fullWidth
                              value={lesson.content}
                              onChange={handleLessonChange("content", index)}
                            />
                            <br />
                            <TextField
                              margin="dense"
                              label="Resource link"
                              type="text"
                              fullWidth
                              value={lesson.resource_url}
                              onChange={handleLessonChange(
                                "resource_url",
                                index
                              )}
                            />
                            <br />
                          </>
                        }
                      />
                      {!course.published && (
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="up"
                            color="primary"
                            onClick={deleteLesson(index)}
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                    <Divider
                      style={{ backgroundColor: "rgb(106, 106, 106)" }}
                      component="li"
                    />
                  </span>
                );
              })}
          </List>
        </div>
      </Card>
    </div>
  );
}
