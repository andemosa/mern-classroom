import { ChangeEvent, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FileUpload } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Icon,
  CardActions,
} from "@mui/material";

import { create } from "./api-course";
import auth from "auth/auth-helper";

interface IState {
  name: string;
  description: string;
  image: unknown;
  category: string;
  redirect: boolean;
  error: string;
}

export default function NewCourse() {
  const [values, setValues] = useState<IState>({
    name: "",
    description: "",
    image: "",
    category: "",
    redirect: false,
    error: "",
  });
  const jwt = auth.isAuthenticated();

  const handleChange =
    (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const value =
        name === "image" ? event.target.files![0] : event.target.value;
      setValues({ ...values, [name]: value });
    };

  const clickSubmit = () => {
    let courseData = new FormData();
    values.name && courseData.append("name", values.name);
    values.description && courseData.append("description", values.description);
    values.image && courseData.append("image", values.image as Blob);
    values.category && courseData.append("category", values.category);
    create(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      courseData
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, error: "", redirect: true });
      }
    });
  };

  if (values.redirect) {
    return <Navigate to={"/teach/courses"} />;
  }

  return (
    <div>
      <Card
        sx={{
          maxWidth: 600,
          margin: "auto",
          textAlign: "center",
          marginTop: 12,
          paddingBottom: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              marginTop: 2,
            }}
          >
            New Course
          </Typography>
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
            <Button variant="contained" color="secondary" component="span">
              Upload Photo
              <FileUpload />
            </Button>
          </label>{" "}
          <span
            style={{
              marginLeft: "10px",
            }}
          >
            {values.image ? (values.image as File).name : ""}
          </span>
          <br />
          <TextField
            id="name"
            label="Name"
            sx={{
              marginLeft: 1,
              marginRight: 1,
              width: 300,
            }}
            value={values.name}
            onChange={handleChange("name")}
            margin="normal"
          />
          <br />
          <TextField
            id="multiline-flexible"
            label="Description"
            multiline
            rows="2"
            value={values.description}
            onChange={handleChange("description")}
            sx={{
              marginLeft: 1,
              marginRight: 1,
              width: 300,
            }}
            margin="normal"
          />
          <br />
          <TextField
            id="category"
            label="Category"
            sx={{
              marginLeft: 1,
              marginRight: 1,
              width: 300,
            }}
            value={values.category}
            onChange={handleChange("category")}
            margin="normal"
          />
          <br />
          {values.error && (
            <Typography component="p" color="error">
              <Icon
                color="error"
                sx={{
                  verticalAlign: "middle",
                }}
              >
                error
              </Icon>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={clickSubmit}
            sx={{
              margin: "auto",
              marginBottom: 2,
            }}
          >
            Submit
          </Button>
          <Link
            to="/teach/courses"
            style={{
              margin: "auto",
              marginBottom: 2,
            }}
          >
            <Button variant="contained">Cancel</Button>
          </Link>
        </CardActions>
      </Card>
    </div>
  );
}
