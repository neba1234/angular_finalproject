export type User = {
  _id: string;
  fullname: string;
  email: string;
  password: string;
};

export type Image = { _id: string; filename: string; originalname: string };

export type Review = {
  _id: string;
  review: string;
  rating: number;
  by?: { user_id: string; fullname: string };
  date: string;
};

export type Owner = { user_id: string; fullname: string; email: string };

export type Medication = {
  _id: string;
  name: string;
  first_letter: string;
  generic_name: string;
  medication_class: string;
  availability: string;
  image?: Image;
  added_by?: { user_id: string; fullname: string; email: string };
  reviews?: Review[];
};
