-- 연구자 테이블
CREATE TABLE IF NOT EXISTS manage_researchers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  age INT NULL,
  gender ENUM('남성', '여성') DEFAULT '남성',
  degree VARCHAR(100) NULL,
  lab VARCHAR(200) NULL,
  lab_url VARCHAR(500) NULL,
  education JSON NULL,
  research_areas JSON NULL,
  publications JSON NULL,
  patents JSON NULL,
  awards JSON NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  -- 표준 필드 추가
  member_idx BIGINT,
  member_name VARCHAR(100),
  company_idx BIGINT,
  company_name VARCHAR(255),
  reg_date INT UNSIGNED,
  mdy_date INT UNSIGNED,
  is_flag INT(11) DEFAULT 1,
  INDEX idx_department (department),
  INDEX idx_position (position),
  INDEX idx_status (status),
  INDEX idx_name (name),
  INDEX idx_email (email),
  UNIQUE KEY unique_active_email (email, deleted_at)
);

-- 수행 기관 테이블
CREATE TABLE IF NOT EXISTS manage_organizations
 (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  member_idx BIGINT,
  member_name VARCHAR(100),
  company_idx BIGINT,
  company_name VARCHAR(255),
  reg_date INT UNSIGNED,
  mdy_date INT UNSIGNED,
  is_flag INT(11) DEFAULT 1,
  INDEX idx_name (name)
);
-- 연구책임자 테이블 
CREATE TABLE IF NOT EXISTS manage_pi (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  member_idx BIGINT,
  member_name VARCHAR(100),
  company_idx BIGINT,
  company_name VARCHAR(255),
  reg_date INT UNSIGNED,
  mdy_date INT UNSIGNED,
  is_flag INT(11) DEFAULT 1,
  INDEX idx_name (name)
);
-- 과제 테이블 
CREATE TABLE IF NOT EXISTS manage_projects (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('planning', 'application', 'ongoing') NOT NULL,
  organization VARCHAR(255) NOT NULL,     -- 수행기관 이름
  pi_name VARCHAR(100) NOT NULL,          -- 연구책임자 이름
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget BIGINT,
  description TEXT,
  status ENUM('기획중', '신청완료', '진행중', '마감임박') NOT NULL DEFAULT '기획중',
  member_idx BIGINT,
  member_name VARCHAR(100),
  company_idx BIGINT,
  company_name VARCHAR(255),
  is_flag INT(11) DEFAULT 1,
  reg_date INT UNSIGNED,
  mdy_date INT UNSIGNED,
  INDEX idx_status (status)
);

