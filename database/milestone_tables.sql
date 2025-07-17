-- 프로젝트 마일스톤 테이블 생성
CREATE TABLE IF NOT EXISTS project_milestones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('planned', 'in_progress', 'completed', 'delayed') DEFAULT 'planned',
  due_date DATE,
  completion_date DATE NULL,
  progress_percentage INT DEFAULT 0,
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_project_id (project_id),
  INDEX idx_status (status),
  INDEX idx_due_date (due_date)
);

-- 마일스톤 코멘트 테이블 (선택사항)
CREATE TABLE IF NOT EXISTS project_milestone_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  milestone_id INT NOT NULL,
  user_id INT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_milestone_id (milestone_id)
); 