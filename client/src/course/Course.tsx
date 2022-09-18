import { Edit, Group, VerifiedUser } from "@mui/icons-material";
import {
  Card,
  CardHeader,
  IconButton,
  Button,
  CardMedia,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import auth from "auth/auth-helper";
import { read, update } from "./api-course";
import { ICourse } from "types/Course";
import NewLesson from "./NewLesson";

export default function Course() {
  let params = useParams();

  const [stats, setStats] = useState({});
  const [course, setCourse] = useState<Partial<ICourse>>({});
  const [values, setValues] = useState({
    redirect: false,
    error: "",
  });
  const [open, setOpen] = useState(false);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ courseId: params.courseId! }, signal).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCourse(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [params.courseId]);

  //   useEffect(() => {
  //     const abortController = new AbortController();
  //     const signal = abortController.signal;

  //     enrollmentStats(
  //       { courseId: params.courseId! },
  //       { t: jwt.token },
  //       signal
  //     ).then((data: any) => {
  //       if (data.error) {
  //         setValues({ ...values, error: data.error });
  //       } else {
  //         setStats(data);
  //       }
  //     });
  //     return function cleanup() {
  //       abortController.abort();
  //     };
  //   }, [params.courseId]);

  const removeCourse = () => {
    setValues({ ...values, redirect: true });
  };

  const addLesson = (course: Partial<ICourse>) => {
    setCourse(course);
  };

  const clickPublish = () => {
    if (course?.lessons!.length > 0) {
      setOpen(true);
    }
  };

  const publish = () => {
    let courseData = new FormData();
    courseData.append("published", "true");
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
        setValues({ ...values, error: data.error });
      } else {
        setCourse({ ...course, published: true });
        setOpen(false);
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (values.redirect) {
    return <Navigate to={"/teach/courses"} />;
  }

  const imageUrl = course._id
    ? `${process.env.REACT_APP_BASE_URL}/api/courses/photo/${
        course._id
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
          title={course.name}
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
              <span
                style={{
                  color: "#5c5c5c",
                  fontSize: "0.9em",
                  padding: "3px 5px",
                  backgroundColor: "#dbdbdb",
                  borderRadius: "0.2em",
                  marginTop: 5,
                }}
              >
                {course.category}
              </span>
            </div>
          }
          action={
            <>
              {auth.isAuthenticated().user &&
                auth.isAuthenticated().user._id === course?.instructor?._id && (
                  <span
                    style={{
                      margin: "10px 0px",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Link to={"/teach/course/edit/" + course._id}>
                      <IconButton aria-label="Edit" color="secondary">
                        <Edit />
                      </IconButton>
                    </Link>
                    {!course.published ? (
                      <>
                        <Button
                          color="secondary"
                          variant="outlined"
                          onClick={clickPublish}
                        >
                          {course?.lessons?.length == 0
                            ? "Add atleast 1 lesson to publish"
                            : "Publish"}
                        </Button>
                        {/* <DeleteCourse course={course} onRemove={removeCourse} /> */}
                      </>
                    ) : (
                      <Button color="primary" variant="outlined">
                        Published
                      </Button>
                    )}
                  </span>
                )}
              {/* {course.published && (
                <div>
                  <span
                    style={{
                      margin: "7px 10px 0 10px",
                      alignItems: "center",
                      color: "#616161",
                      display: "inline-flex",
                    }}
                  >
                    <Group
                      sx={{
                        marginRight: 10,
                        color: "#b6ab9a",
                      }}
                    />{" "}
                    {stats.totalEnrolled} enrolled{" "}
                  </span>
                  <span
                    style={{
                      margin: "7px 10px 0 10px",
                      alignItems: "center",
                      color: "#616161",
                      display: "inline-flex",
                    }}
                  >
                    <VerifiedUser
                      sx={{
                        marginRight: 10,
                        color: "#b6ab9a",
                      }}
                    />{" "}
                    {stats.totalCompleted} completed{" "}
                  </span>
                </div>
              )} */}
            </>
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
              height: 190,
              display: "inline-block",
              width: "100%",
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
            <Typography
              variant="body1"
              sx={{
                margin: "10px",
              }}
            >
              {course.description}
              <br />
            </Typography>

            {course.published && (
              <div
                style={{
                  float: "right",
                }}
              >
                {/* <Enroll courseId={course._id} /> */}
              </div>
            )}
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
                Lessons
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
            action={
              auth.isAuthenticated().user &&
              auth.isAuthenticated().user._id === course?.instructor?._id &&
              !course.published && (
                <span
                  style={{
                    margin: "10px 0px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <NewLesson courseId={course._id!} addLesson={addLesson} />
                </span>
              )
            }
          />
          <List>
            {course.lessons &&
              course.lessons.map((lesson, index) => {
                return (
                  <span key={index}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>{index + 1}</Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={lesson.title} />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </span>
                );
              })}
          </List>
        </div>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Publish Course</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Publishing your course will make it live to students for enrollment.{" "}
          </Typography>
          <Typography variant="body1">
            Make sure all lessons are added and ready for publishing.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Cancel
          </Button>
          <Button onClick={publish} color="secondary" variant="contained">
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
