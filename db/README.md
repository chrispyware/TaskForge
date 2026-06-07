# TaskForge Database Setup

Requires Oracle Database 26ai Free.
Download: https://www.oracle.com/database/free/get-started/

## Steps

### 1. Connect as SYSTEM to freepdb1
Run `01_create_user.sql` to create the taskforge schema user.

### 2. Connect as TASKFORGE to freepdb1
Run `02_create_schema.sql` to create all tables, sequences, and indexes.

### 3. (Optional) Load sample data
Run `03_seed_data.sql` to insert a test user and sample project/tasks.
The default password for all seed users is `password123`.

## Connection details
| Field        | Value      |
|--------------|------------|
| Hostname     | localhost  |
| Port         | 1521       |
| Service Name | freepdb1   |
| Username     | taskforge  |
| Password     | taskforge123 |

> **Note:** Update the password in `01_create_user.sql` and in
> `taskforge-api/src/main/resources/application.yml` to match.