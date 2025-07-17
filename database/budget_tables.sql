-- Budget Categories Master Table
CREATE TABLE project_budget_categories (
    idx INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    category_description TEXT,
    company_idx VARCHAR(255) NOT NULL,
    member_idx VARCHAR(255) NOT NULL,
    reg_date INT NOT NULL,
    mdy_date INT NOT NULL
);

-- Project Budgets Table
CREATE TABLE project_budgets (
    idx INT AUTO_INCREMENT PRIMARY KEY,
    project_idx INT NOT NULL,
    budget_year INT NOT NULL,
    total_budget DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    used_budget DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    remaining_budget DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    budget_status ENUM('draft', 'submitted', 'approved', 'rejected') DEFAULT 'draft',
    budget_notes TEXT,
    company_idx VARCHAR(255) NOT NULL,
    member_idx VARCHAR(255) NOT NULL,
    reg_date INT NOT NULL,
    mdy_date INT NOT NULL
);

-- Budget Items Table
CREATE TABLE project_budget_items (
    idx INT AUTO_INCREMENT PRIMARY KEY,
    budget_idx INT NOT NULL,
    category_idx INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    item_description TEXT,
    planned_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    actual_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    item_status ENUM('planned', 'in_progress', 'completed', 'cancelled') DEFAULT 'planned',
    company_idx VARCHAR(255) NOT NULL,
    member_idx VARCHAR(255) NOT NULL,
    reg_date INT NOT NULL,
    mdy_date INT NOT NULL
);

-- Budget Documents Table
CREATE TABLE project_budget_documents (
    idx INT AUTO_INCREMENT PRIMARY KEY,
    budget_idx INT NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    company_idx VARCHAR(255) NOT NULL,
    member_idx VARCHAR(255) NOT NULL,
    reg_date INT NOT NULL,
    mdy_date INT NOT NULL
);

-- Relation Configuration Table
CREATE TABLE project_relation_config (
    idx INT AUTO_INCREMENT PRIMARY KEY,
    relation_table_name VARCHAR(255) NOT NULL,
    relation_table_idx INT NOT NULL,
    relation_table_column_name VARCHAR(255) NOT NULL,
    relation_table_column_idx INT NOT NULL,
    reg_date INT NOT NULL,
    mdy_date INT NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_project_budget_categories_company ON project_budget_categories(company_idx);
CREATE INDEX idx_project_budget_categories_member ON project_budget_categories(member_idx);
CREATE INDEX idx_project_budgets_project ON project_budgets(project_idx);
CREATE INDEX idx_project_budgets_year ON project_budgets(budget_year);
CREATE INDEX idx_project_budgets_company ON project_budgets(company_idx);
CREATE INDEX idx_project_budgets_member ON project_budgets(member_idx);
CREATE INDEX idx_project_budget_items_budget ON project_budget_items(budget_idx);
CREATE INDEX idx_project_budget_items_category ON project_budget_items(category_idx);
CREATE INDEX idx_project_budget_items_company ON project_budget_items(company_idx);
CREATE INDEX idx_project_budget_items_member ON project_budget_items(member_idx);
CREATE INDEX idx_project_budget_documents_budget ON project_budget_documents(budget_idx);
CREATE INDEX idx_project_budget_documents_company ON project_budget_documents(company_idx);
CREATE INDEX idx_project_budget_documents_member ON project_budget_documents(member_idx); 