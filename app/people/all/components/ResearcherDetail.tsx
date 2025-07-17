import React from 'react'
import { Researcher } from '../types/researcher'

interface ResearcherDetailProps {
  researcher: Researcher | null
  isOpen: boolean
  onClose: () => void
}

export function ResearcherDetail({ researcher, isOpen, onClose }: ResearcherDetailProps) {
  if (!isOpen || !researcher) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold">상세 정보</h3>
            <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm text-gray-500 mb-3">기본 정보</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-sm font-medium">이름</div>
                  <div className="col-span-2">{researcher.name}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-sm font-medium">소속</div>
                  <div className="col-span-2">{researcher.department}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-sm font-medium">직위</div>
                  <div className="col-span-2">{researcher.position}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-sm font-medium">나이</div>
                  <div className="col-span-2">{researcher.age || '-'}세</div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-sm font-medium">성별</div>
                  <div className="col-span-2">{researcher.gender}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-sm font-medium">학위</div>
                  <div className="col-span-2">{researcher.degree || '-'}</div>
                </div>
              </div>

              <h4 className="text-sm text-gray-500 mt-5 mb-3">연락처</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-sm font-medium">전화번호</div>
                  <div className="col-span-2">{researcher.phone}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-sm font-medium">이메일</div>
                  <div className="col-span-2">{researcher.email}</div>
                </div>
              </div>

              <h4 className="text-sm text-gray-500 mt-5 mb-3">소속</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-sm font-medium">연구실</div>
                  <div className="col-span-2">{researcher.lab || '-'}</div>
                </div>
                {researcher.lab_url && (
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div className="text-sm font-medium">연구실 URL</div>
                    <div className="col-span-2">
                      <a
                        href={researcher.lab_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        {researcher.lab_url}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-1"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" x2="21" y1="14" y2="3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm text-gray-500 mb-3">주요 연구분야</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-wrap gap-2 items-center">
                  {researcher.research_areas.length > 0 ? (
                    researcher.research_areas.map((area: string, index: number) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                      >
                        {area}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">등록된 연구분야가 없습니다</span>
                  )}
                </div>
              </div>

              <h4 className="text-sm text-gray-500 mt-5 mb-3">학력</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                {researcher.education.length > 0 ? (
                  <ul className="space-y-2 list-disc pl-5 items-center">
                    {researcher.education.map((edu: string, index: number) => (
                      <li key={index} className="text-sm">
                        {edu}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-sm text-gray-500">등록된 학력이 없습니다</span>
                )}
              </div>

              <h4 className="text-sm text-gray-500 mt-5 mb-3">주요 논문</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                {researcher.publications.length > 0 ? (
                  <ul className="space-y-2 list-disc pl-5 items-center">
                    {researcher.publications.map((pub: string, index: number) => (
                      <li key={index} className="text-sm">
                        {pub}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-sm text-gray-500">등록된 논문이 없습니다</span>
                )}
              </div>

              <h4 className="text-sm text-gray-500 mt-5 mb-3">주요 특허</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                {researcher.patents.length > 0 ? (
                  <ul className="space-y-2 list-disc pl-5 items-center">
                    {researcher.patents.map((patent: string, index: number) => (
                      <li key={index} className="text-sm">
                        {patent}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-sm text-gray-500">등록된 특허가 없습니다</span>
                )}
              </div>

              <h4 className="text-sm text-gray-500 mt-5 mb-3">주요 수상이력</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                {researcher.awards.length > 0 ? (
                  <ul className="space-y-2 list-disc pl-5 items-center">
                    {researcher.awards.map((award: string, index: number) => (
                      <li key={index} className="text-sm">
                        {award}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-sm text-gray-500">등록된 수상이력이 없습니다</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
              onClick={onClose}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 