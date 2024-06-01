CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP
);
INSERT INTO posts (title, content, created_at) VALUES
    ('Título do Post 1', 'Conteúdo do Post 1', NOW()),
    ('Título do Post 2', 'Conteúdo do Post 2', NOW()),
    ('Título do Post 3', 'Conteúdo do Post 3', NOW()),
    ('Título do Post 4', 'Conteúdo do Post 4', NOW()),
    ('Título do Post 5', 'Conteúdo do Post 5', NOW());


SELECT * FROM posts;

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  post_id INT NOT NULL,
  CONSTRAINT fk_post
    FOREIGN KEY(post_id) 
    REFERENCES posts(id)
);

INSERT INTO comments (content, created_at, post_id) VALUES
('Great post!', NOW(), 1),
('Thanks for the information.', NOW(), 2),
('Very helpful, thank you!', NOW(), 1),
('I have a question about this topic.', NOW(), 3),
('Awesome write-up!', NOW(), 2),
('Could you provide more details on this?', NOW(), 3),
('This was exactly what I was looking for.', NOW(), 1),
('Really enjoyed this post, thanks!', NOW(), 2),
('Found this very insightful.', NOW(), 3),
('Looking forward to more posts like this!', NOW(), 1)