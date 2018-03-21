
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(64) UNIQUE NOT NULL,
  passwd VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  imgName TEXT
);

CREATE TABLE categories (
    categorieID SERIAL PRIMARY KEY,
    category VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE books (
    bookId SERIAL PRIMARY KEY,
    title VARCHAR(255) UNIQUE NOT NULL,
    ISBN13 VARCHAR(13) UNIQUE NOT NULL,
    author VARCHAR(64),
    description TEXT,
    category VARCHAR(255) ,
    FOREIGN KEY (category) REFERENCES categories (category)
);

CREATE TABLE readBooks (
    id SERIAL PRIMARY KEY,
    userID INT NOT NULL,
    bookID INT NOT NULL,
    rating INT NOT NULL,
    review TEXT,
    FOREIGN KEY (userID) REFERENCES users (id),
    FOREIGN KEY (bookID) REFERENCES books (id)
);
