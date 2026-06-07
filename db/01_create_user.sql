-- Run this as SYSTEM on freepdb1
-- Creates the TaskForge databse user and grants necessary privileges

CREATE USER taskforge IDENTIFIED BY "taskforge123";

GRANT CONNECT, RESOURCE TO taskforge;
GRANT CREATE SESSION TO taskforge;
GRANT UNLIMITED TABLESPACE TO taskforge;