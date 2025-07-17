interface BiznaviApiRequest {
  url: string;
  method: string;
  data?: Record<string, any>;
  header?: Record<string, any>;
  urlPath?: Record<string, any>;
  responseType?: string;
}

interface BiznaviApiResponse {
  result: boolean;
  msg?: string;
  response: any;
  curl?: string;
  download?: {
    file_content: string;
    file_name: string;
  };
}

export async function callBiznaviApi({
  url,
  method,
  data = {},
  header = {},
  urlPath = {}
}: BiznaviApiRequest): Promise<BiznaviApiResponse> {
  const dataSet = new FormData();
  const headers = new Headers();

  // 헤더 추가
  if (Object.keys(header).length > 0) {
    Object.entries(header).forEach(([key, value]) => {
      dataSet.append(`header[${key}]`, value);
    });
  }

  // 데이터 추가
  if (Object.keys(data).length > 0) {
    Object.entries(data).forEach(([key, value]) => {
      dataSet.append(`body[${key}]`, value);
    });
  }

  // URL 경로 추가
  if (Object.keys(urlPath).length > 0) {
    Object.entries(urlPath).forEach(([key, value]) => {
      dataSet.append(`urlpath[${key}]`, value);
    });
  }

  // 기본 정보 추가
  dataSet.append('url', url);
  dataSet.append('method', method);

  const response = await fetch('/api/biznavi-api', {
    method: 'POST',
    body: dataSet,
    mode: 'cors',
    credentials: 'same-origin',
    cache: 'no-cache',
    headers: headers,
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const responseData = await response.json();

  if (responseData.result === false) {
    throw new Error(responseData.msg || 'API 요청 실패');
  }

  // 다운로드 처리
  if (responseData.download) {
    const blob = new Blob(
      [Uint8Array.from(atob(responseData.download.file_content), c => c.charCodeAt(0))],
      { type: 'application/octet-stream' }
    );
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = responseData.download.file_name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  return responseData;
}
