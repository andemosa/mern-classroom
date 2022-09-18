import {
  Paper,
  Typography,
  Button,
  Icon,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";

import auth from "auth/auth-helper";
import { listByInstructor } from "./api-course";

import { ICourse } from "types/Course";

export default function MyCourses() {
  const [courses, setCourses] = useState<Partial<ICourse>[]>([]);
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    listByInstructor(
      {
        userId: jwt.user._id,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data?.error) {
        setRedirectToSignin(true);
      } else {
        setCourses(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  if (redirectToSignin) {
    return <Navigate to="/signin" />;
  }
  return (
    <div>
      <Paper
        sx={{
          maxWidth: 600,
          margin: "auto",
          padding: 3,
          marginTop: 12,
        }}
        elevation={4}
      >
        <Typography
          component="h2"
          sx={{
            margin: `3px 1px`,
            fontSize: "1.2em",
          }}
        >
          Your Courses
          <span
            style={{
              float: "right",
            }}
          >
            <Link to="/teach/course/new">
              <Button color="primary" variant="contained">
                <Icon
                  sx={{
                    marginRight: "8px",
                  }}
                >
                  add_box
                </Icon>{" "}
                New Course
              </Button>
            </Link>
          </span>
        </Typography>
        <List dense>
          {courses?.map((course, i) => {
            return (
              <Link to={"/teach/course/" + course._id} key={i}>
                <ListItem button>
                  <ListItemAvatar>
                    <Avatar
                      src={
                        "/api/courses/photo/" +
                        course._id +
                        "?" +
                        new Date().getTime()
                      }
                      sx={{
                        borderRadius: 0,
                        width: 65,
                        height: 40,
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={course.name}
                    secondary={course.description}
                    sx={{
                      marginLeft: 16,
                    }}
                  />
                </ListItem>
                <Divider />
              </Link>
            );
          })}
        </List>
      </Paper>
    </div>
  );
}
