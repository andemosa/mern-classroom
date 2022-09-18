export interface ILesson {
  _id: string;
  title: string;
  content: string;
  resource_url: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICourse {
  _id: string;
  name: string;
  image: {
    contentType: string;
    data: {
      type: string;
      data: number[];
    };
  };
  description: string;
  category: string;
  published: boolean;
  instructor: {
    _id: string;
    name: string;
  };
  lessons: ILesson[];
  createdAt: string;
  updatedAt: string;
}
