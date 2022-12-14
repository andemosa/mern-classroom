import { Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "auth/PrivateRoute";

import Home from "core/Home";
import Menu from "core/Menu";

import Users from "user/Users";
import Signup from "user/Signup";
import Signin from "auth/Signin";
import Profile from "user/Profile";
import EditProfile from "user/EditProfile";
import NewCourse from "course/NewCourse";
import MyCourses from "course/MyCourse";
import Course from "course/Course";
import EditCourse from "course/EditCourse";

const MainRouter = () => {
  return (
    <div>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        <Route
          path="/user/edit/:userId"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/user/:userId" element={<Profile />} />

        <Route path="/teach/course/:courseId" element={<Course />} />
        <Route
          path="/teach/course/edit/:courseId"
          element={
            <ProtectedRoute>
              <EditCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teach/course/new"
          element={
            <ProtectedRoute>
              <NewCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teach/courses"
          element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </div>
  );
};

export default MainRouter;
