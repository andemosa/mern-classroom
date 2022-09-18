import { Add } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { ChangeEvent, useState } from "react";

import auth from "auth/auth-helper";
import { newLesson } from "./api-course";

import { ICourse } from "types/Course";

interface IProps {
  courseId: string;
  addLesson: (course: Partial<ICourse>) => void;
}

export default function NewLesson(props: IProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    title: "",
    content: "",
    resource_url: "",
    error: "",
  });

  const handleChange =
    (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [name]: event.target.value });
    };
  const clickSubmit = () => {
    const jwt = auth.isAuthenticated();
    const lesson = {
      title: values.title || undefined,
      content: values.content || undefined,
      resource_url: values.resource_url || undefined,
    };
    newLesson(
      {
        courseId: props.courseId,
      },
      {
        t: jwt.token,
      },
      lesson
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        props.addLesson(data);
        setValues({ ...values, title: "", content: "", resource_url: "" });
        setOpen(false);
      }
    });
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        aria-label="Add Lesson"
        color="primary"
        variant="contained"
        onClick={handleClickOpen}
      >
        <Add /> &nbsp; New Lesson
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <div
          style={{
            minWidth: 500,
          }}
        >
          <DialogTitle id="form-dialog-title">Add New Lesson</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              value={values.title}
              onChange={handleChange("title")}
            />
            <br />
            <TextField
              margin="dense"
              label="Content"
              type="text"
              multiline
              rows="5"
              fullWidth
              value={values.content}
              onChange={handleChange("content")}
            />
            <br />
            <TextField
              margin="dense"
              label="Resource link"
              type="text"
              fullWidth
              value={values.resource_url}
              onChange={handleChange("resource_url")}
            />
            <br />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="primary" variant="contained">
              Cancel
            </Button>
            <Button onClick={clickSubmit} color="secondary" variant="contained">
              Add
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
}
