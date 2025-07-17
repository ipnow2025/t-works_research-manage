// 시스템 사용자 데이터를 중앙에서 관리하는 파일

// 사용자 상세 정보 타입 정의
export interface UserDetails {
  age: number
  gender: string
  education: string[]
  lab: string
  labUrl: string
  phone: string
  researchAreas: string[]
  degree: string
  publications: string[]
  patents: string[]
  awards: string[]
}

// 사용자 데이터 타입 정의
export interface User {
  name: string
  email: string
  role: string
  department: string
  registrationDate: string
  status: "활성" | "비활성"
  details: UserDetails
}

// 사용자 데이터 - 18명 (2 교수, 6 박사, 6 석사, 4 학사)
export const userData: User[] = [
  {
    name: "김교수",
    email: "kim@example.ac.kr",
    role: "교수",
    department: "컴퓨터공학과",
    registrationDate: "2020-03-01",
    status: "활성",
    details: {
      age: 45,
      gender: "남성",
      education: [
        "서울대학교 컴퓨터공학 박사 (2010)",
        "서울대학교 컴퓨터공학 석사 (2005)",
        "한국대학교 컴퓨터공학 학사 (2003)",
      ],
      lab: "인공지능 연구실",
      labUrl: "https://ai-lab.example.ac.kr",
      phone: "010-1234-5678",
      researchAreas: ["인공지능", "컴퓨터 비전", "자율주행"],
      degree: "공학박사",
      publications: [
        "딥러닝 기반 자율주행 알고리즘의 성능 향상에 관한 연구 (IEEE Transactions on AI, 2025)",
        "객체 인식 알고리즘의 정확도 개선 방법론 (CVPR, 2024)",
      ],
      patents: ["자율주행차량 충돌 방지 시스템 (10-2024-0098765, 2024)"],
      awards: ["2024 스마트 모빌리티 기술 우수상 (과학기술정보통신부)"],
    },
  },
  {
    name: "이교수",
    email: "lee.prof@example.ac.kr",
    role: "교수",
    department: "전자공학과",
    registrationDate: "2018-09-01",
    status: "활성",
    details: {
      age: 52,
      gender: "남성",
      education: ["MIT 전자공학 박사 (2005)", "서울대학교 전자공학 석사 (2000)", "서울대학교 전자공학 학사 (1998)"],
      lab: "반도체 연구실",
      labUrl: "https://semi-lab.example.ac.kr",
      phone: "010-2345-6789",
      researchAreas: ["반도체", "집적회로", "양자컴퓨팅"],
      degree: "공학박사",
      publications: [
        "차세대 반도체 소자의 양자효과에 관한 연구 (Nature Electronics, 2024)",
        "고성능 집적회로 설계 방법론 (IEEE JSSC, 2023)",
      ],
      patents: ["양자 기반 반도체 소자 (10-2023-0087654, 2023)"],
      awards: ["2023 반도체 기술 혁신상 (산업통상자원부)"],
    },
  },
  {
    name: "박박사",
    email: "park.phd@example.ac.kr",
    role: "박사",
    department: "컴퓨터공학과",
    registrationDate: "2021-03-15",
    status: "활성",
    details: {
      age: 35,
      gender: "남성",
      education: [
        "한국과학기술원 컴퓨터공학 박사 (2020)",
        "서울대학교 컴퓨터공학 석사 (2017)",
        "고려대학교 컴퓨터공학 학사 (2015)",
      ],
      lab: "인공지능 연구실",
      labUrl: "https://ai-lab.example.ac.kr",
      phone: "010-3456-7890",
      researchAreas: ["머신러닝", "자연어처리", "컴퓨터 비전"],
      degree: "공학박사",
      publications: [
        "대규모 언어 모델의 효율적 학습 방법 (ACL, 2024)",
        "멀티모달 학습을 위한 새로운 아키텍처 (CVPR, 2023)",
      ],
      patents: ["효율적인 딥러닝 모델 압축 방법 (10-2023-0076543, 2023)"],
      awards: ["2023 인공지능 학회 우수 논문상"],
    },
  },
  {
    name: "최박사",
    email: "choi.phd@example.ac.kr",
    role: "박사",
    department: "전자공학과",
    registrationDate: "2022-02-01",
    status: "활성",
    details: {
      age: 33,
      gender: "여성",
      education: [
        "서울대학교 전자공학 박사 (2021)",
        "서울대학교 전자공학 석사 (2018)",
        "연세대학교 전자공학 학사 (2016)",
      ],
      lab: "반도체 연구실",
      labUrl: "https://semi-lab.example.ac.kr",
      phone: "010-4567-8901",
      researchAreas: ["집적회로", "반도체 소자", "전력 전자"],
      degree: "공학박사",
      publications: ["저전력 집적회로 설계 기법 (IEEE TCAS, 2024)", "차세대 메모리 소자의 신뢰성 향상 (IEDM, 2023)"],
      patents: ["저전력 메모리 회로 (10-2023-0065432, 2023)"],
      awards: ["2022 반도체 설계 콘테스트 우수상"],
    },
  },
  {
    name: "정박사",
    email: "jung.phd@example.ac.kr",
    role: "박사",
    department: "기계공학과",
    registrationDate: "2021-09-01",
    status: "활성",
    details: {
      age: 34,
      gender: "남성",
      education: [
        "한국과학기술원 기계공학 박사 (2021)",
        "한국과학기술원 기계공학 석사 (2018)",
        "부산대학교 기계공학 학사 (2016)",
      ],
      lab: "로봇공학 연구실",
      labUrl: "https://robotics-lab.example.ac.kr",
      phone: "010-5678-9012",
      researchAreas: ["로보틱스", "제어공학", "인간-로봇 상호작용"],
      degree: "공학박사",
      publications: [
        "협동 로봇의 안전한 제어 알고리즘 (IEEE Robotics, 2024)",
        "로봇 매니퓰레이터의 정밀 제어 (ICRA, 2023)",
      ],
      patents: ["안전한 인간-로봇 협업 시스템 (10-2023-0054321, 2023)"],
      awards: ["2023 로보틱스 학회 신진 연구자상"],
    },
  },
  {
    name: "한박사",
    email: "han.phd@example.ac.kr",
    role: "박사",
    department: "화학공학과",
    registrationDate: "2022-03-01",
    status: "비활성",
    details: {
      age: 32,
      gender: "여성",
      education: [
        "서울대학교 화학공학 박사 (2022)",
        "서울대학교 화학공학 석사 (2019)",
        "포항공과대학교 화학공학 학사 (2017)",
      ],
      lab: "촉매 연구실",
      labUrl: "https://catalyst-lab.example.ac.kr",
      phone: "010-6789-0123",
      researchAreas: ["촉매화학", "나노소재", "에너지 변환"],
      degree: "공학박사",
      publications: [
        "고효율 수소 생산을 위한 나노촉매 개발 (Nature Catalysis, 2024)",
        "이산화탄소 전환 촉매의 안정성 향상 (ACS Catalysis, 2023)",
      ],
      patents: ["이산화탄소 전환용 나노촉매 (10-2023-0043210, 2023)"],
      awards: ["2023 화학공학회 우수 논문상"],
    },
  },
  {
    name: "강박사",
    email: "kang.phd@example.ac.kr",
    role: "박사",
    department: "생명공학과",
    registrationDate: "2021-03-01",
    status: "활성",
    details: {
      age: 36,
      gender: "남성",
      education: [
        "한국과학기술원 생명공학 박사 (2021)",
        "서울대학교 생명공학 석사 (2018)",
        "연세대학교 생명공학 학사 (2016)",
      ],
      lab: "바이오센서 연구실",
      labUrl: "https://biosensor-lab.example.ac.kr",
      phone: "010-7890-1234",
      researchAreas: ["바이오센서", "생체재료", "의료기기"],
      degree: "공학박사",
      publications: [
        "웨어러블 바이오센서를 이용한 실시간 건강 모니터링 (Nature Biomedical Engineering, 2024)",
        "고감도 단백질 검출 센서 개발 (Biosensors and Bioelectronics, 2023)",
      ],
      patents: ["웨어러블 바이오센서 시스템 (10-2023-0032109, 2023)"],
      awards: ["2022 의공학회 기술혁신상"],
    },
  },
  {
    name: "윤박사",
    email: "yoon.phd@example.ac.kr",
    role: "박사",
    department: "컴퓨터공학과",
    registrationDate: "2022-09-01",
    status: "활성",
    details: {
      age: 31,
      gender: "여성",
      education: [
        "서울대학교 컴퓨터공학 박사 (2022)",
        "서울대학교 컴퓨터공학 석사 (2019)",
        "고려대학교 컴퓨터공학 학사 (2017)",
      ],
      lab: "사이버보안 연구실",
      labUrl: "https://security-lab.example.ac.kr",
      phone: "010-8901-2345",
      researchAreas: ["사이버보안", "암호학", "블록체인"],
      degree: "공학박사",
      publications: [
        "양자 내성 암호 알고리즘 개발 (IEEE Security & Privacy, 2024)",
        "블록체인 기반 안전한 의료정보 공유 시스템 (ACM CCS, 2023)",
      ],
      patents: ["양자 내성 암호화 방법 (10-2023-0021098, 2023)"],
      awards: ["2023 정보보호학회 신진 연구자상"],
    },
  },
  {
    name: "이석사",
    email: "lee.master@example.ac.kr",
    role: "석사",
    department: "컴퓨터공학과",
    registrationDate: "2023-03-01",
    status: "활성",
    details: {
      age: 28,
      gender: "남성",
      education: ["서울대학교 컴퓨터공학 석사 (2023)", "고려대학교 컴퓨터공학 학사 (2021)"],
      lab: "인공지능 연구실",
      labUrl: "https://ai-lab.example.ac.kr",
      phone: "010-9012-3456",
      researchAreas: ["딥러닝", "컴퓨터 비전"],
      degree: "공학석사",
      publications: ["경량화된 객체 인식 알고리즘 개발 (CVPR Workshop, 2024)"],
      patents: [],
      awards: ["2023 대학원 우수 논문상"],
    },
  },
  {
    name: "김석사",
    email: "kim.master@example.ac.kr",
    role: "석사",
    department: "전자공학과",
    registrationDate: "2023-03-01",
    status: "활성",
    details: {
      age: 27,
      gender: "여성",
      education: ["서울대학교 전자공학 석사 (2023)", "연세대학교 전자공학 학사 (2021)"],
      lab: "반도체 연구실",
      labUrl: "https://semi-lab.example.ac.kr",
      phone: "010-0123-4567",
      researchAreas: ["반도체 소자", "집적회로"],
      degree: "공학석사",
      publications: ["저전력 메모리 회로 설계 (IEEE ISSCC Student Session, 2024)"],
      patents: [],
      awards: ["2023 반도체 설계 경진대회 장려상"],
    },
  },
  {
    name: "박석사",
    email: "park.master@example.ac.kr",
    role: "석사",
    department: "기계공학과",
    registrationDate: "2023-09-01",
    status: "활성",
    details: {
      age: 26,
      gender: "남성",
      education: ["한국과학기술원 기계공학 석사 (진행중)", "부산대학교 기계공학 학사 (2022)"],
      lab: "로봇공학 연구실",
      labUrl: "https://robotics-lab.example.ac.kr",
      phone: "010-1234-5678",
      researchAreas: ["로보틱스", "제어공학"],
      degree: "공학석사 과정",
      publications: [],
      patents: [],
      awards: ["2022 학부 우수 졸업논문상"],
    },
  },
  {
    name: "최석사",
    email: "choi.master@example.ac.kr",
    role: "석사",
    department: "화학공학과",
    registrationDate: "2023-09-01",
    status: "비활성",
    details: {
      age: 25,
      gender: "여성",
      education: ["서울대학교 화학공학 석사 (진행중)", "포항공과대학교 화학공학 학사 (2022)"],
      lab: "촉매 연구실",
      labUrl: "https://catalyst-lab.example.ac.kr",
      phone: "010-2345-6789",
      researchAreas: ["촉매화학", "나노소재"],
      degree: "공학석사 과정",
      publications: [],
      patents: [],
      awards: ["2022 학부 우수 연구상"],
    },
  },
  {
    name: "정석사",
    email: "jung.master@example.ac.kr",
    role: "석사",
    department: "생명공학과",
    registrationDate: "2024-03-01",
    status: "활성",
    details: {
      age: 24,
      gender: "남성",
      education: ["한국과학기술원 생명공학 석사 (진행중)", "연세대학교 생명공학 학사 (2023)"],
      lab: "바이오센서 연구실",
      labUrl: "https://biosensor-lab.example.ac.kr",
      phone: "010-3456-7890",
      researchAreas: ["바이오센서", "생체재료"],
      degree: "공학석사 과정",
      publications: [],
      patents: [],
      awards: [],
    },
  },
  {
    name: "한석사",
    email: "han.master@example.ac.kr",
    role: "석사",
    department: "컴퓨터공학과",
    registrationDate: "2024-03-01",
    status: "활성",
    details: {
      age: 25,
      gender: "여성",
      education: ["서울대학교 컴퓨터공학 석사 (진행중)", "고려대학교 컴퓨터공학 학사 (2023)"],
      lab: "사이버보안 연구실",
      labUrl: "https://security-lab.example.ac.kr",
      phone: "010-4567-8901",
      researchAreas: ["사이버보안", "암호학"],
      degree: "공학석사 과정",
      publications: [],
      patents: [],
      awards: [],
    },
  },
  {
    name: "강학사",
    email: "kang.bachelor@example.ac.kr",
    role: "학사",
    department: "컴퓨터공학과",
    registrationDate: "2024-03-01",
    status: "활성",
    details: {
      age: 22,
      gender: "남성",
      education: ["서울대학교 컴퓨터공학 학사 (진행중)"],
      lab: "인공지능 연구실",
      labUrl: "https://ai-lab.example.ac.kr",
      phone: "010-5678-9012",
      researchAreas: ["머신러닝"],
      degree: "공학학사 과정",
      publications: [],
      patents: [],
      awards: [],
    },
  },
  {
    name: "윤학사",
    email: "yoon.bachelor@example.ac.kr",
    role: "학사",
    department: "전자공학과",
    registrationDate: "2024-03-01",
    status: "활성",
    details: {
      age: 21,
      gender: "여성",
      education: ["서울대학교 전자공학 학사 (진행중)"],
      lab: "반도체 연구실",
      labUrl: "https://semi-lab.example.ac.kr",
      phone: "010-6789-0123",
      researchAreas: ["집적회로"],
      degree: "공학학사 과정",
      publications: [],
      patents: [],
      awards: [],
    },
  },
  {
    name: "조학사",
    email: "cho.bachelor@example.ac.kr",
    role: "학사",
    department: "기계공학과",
    registrationDate: "2023-09-01",
    status: "비활성",
    details: {
      age: 23,
      gender: "남성",
      education: ["한국과학기술원 기계공학 학사 (진행중)"],
      lab: "로봇공학 연구실",
      labUrl: "https://robotics-lab.example.ac.kr",
      phone: "010-7890-1234",
      researchAreas: ["로보틱스"],
      degree: "공학학사 과정",
      publications: [],
      patents: [],
      awards: [],
    },
  },
  {
    name: "임학사",
    email: "lim.bachelor@example.ac.kr",
    role: "학사",
    department: "화학공학과",
    registrationDate: "2023-09-01",
    status: "활성",
    details: {
      age: 22,
      gender: "여성",
      education: ["서울대학교 화학공학 학사 (진행중)"],
      lab: "촉매 연구실",
      labUrl: "https://catalyst-lab.example.ac.kr",
      phone: "010-8901-2345",
      researchAreas: ["나노소재"],
      degree: "공학학사 과정",
      publications: [],
      patents: [],
      awards: [],
    },
  },
]

// 활성 상태인 사용자만 필터링하는 함수
export function getActiveUsers(): User[] {
  return userData.filter((user) => user.status === "활성")
}

// 이름이나 소속으로 사용자 검색하는 함수
export function searchUsers(query: string): User[] {
  if (!query) return getActiveUsers()

  const lowerQuery = query.toLowerCase()
  return getActiveUsers().filter(
    (user) =>
      user.name.toLowerCase().includes(lowerQuery) ||
      user.department.toLowerCase().includes(lowerQuery) ||
      user.role.toLowerCase().includes(lowerQuery),
  )
}
