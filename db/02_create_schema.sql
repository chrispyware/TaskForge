-- Run this as TASKFORGE on freepdb1
-- Creates all sequences, tables, and indexes for the TaskForge schema

-- Sequences
CREATE SEQUENCE seq_users    START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_projects START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_tasks    START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_comments START WITH 1 INCREMENT BY 1;

-- Users Table
CREATE TABLE users (
    id           NUMBER DEFAULT seq_users.NEXTVAL PRIMARY KEY,
    email        VARCHAR2(255) NOT NULL,
    password     VARCHAR2(255) NOT NULL,
    display_name VARCHAR2(100) NOT NULL,
    role         VARCHAR2(20)  DEFAULT 'USER' NOT NULL,
    created_at   TIMESTAMP     DEFAULT SYSTIMESTAMP,
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT chk_users_role CHECK (role IN ('USER', 'ADMIN'))
);

-- Projects Table
CREATE TABLE projects (
    id          NUMBER DEFAULT seq_projects.NEXTVAL PRIMARY KEY,
    name        VARCHAR2(200) NOT NULL,
    description CLOB,
    owner_id    NUMBER NOT NULL,
    created_at  TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT fk_projects_owner FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- Tasks Table
CREATE TABLE tasks (
    id          NUMBER DEFAULT seq_tasks.NEXTVAL PRIMARY KEY,
    project_id  NUMBER NOT NULL,
    assigned_to NUMBER,
    title       VARCHAR2(500) NOT NULL,
    description CLOB,
    status      VARCHAR2(20)  DEFAULT 'TODO' NOT NULL,
    priority    VARCHAR2(10)  DEFAULT 'MEDIUM' NOT NULL,
    due_date    DATE,
    created_at  TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_at  TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT fk_tasks_project   FOREIGN KEY (project_id)  REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_tasks_assigned  FOREIGN KEY (assigned_to) REFERENCES users(id),
    CONSTRAINT chk_tasks_status   CHECK (status   IN ('TODO','IN_PROGRESS','REVIEW','DONE')),
    CONSTRAINT chk_tasks_priority CHECK (priority IN ('LOW','MEDIUM','HIGH','CRITICAL'))
);

-- Task Comments Table
CREATE TABLE task_comments (
    id         NUMBER DEFAULT seq_comments.NEXTVAL PRIMARY KEY,
    task_id    NUMBER NOT NULL,
    author_id  NUMBER NOT NULL,
    body       CLOB  NOT NULL,
    created_at TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT fk_comments_task   FOREIGN KEY (task_id)   REFERENCES tasks(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_author FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_tasks_project  ON tasks(project_id);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_tasks_status   ON tasks(status);
CREATE INDEX idx_comments_task  ON task_comments(task_id);