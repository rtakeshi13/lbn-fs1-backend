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
