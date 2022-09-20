import { Info, CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ListSubheader,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction,
  Card,
  CardHeader,
  Button,
  CardMedia,
  Typography,
  CardContent,
  CardActions,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import auth from "auth/auth-helper";
import { IEnrollment } from "types/Enrollment";


export default function Enrollment() {
  let params = useParams();

  const [enrollment, setEnrollment] = useState<Partial<IEnrollment>>({
    course: { instructor: { _id: "", name: "" } },
    lessonStatus: [],
  });
  const [values, setValues] = useState({
    error: "",
    drawer: -1,
  });
  const [totalComplete, setTotalComplete] = useState(0);
  const jwt = auth.isAuthenticated();
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ enrollmentId: params.enrollmentId! }, { t: jwt.token }, signal).then(
      (data: any) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          totalCompleted(data.lessonStatus);
          setEnrollment(data);
        }
      }
    );
    return function cleanup() {
      abortController.abort();
    };
  }, [params.enrollmentId]);

  const totalCompleted = (lessons: IEnrollment["lessonStatus"]) => {
    let count = lessons.reduce((total, lessonStatus) => {
      return total + (lessonStatus.complete ? 1 : 0);
    }, 0);
    setTotalComplete(count);
    return count;
  };

  const selectDrawer = (index: number) => () => {
    setValues({ ...values, drawer: index });
  };

  const markComplete = () => {
    if (!enrollment?.lessonStatus![values.drawer].complete) {
      const lessonStatus = enrollment?.lessonStatus;
      lessonStatus![values.drawer].complete = true;
      let count = totalCompleted(lessonStatus!);

      let updatedData: {
        lessonStatusId?: string;
        complete?: boolean;
        courseCompleted?: any;
      } = {};
      updatedData.lessonStatusId = lessonStatus![values.drawer]?.lesson?._id;
      updatedData.complete = true;

      if (count === lessonStatus?.length) {
        updatedData.courseCompleted = Date.now();
      }

      complete(
        {
          enrollmentId: params.enrollmentId!,
        },
        {
          t: jwt.token,
        },
        updatedData
      ).then((data: any) => {
        if (data && data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setEnrollment({ ...enrollment, lessonStatus: lessonStatus });
        }
      });
    }
  };

  const imageUrl = enrollment?.course?._id
    ? `${process.env.REACT_APP_BASE_URL}/api/courses/photo/${
        enrollment?.course?._id
      }?${new Date().getTime()}`
    : "/api/courses/defaultphoto";

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "auto",
        marginTop: 6,
        marginLeft: 250,
      }}
    >
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
        }}
        variant="permanent"
      >
        <div />
        <List>
          <ListItem
            button
            onClick={selectDrawer(-1)}
            sx={
              values.drawer === -1
                ? {
                    backgroundColor: "#e9e3df",
                  }
                : {
                    backgroundColor: "#ffffff",
                  }
            }
          >
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <ListItemText primary={"Course Overview"} />
          </ListItem>
        </List>
        <Divider />
        <List
          sx={{
            backgroundColor: "#ffffff",
          }}
        >
          <ListSubheader
            component="div"
            sx={{
              fontSize: "1.2em",
            }}
          >
            Lessons
          </ListSubheader>
          {enrollment?.lessonStatus?.map((lesson, index) => (
            <ListItem
              button
              key={index}
              onClick={selectDrawer(index)}
              sx={
                values.drawer === -1
                  ? {
                      backgroundColor: "#e9e3df",
                    }
                  : {
                      backgroundColor: "#ffffff",
                    }
              }
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    color: "#9b9b9b",
                    border: "1px solid #bdbdbd",
                    background: "none",
                  }}
                >
                  {index + 1}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={enrollment?.course?.lessons![index]?.title}
              />
              <ListItemSecondaryAction>
                {lesson.complete ? (
                  <CheckCircle
                    sx={{
                      color: "#38cc38",
                    }}
                  />
                ) : (
                  <RadioButtonUnchecked />
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem>
            <ListItemText
              primary={
                <div
                  style={{
                    textAlign: "center",
                    color: "#dfdfdf",
                  }}
                >
                  <span>{totalComplete}</span> out of{" "}
                  <span>{enrollment?.lessonStatus?.length}</span> completed
                </div>
              }
            />
          </ListItem>
        </List>
      </Drawer>
      {values.drawer === -1 && (
        <Card
          sx={{
            padding: "24px 40px 20px",
          }}
        >
          <CardHeader
            title={enrollment?.course?.name}
            subheader={
              <div>
                <Link
                  to={"/user/" + enrollment?.course?.instructor?._id}
                  style={{
                    display: "block",
                    margin: "3px 0px 5px 0px",
                    fontSize: "0.9em",
                  }}
                >
                  By {enrollment?.course?.instructor?.name}
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
                  {enrollment?.course?.category}
                </span>
              </div>
            }
            action={
              totalComplete === enrollment?.lessonStatus?.length && (
                <span
                  style={{
                    margin: "8px 24px",
                    display: "inline-block",
                  }}
                >
                  <Button variant="contained" color="secondary">
                    <CheckCircle /> &nbsp; Completed
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
                height: 180,
                display: "inline-block",
                width: "100%",
                marginLeft: "16px",
              }}
              image={imageUrl}
              title={enrollment?.course?.name}
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
                {enrollment?.course?.description}
                <br />
              </Typography>
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
                  {enrollment?.course?.lessons &&
                    enrollment?.course?.lessons.length}{" "}
                  lessons
                </Typography>
              }
              action={
                auth.isAuthenticated().user &&
                auth.isAuthenticated().user._id ===
                  enrollment?.course?.instructor?._id && (
                  <span
                    style={{
                      margin: "8px 24px",
                      display: "inline-block",
                    }}
                  ></span>
                )
              }
            />
            <List>
              {enrollment?.course?.lessons &&
                enrollment?.course?.lessons.map((lesson, i) => {
                  return (
                    <span key={i}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>{i + 1}</Avatar>
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
      )}
      {values.drawer !== -1 && (
        <>
          <Typography
            variant="h5"
            sx={{
              marginBottom: 3,
              fontWeight: 200,
            }}
          >
            {enrollment?.course?.name}
          </Typography>
          <Card
            sx={{
              padding: "24px 40px 20px",
            }}
          >
            <CardHeader
              title={enrollment?.course?.lessons![values.drawer]?.title}
              action={
                <Button
                  onClick={markComplete}
                  variant={
                    enrollment?.lessonStatus![values.drawer]?.complete
                      ? "contained"
                      : "outlined"
                  }
                  color="secondary"
                >
                  {enrollment?.lessonStatus![values.drawer]?.complete
                    ? "Completed"
                    : "Mark as complete"}
                </Button>
              }
            />
            <CardContent>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-wrap",
                }}
              >
                {enrollment?.course?.lessons![values.drawer]?.content}
              </Typography>
            </CardContent>
            <CardActions>
              <a
                href={enrollment?.course?.lessons![values.drawer].resource_url}
              >
                <Button variant="contained" color="primary">
                  Resource Link
                </Button>
              </a>
            </CardActions>
          </Card>
        </>
      )}
    </div>
  );
}