-- 프로젝트 작업 관리 테이블 (진행현황용)
CREATE TABLE IF NOT EXISTS project_tasks (
  idx BIGINT AUTO_INCREMENT PRIMARY KEY,
  project_planning_id BIGINT NOT NULL COMMENT '프로젝트 기획 ID',
  title VARCHAR(255) NOT NULL COMMENT '작업 제목',
  description TEXT COMMENT '작업 설명',
  start_date INT UNSIGNED COMMENT '시작일 (timestamp)',
  due_date INT UNSIGNED COMMENT '마감일 (timestamp)',
  status ENUM('planned', 'in-progress', 'completed') DEFAULT 'planned' COMMENT '작업 상태',
  member_idx VARCHAR(50) NOT NULL,
  member_name VARCHAR(100) NOT NULL,
  company_idx VARCHAR(50) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  reg_date INT UNSIGNED,
  mdy_date INT UNSIGNED,
  is_flag INT(11) DEFAULT 1,
  INDEX idx_project_planning_id (project_planning_id),
  INDEX idx_status (status),
  INDEX idx_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='프로젝트 진행현황';

-- KPI 실적 테이블 생성
CREATE TABLE IF NOT EXISTS `project_kpi_results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `member_idx` varchar(100) NOT NULL,
  `member_name` varchar(100) NOT NULL,
  `company_idx` varchar(100) NOT NULL,
  `company_name` varchar(100) NOT NULL,
  `project_id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `kpi_type` varchar(50) NOT NULL,
  `actual_value` int(11) NOT NULL DEFAULT 0,
  `achievement_date` date DEFAULT NULL,
  `description` text,
  `attachment_files` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_project_year_type` (`project_id`, `year`, `kpi_type`),
  KEY `idx_member_company` (`member_idx`, `company_idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8; 

-- 새 과제 기획 메인 테이블 (기본 정보 + 기본정보 탭)
CREATE TABLE IF NOT EXISTS `project_planning` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `project_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '사업명',
  `project_manager` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '총괄책임자',
  `start_date` date NOT NULL COMMENT '사업 시작일',
  `end_date` date NOT NULL COMMENT '사업 종료일',
  `department` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '주관부처',
  `institution` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '전문기관',
  `total_cost` decimal(15,0) NOT NULL COMMENT '총사업비(천원 단위)',
  `announcement_link` text COLLATE utf8mb4_unicode_ci COMMENT '공고문 링크',
  `attachment_files` json DEFAULT NULL COMMENT '첨부파일 정보 (파일명, 경로, 크기 등)',
  `project_purpose` text COLLATE utf8mb4_unicode_ci COMMENT '사업목적',
  `project_details` text COLLATE utf8mb4_unicode_ci COMMENT '사업내용',
  `created_by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '생성자',
  `status` enum('DRAFT','SUBMITTED','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci DEFAULT 'DRAFT' COMMENT '상태',
  `member_idx` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `member_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_idx` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `application_date` int(10) unsigned DEFAULT NULL COMMENT '신청일',
  `reg_date` int(10) unsigned DEFAULT NULL,
  `mdy_date` int(10) unsigned DEFAULT NULL,
  `is_flag` int(11) DEFAULT '1',
  `performance_summary` text COLLATE utf8mb4_unicode_ci COMMENT '성과 요약 (완료 프로젝트용)',
  `follow_up_actions` text COLLATE utf8mb4_unicode_ci COMMENT '후속 조치 (완료 프로젝트용)',
  `reapplication_possibility` text COLLATE utf8mb4_unicode_ci COMMENT '재신청 가능 여부 (미선정 프로젝트용)',
  `improvement_direction` text COLLATE utf8mb4_unicode_ci COMMENT '개선 방향 (미선정 프로젝트용)',
  `status_info_updated_at` int(10) unsigned DEFAULT '0' COMMENT '상태정보 최종 수정일시',
  `status_info_updated_by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '상태정보 수정자',
  PRIMARY KEY (`id`),
  KEY `idx_project_name` (`project_name`),
  KEY `idx_department` (`department`),
  KEY `idx_institution` (`institution`),
  KEY `idx_reg_date` (`reg_date`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='과제 기획 메인 테이블';

-- 정책목표 테이블 (목표달성 현황 탭)
CREATE TABLE project_policy_goals (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_planning_id BIGINT NOT NULL COMMENT '과제 기획 ID',
    policy_name VARCHAR(255) NOT NULL COMMENT '정책명',
    target_value DECIMAL(5,2) NOT NULL COMMENT '목표값(%)',
    achievement_rate DECIMAL(5,2) DEFAULT 0 COMMENT '달성률(%)',
    
    -- 표준 필드
    member_idx VARCHAR(100) NOT NULL,
    member_name VARCHAR(100) NOT NULL,
    company_idx VARCHAR(100) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    reg_date INT UNSIGNED,
    mdy_date INT UNSIGNED,
    is_flag INT(11) DEFAULT 1,
    
    INDEX idx_project_planning_id (project_planning_id),
    INDEX idx_policy_name (policy_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='정책목표 테이블';

-- 컨소시엄 참여 기관 테이블 (컨소시엄 구성 탭 - 기관 정보)
CREATE TABLE project_consortium_organizations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    project_planning_id BIGINT NOT NULL COMMENT '과제 기획 ID',
    year INT NOT NULL DEFAULT 1 COMMENT '연차 (1, 2, 3, 4, 5)',
    organization_type VARCHAR(50) NOT NULL COMMENT '구분 (주관기관, 참여기업 등)',
    organization_name VARCHAR(200) NOT NULL COMMENT '기관(기업)명',
    role_description TEXT COMMENT '역할 설명',
    
    -- 표준 필드
    member_idx VARCHAR(100) NOT NULL,
    member_name VARCHAR(100) NOT NULL,
    company_idx VARCHAR(100) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    reg_date INT UNSIGNED,
    mdy_date INT UNSIGNED,
    is_flag INT(11) DEFAULT 1,
    
    INDEX idx_project_planning_id (project_planning_id),
    INDEX idx_year (year),
    INDEX idx_organization_type (organization_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='컨소시엄 참여 기관 테이블';

-- 컨소시엄 구성원 상세 정보 테이블 (상세 페이지에서 관리)
CREATE TABLE IF NOT EXISTS project_consortium_members (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    organization_id BIGINT NOT NULL COMMENT '참여 기관 ID',
    project_planning_id BIGINT NOT NULL COMMENT '과제 기획 ID',
    member_name VARCHAR(100) NOT NULL COMMENT '이름',
    position VARCHAR(100) COMMENT '직급',
    role VARCHAR(200) COMMENT '역할',
    phone VARCHAR(50) COMMENT '전화번호',
    mobile VARCHAR(50) COMMENT '휴대폰',
    email VARCHAR(200) COMMENT '이메일',
    
    -- 표준 필드
    member_idx VARCHAR(100) NOT NULL,
    member_name_creator VARCHAR(100) NOT NULL,
    company_idx VARCHAR(100) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    reg_date INT UNSIGNED,
    mdy_date INT UNSIGNED,
    is_flag INT(11) DEFAULT 1,
    
    INDEX idx_organization_id (organization_id),
    INDEX idx_project_planning_id (project_planning_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='컨소시엄 구성원 상세 정보 테이블'; 