const create = async (
  params: { userId: string },
  credentials: { t: string },
  course: any
) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/courses/by/` + params.userId,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + credentials.t,
        },
        body: course,
      }
    );
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

const list = async (signal: any) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/courses`,
      {
        method: "GET",
        signal: signal,
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const read = async (params: { courseId: string }, signal: any) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/courses/` + params.courseId,
      {
        method: "GET",
        signal: signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const update = async (
  params: { courseId: string },
  credentials: { t: string },
  course: any
) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/courses/` + params.courseId,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + credentials.t,
        },
        body: course,
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const remove = async (
  params: { courseId: string },
  credentials: { t: string }
) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/courses/` + params.courseId,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const listByInstructor = async (
  params: { userId: string },
  credentials: { t: string },
  signal: any
) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/courses/by/` + params.userId,
      {
        method: "GET",
        signal: signal,
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

const newLesson = async (
  params: { courseId: string },
  credentials: { t: string },
  lesson: any
) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/courses/` +
        params.courseId +
        "/lesson/new",
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
        body: JSON.stringify({ lesson: lesson }),
      }
    );
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

const listPublished = async (signal: any) => {
  try {
    let response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/courses/published`,
      {
        method: "GET",
        signal: signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
export {
  create,
  list,
  read,
  update,
  remove,
  listByInstructor,
  newLesson,
  listPublished,
};
