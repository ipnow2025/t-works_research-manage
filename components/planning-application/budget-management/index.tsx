'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, DollarSign } from 'lucide-react';

interface BudgetManagementProps {
  projectIdx: number;
  companyIdx: number;
  memberIdx: number;
  projectYears: number[];
}

export default function BudgetManagement({
  projectIdx,
  companyIdx,
  memberIdx,
  projectYears,
}: BudgetManagementProps) {
  const [selectedYear, setSelectedYear] = useState<number>(projectYears[0] || new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Fetch budget data
    // API calls no longer need companyIdx and memberIdx parameters
    // They are handled by server functions from session headers
  }, [selectedYear]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading budget data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Year Selection */}
      <div className="flex items-center space-x-4">
        <Label className="text-sm font-medium">Project Year:</Label>
        <div className="flex space-x-2">
          {projectYears.map((year) => (
            <Button
              key={year}
              variant={selectedYear === year ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </Button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Budget Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="items">Budget Items</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Summary</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Budget
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Budget management coming soon...</p>
                <p className="text-sm text-gray-400 mt-2">
                  Project: {projectIdx} | Year: {selectedYear}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Budget Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">Categories management coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Budget Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">Budget items management coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 