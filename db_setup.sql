
-- TO DO TABLE

create table todo (
	todo_id INT not null unique,
	todo_name varchar(50) not null,
	todo_description varchar(200),
	created_at TIMESTAMPTZ,
	updated_at TIMESTAMPTZ
)

SHOW timezone;

create index index_todo_id on todo(todo_id);

CREATE OR REPLACE FUNCTION set_updated_at_timestamp() 
RETURNS TRIGGER AS $$ 
BEGIN 
--  RAISE NOTICE 'Trigger fired! Changing updated_at to %', clock_timestamp();
--  RAISE NOTICE 'Trigger fired! Changing updated_at to %', new;
  NEW.updated_at = clock_timestamp(); 
  RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;
CREATE TRIGGER trigger_updated_at 
BEFORE UPDATE ON todo
FOR EACH ROW 
EXECUTE FUNCTION set_updated_at_timestamp();

--DROP TRIGGER set_updated_at_timestamp ON public.todo;
--DROP FUNCTION public.trigger_set_timestamp_for_update();


CREATE OR REPLACE FUNCTION set_created_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.created_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trigger_created_at 
BEFORE INSERT ON todo
FOR EACH ROW 
EXECUTE FUNCTION set_created_at_timestamp();

--DROP TRIGGER trigger_created_at ON public.todo;

CREATE SEQUENCE todo_id_seq;
ALTER SEQUENCE todo_id_seq OWNED BY todo.todo_id;
ALTER TABLE todo ALTER COLUMN todo_id SET DEFAULT nextval('todo_id_seq');


-- users TABLE

-- Enable UUID extension if using UUIDs for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- or TEXT / BIGSERIAL
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Trigger function to automatically update updated_at on changes

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at_timestamp();

