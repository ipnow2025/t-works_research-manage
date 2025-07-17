import mysql from "mysql2/promise"

// MySQL 연결 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// 데이터베이스 연결 테스트
async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log("Successfully connected to MySQL database")
    connection.release()
    return true
  } catch (error) {
    console.error("Failed to connect to MySQL database:", error)
    return false
  }
}

// 쿼리 실행 헬퍼 함수
async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error("Error executing query:", error)
    throw error
  }
}

// 데이터베이스 초기화 함수
async function initDatabase() {
  try {
    // manage_researchers 테이블 생성
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS manage_researchers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        department VARCHAR(100) NOT NULL,
        position VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_department (department),
        INDEX idx_position (position),
        INDEX idx_status (status),
        INDEX idx_name (name)
      )
    `
    
    await query(createTableQuery)

    // 샘플 데이터 삽입
    const sampleData = [
      {
        name: "김연구",
        department: "AI연구소",
        position: "책임연구원",
        email: "kim@research.org",
        phone: "010-1234-5678",
        age: 45,
        gender: "남성",
        degree: "공학박사",
        lab: "AI연구소",
        lab_url: "https://ai-research.example.ac.kr",
        education: ["서울대학교 컴퓨터공학 박사 (2010)", "서울대학교 컴퓨터공학 석사 (2005)", "한국대학교 컴퓨터공학 학사 (2003)"],
        research_areas: ["인공지능", "컴퓨터 비전", "자율주행"],
        publications: ["딥러닝 기반 자율주행 알고리즘의 성능 향상에 관한 연구 (IEEE Transactions on AI, 2025)", "객체 인식 알고리즘의 정확도 개선 방법론 (CVPR, 2024)"],
        patents: ["자율주행차량 충돌 방지 시스템 (10-2024-0098765, 2024)"],
        awards: ["2024 스마트 모빌리티 기술 우수상 (과학기술정보통신부)"]
      },
      {
        name: "이과학",
        department: "AI연구소",
        position: "선임연구원",
        email: "lee@research.org",
        phone: "010-2345-6789",
        age: 38,
        gender: "남성",
        degree: "공학박사",
        lab: "AI연구소",
        lab_url: "https://ai-research.example.ac.kr",
        education: ["한국과학기술원 인공지능 박사 (2018)", "한국과학기술원 인공지능 석사 (2015)", "서울대학교 컴퓨터공학 학사 (2013)"],
        research_areas: ["인공지능", "컴퓨터 비전", "자율주행"],
        publications: ["다중 센서 융합을 통한 객체 인식 성능 향상 (ICCV, 2024)", "저조도 환경에서의 객체 탐지 알고리즘 (ECCV, 2023)"],
        patents: ["다중 센서 기반 객체 인식 시스템 (10-2023-0054321, 2023)"],
        awards: ["2023 젊은 과학자상 (한국인공지능학회)"]
      }
    ]

    // 기존 데이터 확인
    const existingData = await query("SELECT COUNT(*) as count FROM manage_researchers")
    const count = (existingData as any[])[0].count

    if (count === 0) {
      // 샘플 데이터 삽입
      for (const researcher of sampleData) {
        const insertQuery = `
          INSERT INTO manage_researchers 
          (name, department, position, email, phone, age, gender, degree, lab, lab_url, education, research_areas, publications, patents, awards)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `
        await query(insertQuery, [
          researcher.name,
          researcher.department,
          researcher.position,
          researcher.email,
          researcher.phone,
          researcher.age,
          researcher.gender,
          researcher.degree,
          researcher.lab,
          researcher.lab_url,
          JSON.stringify(researcher.education),
          JSON.stringify(researcher.research_areas),
          JSON.stringify(researcher.publications),
          JSON.stringify(researcher.patents),
          JSON.stringify(researcher.awards)
        ])
      }
      console.log("Sample researchers data inserted")
    }

    console.log("Database initialized successfully")
    return true
  } catch (error) {
    console.error("Error initializing database:", error)
    return false
  }
}

export { pool, query, testConnection, initDatabase }
