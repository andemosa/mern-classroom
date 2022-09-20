import { Button } from "@mui/material";
import { useState } from "react";
import { Navigate } from "react-router-dom";

import auth from "auth/auth-helper";

interface IProps {
  courseId: string;
}

export default function Enroll(props: IProps) {
  const [values, setValues] = useState({
    enrollmentId: "",
    error: "",
    redirect: false,
  });
  const jwt = auth.isAuthenticated();
  const clickEnroll = () => {
    create(
      {
        courseId: props.courseId!,
      },
      {
        t: jwt.token,
      }
    ).then((data: any) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, enrollmentId: data._id, redirect: true });
      }
    });
  };

  if (values.redirect) {
    return <Navigate to={"/learn/" + values.enrollmentId} />;
  }

  return (
    <Button variant="contained" color="secondary" onClick={clickEnroll}>
      {" "}
      Enroll{" "}
    </Button>
  );
}
