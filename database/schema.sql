-- VeerSetu Khandesh -- reference schema
-- Hibernate (spring.jpa.hibernate.ddl-auto=update) creates and updates these
-- tables automatically on startup, so running this file is OPTIONAL. It's
-- provided for anyone who prefers to provision the schema by hand, or to
-- understand the data model at a glance.

CREATE DATABASE IF NOT EXISTS veersetu_khandesh;
USE veersetu_khandesh;

CREATE TABLE IF NOT EXISTS users (
    id                   BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name            VARCHAR(150) NOT NULL,
    email                VARCHAR(150) NOT NULL UNIQUE,
    phone                VARCHAR(20),
    password             VARCHAR(255) NOT NULL,
    role                 VARCHAR(20)  NOT NULL,        -- ADMIN / FAMILY
    relation_to_soldier  VARCHAR(100),
    created_at           DATETIME
);

CREATE TABLE IF NOT EXISTS soldiers (
    id                    BIGINT AUTO_INCREMENT PRIMARY KEY,
    name                  VARCHAR(150) NOT NULL,
    age                   INT,
    date_of_birth         DATE,
    photo_path            VARCHAR(255),

    force                 VARCHAR(100),
    battalion             VARCHAR(150),
    unit                  VARCHAR(150),
    `rank`                VARCHAR(100),
    designation           VARCHAR(150),
    service_number        VARCHAR(100),
    posting_place         VARCHAR(150),

    martyrdom_date        DATE,
    martyrdom_place       VARCHAR(150),
    operation_name        VARCHAR(150),
    story                 VARCHAR(3000),

    district              VARCHAR(20),                 -- DHULE / JALGAON / NANDURBAR / NASHIK
    taluka                VARCHAR(100),
    village               VARCHAR(150),
    address               VARCHAR(255),
    latitude              DOUBLE,
    longitude             DOUBLE,

    family_contact_name   VARCHAR(150),
    family_contact_phone  VARCHAR(20),
    family_contact_email  VARCHAR(150),
    qr_code_path          VARCHAR(255),

    approval_status       VARCHAR(20) DEFAULT 'PENDING', -- PENDING / APPROVED / REJECTED
    rejection_reason      VARCHAR(500),
    submitted_by_user_id  BIGINT,
    submitted_at          DATETIME,
    reviewed_at           DATETIME,

    CONSTRAINT fk_soldier_submitted_by FOREIGN KEY (submitted_by_user_id) REFERENCES users(id)
);

CREATE INDEX idx_soldier_district ON soldiers(district);
CREATE INDEX idx_soldier_status ON soldiers(approval_status);
CREATE INDEX idx_soldier_village ON soldiers(village);
