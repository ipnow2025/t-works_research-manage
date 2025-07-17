'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Image, File, Download, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// 파일 타입 정의
interface FileItem {
  idx: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileExt: string;
  fileType: number; // 1: 이미지, 2: 문서, 3: 기타
  regDate: number;
  mdyDate: number;
}

interface FileViewProps {
  functionName: string;
  refIdx: number;
  onFileUpload?: () => void;
}

// API 파일 → FileItem 매핑 함수
function mapApiFileToFileItem(apiFile: any): FileItem {
  function getFileType(ext: string) {
    const img = ['jpg','jpeg','png','gif','bmp','webp'];
    const doc = ['pdf','doc','docx','xls','xlsx','ppt','pptx','hwp','txt'];
    if (img.includes((ext||'').toLowerCase())) return 1;
    if (doc.includes((ext||'').toLowerCase())) return 2;
    return 3;
  }
  return {
    idx: apiFile.idx,
    fileName: apiFile.fileName,
    filePath: apiFile.filePath,
    fileSize: apiFile.fileSize,
    fileExt: apiFile.fileExt,
    fileType: getFileType(apiFile.fileExt),
    regDate: apiFile.createdAt ? new Date(apiFile.createdAt).getTime() : 0,
    mdyDate: apiFile.mdyDate ? new Date(apiFile.mdyDate).getTime() : 0,
  };
}

export default function FileView({ functionName, refIdx, onFileUpload }: FileViewProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileItem | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showUploadIframe, setShowUploadIframe] = useState(false);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // limit 변경 핸들러
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  // 파일 목록을 API에서 가져오는 함수
  const fetchFiles = useCallback(async () => {
    if (!refIdx) return;
    try {
      setIsLoading(true);
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';
      const res = await fetch(`/api/common/file-upload-common/list?function_name=${functionName}&ref_idx=${refIdx}&page=${page}&limit=${limit}`, {
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        credentials: 'include',
      });
      if (res.ok) {
        const result = await res.json();
        // fileList 구조 우선, 아니면 기존 방식 호환
        const arr = Array.isArray(result.fileList)
          ? result.fileList
          : Array.isArray(result)
            ? result
            : (result.files || []);
        setFiles(arr.map(mapApiFileToFileItem));
        setTotal(result.total || arr.length);
        setPage(result.page || page);
        setLimit(result.limit || limit);
      } else {
        setFiles([]);
        setTotal(0);
      }
    } catch (e) {
      setFiles([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [functionName, refIdx, page, limit]);

  // 컴포넌트 마운트/refIdx/페이지/limit/업로드 다이얼로그 닫힐 때마다 목록 새로고침
  useEffect(() => {
    if (!showUploadIframe) {
      fetchFiles();
    }
  }, [refIdx, showUploadIframe, fetchFiles, page, limit]);

  // 파일 업로드 완료 메시지 리스너
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {      
      // UPLOAD_COMPLETE와 UPLOAD_COMPLETED 두 메시지 타입 모두 지원
      if (event.data.type === 'UPLOAD_COMPLETED' || event.data.type === 'UPLOAD_COMPLETE') {
        setShowUploadIframe(false);
        fetchFiles();
        onFileUpload?.();
      }
    };

    if (showUploadIframe) {
      window.addEventListener('message', handleMessage);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [showUploadIframe, fetchFiles, onFileUpload]);

  const handleDownload = async (file: FileItem) => {
    try {
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';
      const res = await fetch(`/api/common/file-upload-common/download/${file.idx}`, {
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('다운로드 실패');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError('파일 다운로드에 실패했습니다.');
    }
  };

  const openDeleteDialog = (file: FileItem) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;

    try {
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';
      const res = await fetch(`/api/common/file-upload-common/${fileToDelete.idx}`, {
        method: 'DELETE',
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('삭제 실패');
      fetchFiles();
      setDeleteDialogOpen(false);
    } catch (error) {
      setError('파일 삭제에 실패했습니다.');
    }
  };

  const getFileIcon = (fileType: number, fileExt: string) => {
    if (fileType === 1) return <Image className="w-6 h-6 text-blue-500" />;
    if (fileType === 2) return <FileText className="w-6 h-6 text-green-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  // 페이지 번호 버튼들을 생성하는 함수
  const getPageNumbers = () => {
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const currentPage = page;
    const pages = [];
    
    // 최대 5개의 페이지 번호만 표시
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    // end가 totalPages에 가까우면 start를 조정
    if (end === totalPages) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return '-';
    try {
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(new Date(timestamp));
    } catch (error) {
      console.error('Invalid date:', timestamp);
      return '-';
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">파일 목록</h2>
        <Button onClick={() => setShowUploadIframe(true)}>파일 업로드</Button>
      </div>

      {/* 파일 업로드 Dialog */}
      {showUploadIframe && (
        <Dialog open={showUploadIframe} onOpenChange={setShowUploadIframe}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>파일 업로드</DialogTitle>
            </DialogHeader>
            <div className="w-full h-[70vh]">
              <iframe
                src={`/public-file-upload?function_name=${functionName}&ref_idx=${refIdx}`}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="파일 업로드"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">{error}</div>
      ) : files.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">등록된 파일이 없습니다.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[420px]">파일명</th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">유형</th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[110px]">크기</th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">등록일</th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[90px]">작업</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.map((file, i) => (
                <tr key={file.idx || `${file.fileName}-${i}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap max-w-[400px]">
                    <div className="flex items-center min-w-0">
                      {getFileIcon(file.fileType, file.fileExt)}
                      <span className="ml-2 text-sm text-gray-900 truncate block" style={{maxWidth: 340}} title={file.fileName}>
                        {file.fileName}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 text-center w-[100px]">
                    {file.fileType === 1 ? '이미지' : file.fileType === 2 ? '문서' : '기타'}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 text-center w-[110px]">
                    {formatFileSize(file.fileSize)}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-500 text-center w-[120px]">
                    {formatDate(file.regDate)}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-right text-sm font-medium w-[90px]">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(file)}
                        title="다운로드"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(file)}
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 페이지네이션 UI */}
      <div className="flex items-center justify-between mt-6 px-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {/* 페이지 번호 버튼들 */}
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  pageNum === page
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {pageNum}
              </button>
            ))}
            
            <button
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= Math.ceil(total / limit)}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">페이지당</span>
            <select 
              value={limit} 
              onChange={handleLimitChange} 
              className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[10, 20, 50, 100].map(opt => (
                <option key={opt} value={opt}>{opt}개</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          총 <span className="font-medium">{total}</span>건
        </div>
      </div>

      {/* 파일 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>파일 삭제</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>정말로 "{fileToDelete?.fileName}" 파일을 삭제하시겠습니까?</p>
            <p className="text-sm text-red-500">이 작업은 되돌릴 수 없습니다.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
