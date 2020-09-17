# lbn-fs1-backend

```sql
CREATE TABLE IF NOT EXISTS fs1_user (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  nickname VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM("NORMAL","ADMIN") NOT NULL DEFAULT "NORMAL"
);
```

```sql
CREATE TABLE IF NOT EXISTS fs1_user_relation (
	user_id VARCHAR(255) NOT NULL,
    follow_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id, follow_id),
    FOREIGN KEY (user_id) REFERENCES fs1_user(id) ON DELETE CASCADE,
    FOREIGN KEY (follow_id) REFERENCES fs1_user(id) ON DELETE CASCADE
);
```

```sql
CREATE TABLE IF NOT EXISTS fs1_collection (
	id VARCHAR(255) PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES fs1_user(id)
);
```

```sql
CREATE TABLE IF NOT EXISTS fs1_post(
	id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    media_url VARCHAR(255) NOT NULL,
	caption TEXT,
    created_at DATETIME NOT NULL DEFAULT current_timestamp,
    collection_id VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES fs1_user(id) ON DELETE CASCADE,
    FOREIGN KEY (collection_id) REFERENCES fs1_collection(id)
);
```

```sql
CREATE TABLE IF NOT EXISTS fs1_tag (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	tag VARCHAR(255) NOT NULL UNIQUE
);
```

```sql
CREATE TABLE IF NOT EXISTS fs1_post_tag (
	post_id VARCHAR(255),
    tag_id INT UNSIGNED,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES fs1_post(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES fs1_tag(id) ON DELETE CASCADE
);
```

```sql
CREATE TABLE IF NOT EXISTS fs1_post_collection (
	post_id VARCHAR(255),
    collection_id VARCHAR(255),
    PRIMARY KEY (post_id,collection_id)
);
```
