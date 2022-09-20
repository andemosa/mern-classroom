import { Card, Typography } from "@mui/material";
import { useState, useEffect } from "react";

import auth from "auth/auth-helper";
import { listPublished } from "course/api-course";
import Courses from "course/Courses";

export default function Home() {
  const jwt = auth.isAuthenticated();
  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  // useEffect(() => {
  //   const abortController = new AbortController();
  //   const signal = abortController.signal;
  //   listEnrolled({ t: jwt.token }, signal).then((data:any) => {
  //     if (data.error) {
  //       console.log(data.error);
  //     } else {
  //       setEnrolled(data);
  //     }
  //   });
  //   return function cleanup() {
  //     abortController.abort();
  //   };
  // }, []);
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    listPublished(signal).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCourses(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);
  return (
    <div
      style={{
        marginTop: 12,
      }}
    >
      {auth.isAuthenticated().user && (
        <Card
          sx={{
            width: "90%",
            margin: "auto",
            marginTop: 20,
            marginBottom: 2,
            padding: 20,
            backgroundColor: "#616161",
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              color: "#efefef",
              marginBottom: 5,
            }}
          >
            Courses you are enrolled in
          </Typography>
          {enrolled.length != 0 ? // <Enrollments enrollments={enrolled} />
          null : (
            <Typography
              variant="body1"
              sx={{
                color: "lightgrey",
                marginBottom: 12,
                marginLeft: 8,
              }}
            >
              No courses.
            </Typography>
          )}
        </Card>
      )}
      <Card
        sx={{
          width: "90%",
          margin: "auto",
          marginTop: 20,
          marginBottom: 2,
          padding: 20,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h5" component="h2">
          All Courses
        </Typography>
        {courses.length !== 0 && courses.length !== enrolled.length ? (
          <Courses
            courses={courses}
            // common={enrolled}
          />
        ) : (
          <Typography
            variant="body1"
            sx={{
              color: "lightgrey",
              marginBottom: 12,
              marginLeft: 8,
            }}
          >
            No new courses.
          </Typography>
        )}
      </Card>
    </div>
  );
}
