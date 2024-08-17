USE delta_app;
CREATE TABLE user  (
    id VARCHAR(100) PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(130) NOT NULL
);