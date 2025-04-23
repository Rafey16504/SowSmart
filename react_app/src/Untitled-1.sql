CREATE TABLE IF NOT EXISTS farmers_info (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  gender TEXT NOT NULL,
  dob DATE NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);



