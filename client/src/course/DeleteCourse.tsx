import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";

import auth from "auth/auth-helper";
import { remove } from "./api-course";
import { ICourse } from "types/Course";
import { Delete } from "@mui/icons-material";

interface IProps {
  course: Partial<ICourse>;
  onRemove: (course: Partial<ICourse>) => void;
}

export default function DeleteCourse(props: IProps) {
  const [open, setOpen] = useState(false);

  const jwt = auth.isAuthenticated();
  const clickButton = () => {
    setOpen(true);
  };
  const deleteCourse = () => {
    remove(
      {
        courseId: props.course._id!,
      },
      { t: jwt.token }
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setOpen(false);
        props.onRemove(props.course);
      }
    });
  };
  const handleRequestClose = () => {
    setOpen(false);
  };
  return (
    <span>
      <IconButton aria-label="Delete" onClick={clickButton} color="secondary">
        <Delete />
      </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{"Delete " + props.course.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete your course {props.course.name}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteCourse} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
}
