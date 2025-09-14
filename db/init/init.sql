-- Active: 1755538239941@@127.0.0.1@5432@example
CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    hashed_email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "email_verification" (
    token VARCHAR(6) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES "user"(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    verified_at TIMESTAMP
);

CREATE TABLE "counter" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    active BOOLEAN NOT NULL DEFAULT true,
    value INT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP,
    user_id UUID NOT NULL REFERENCES "user"(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
