"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, User, Phone, Mail, Smartphone } from "lucide-react"

interface ConsortiumProps {
  project: any
}

export function Consortium({ project }: ConsortiumProps) {
  const consortium = project?.consortium || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">인력구성</h2>
        <p className="text-sm text-muted-foreground">프로젝트 참여 기관 및 구성원 정보입니다.</p>
      </div>

      <div className="space-y-4">
        {consortium.map((org: any) => (
          <Card key={org.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{org.name}</CardTitle>
                </div>
                <Badge variant={org.type === "주관" ? "default" : "secondary"}>{org.type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-medium text-sm">구성원</h4>
                <div className="grid gap-4">
                  {org.members?.map((member: any) => (
                    <div key={member.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{member.name}</span>
                          <span className="text-sm text-muted-foreground">({member.position})</span>
                        </div>
                        <Badge variant="outline">{member.role}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{member.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-3 w-3 text-muted-foreground" />
                          <span>{member.mobile}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span>{member.email}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
