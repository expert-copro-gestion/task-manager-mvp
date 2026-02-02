psql-- ===== ORGANIZATIONS =====
CREATE TABLE organizations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ===== USERS =====
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  org_id INTEGER NOT NULL REFERENCES organizations(id),
  role VARCHAR(50) DEFAULT 'USER',
  created_by VARCHAR(50) DEFAULT 'SYSTEM',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ===== TASKS =====
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to INTEGER NOT NULL REFERENCES users(id),
  org_id INTEGER NOT NULL REFERENCES organizations(id),
  completed BOOLEAN DEFAULT false,
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ===== ADMIN PERMISSIONS =====
CREATE TABLE admin_permissions (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES users(id),
  resource_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ===== INDEX POUR PERFS =====
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_org_id ON users(org_id);
CREATE INDEX idx_tasks_org_id ON tasks(org_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);