import { NextRequest } from 'next/server';

export function getUserIdFromSession(req: NextRequest): string | null {
  const encoded = req.headers.get('x-user-session');
  if (!encoded) return null;
  try {
    // 안전한 유니코드 Base64 디코딩
    const decoded = Buffer.from(encoded, 'base64').toString();
    const member = JSON.parse(decoded);
    
    return member.memberIdx || member.member_id || member.id || null;
  } catch (e) {
    console.log('getUserIdFromSession error', e);
    return null;
  }
} 

export function getCompanyIdxFromSession(req: NextRequest): string | null {
  const encoded = req.headers.get('x-user-session');
  if (!encoded) return null;
  try {
    // 안전한 유니코드 Base64 디코딩
    const decoded = Buffer.from(encoded, 'base64').toString();
    const member = JSON.parse(decoded);

    return member.companyIdx || null;
  } catch (e) {
    console.log('getUserIdFromSession error', e);
    return null;
  }
}

// 서버 사이드에서 사용할 회원 정보 가져오기 함수
export function getMemberInfoFromRequest(req: NextRequest) {
  const encoded = req.headers.get('x-user-session');
  if (!encoded) return null;
  try {
    const decoded = Buffer.from(encoded, 'base64').toString();
    const memberData = JSON.parse(decoded);
    return {
      memberIdx: memberData.memberIdx || null,
      memberName: memberData.memberName || memberData.name || null,
      companyIdx: memberData.companyIdx || null,
      companyName: memberData.companyName || null
    };
  } catch {
    return null;
  }
} 