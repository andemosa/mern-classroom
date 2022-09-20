import { ICourse, ILesson } from "./Course";
import { IProfile } from "./User";

export interface IEnrollment {
  _id: string;
  course: Partial<ICourse>;
  student: Partial<IProfile>;
  lessonStatus: {
    lesson: Partial<ILesson>;
    complete: boolean;
  }[];
  completed: string;
  createdAt: string;
  updatedAt: string;
}
