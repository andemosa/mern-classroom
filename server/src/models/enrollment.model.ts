import { Schema, model, Types } from "mongoose";

interface IEnrollment {
  course: Types.ObjectId;
  student: Types.ObjectId;
  lessonStatus: {
    lesson: Types.ObjectId;
    complete: boolean;
  }[];
  completed: Date;
}

const enrollmentSchema = new Schema<IEnrollment>({
  course: { type: Schema.Types.ObjectId, ref: "Course" },
  student: { type: Schema.Types.ObjectId, ref: "User" },
  lessonStatus: [
    {
      lesson: { type: Schema.Types.ObjectId, ref: "Lesson" },
      complete: Boolean,
    },
  ],
  completed: Date,
});

const Enrollment = model<IEnrollment>("Enrollment", enrollmentSchema);

export { Enrollment, IEnrollment };
