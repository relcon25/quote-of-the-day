CREATE TABLE quotes
(
    id       SERIAL PRIMARY KEY,
    favqs_id  VARCHAR UNIQUE NOT NULL,
    author   TEXT NOT NULL,
    content  TEXT NOT NULL
);

CREATE TABLE tags
(
    id   SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE quote_tags
(
    quote_id INT REFERENCES quotes (id) ON DELETE CASCADE,
    tag_id   INT REFERENCES tags (id) ON DELETE CASCADE,
    PRIMARY KEY (quote_id, tag_id)
);

CREATE INDEX idx_quote_tags_quote ON quote_tags (quote_id);
CREATE INDEX idx_quote_tags_tag ON quote_tags (tag_id);