import { Schema, model, Types } from "mongoose";

interface ILesson {
  title: string;
  content: string;
  resource_url: string;
}

const lessonSchema = new Schema<ILesson>(
  {
    title: String,
    content: String,
    resource_url: String,
  },
  {
    timestamps: true,
  }
);

const Lesson = model<ILesson>("Lesson", lessonSchema);

interface ICourse {
  name: string;
  image: {
    data: any;
    contentType: string;
  };
  description: string;
  category: string;
  published: boolean;
  lessons: Types.DocumentArray<ILesson>;
  instructor: Types.ObjectId;
}

const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    instructor: { type: Schema.Types.ObjectId, ref: "User" },
    published: {
      type: Boolean,
      default: false,
    },
    lessons: [lessonSchema],
  },
  {
    timestamps: true,
  }
);

const Course = model<ICourse>("Course", courseSchema);

export { Course, Lesson, ICourse, ILesson };
