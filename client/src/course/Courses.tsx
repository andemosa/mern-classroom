
import { ImageList, ImageListItem, ImageListItemBar } from "@mui/material";

import auth from "auth/auth-helper";
import { Link } from "react-router-dom";

interface IProps {
  courses: any[];
}

export default function Courses(props: IProps) {
  const findCommon = (course: { _id: any; }) => {
    return !props.common.find((enrolled) => {
      return enrolled.course._id == course._id;
    });
  };

  return (
    <ImageList
      rowHeight={220}
      sx={{
        width: "100%",
        minHeight: 200,
        padding: "16px 0 0px",
      }}
      cols={2}
    >
      {props.courses.map((course, i) => {
        return (
          findCommon(course) && (
            <ImageListItem
              sx={{
                textAlign: "center",
                border: "1px solid #cecece",
                backgroundColor: "#04040c",
              }}
              key={i}
              style={{ padding: 0 }}
            >
              <Link to={"/course/" + course._id}>
                <img
                  style={{
                    height: "100%",
                  }}
                  src={"/api/courses/photo/" + course._id}
                  alt={course.name}
                />
              </Link>
              <ImageListItemBar
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.85)",
                  textAlign: "left",
                }}
                title={
                  <Link
                    to={"/course/" + course._id}
                    style={{
                      fontSize: "1.1em",
                      marginBottom: "5px",
                      color: "#fffde7",
                      display: "block",
                    }}
                  >
                    {course.name}
                  </Link>
                }
                subtitle={<span>{course.category}</span>}
                actionIcon={
                  <div
                    style={{
                      margin: "0 10px",
                    }}
                  >
                    {auth.isAuthenticated() ? (
                      <Enroll courseId={course._id} />
                    ) : (
                      <Link to="/signin">Sign in to Enroll</Link>
                    )}
                  </div>
                }
              />
            </ImageListItem>
          )
        );
      })}
    </ImageList>
  );
}

