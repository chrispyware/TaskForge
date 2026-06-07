-- Run this as TASKFORGE on freepdb1
-- Optional: inserts sample data for development and testing
-- Default password for all seed users is: password123

INSERT INTO users (email, password, display_name, role)
VALUES (
    'chris@taskforge.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    'Chris',
    'ADMIN'
);

INSERT INTO projects (name, description, owner_id)
VALUES ('TaskForge MVP', 'Building the TaskForge application', 1);

INSERT INTO tasks (project_id, assigned_to, title, status, priority)
VALUES (1, 1, 'Set up Oracle schema', 'DONE', 'HIGH');

INSERT INTO tasks (project_id, assigned_to, title, status, priority)
VALUES (1, 1, 'Build Spring Boot API', 'IN_PROGRESS', 'HIGH');

INSERT INTO tasks (project_id, assigned_to, title, status, priority)
VALUES (1, 1, 'Build Angular frontend', 'TODO', 'MEDIUM');

COMMIT;