'use client';

import { useState } from 'react';
import { useGetProjectsQuery } from '@/redux/features/project/projectApi';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProjectCard from '@/components/projects/ProjectCard';

export default function ProjectsPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetProjectsQuery({
    search: searchTerm,
    status: statusFilter === 'all' ? undefined : statusFilter,
    category: categoryFilter === 'all' ? undefined : categoryFilter,
    page,
    limit: 8,
  });

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setPage(1);
  };

  return (
    <div className="space-y-8 container mx-auto py-10 mt-20">
   

      <div className="bg-card/30 backdrop-blur-md p-4 rounded-xl border border-border shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('common.search')}
              className="pl-10 h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder={t('common.status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.all')} {t('common.status')}</SelectItem>
              <SelectItem value="ongoing">{t('common.status_ongoing', { defaultValue: 'Ongoing' })}</SelectItem>
              <SelectItem value="upcoming">{t('common.status_upcoming', { defaultValue: 'Upcoming' })}</SelectItem>
              <SelectItem value="expired">{t('common.status_expired', { defaultValue: 'Expired' })}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder={t('common.category')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.all')} {t('common.category')}</SelectItem>
              <SelectItem value="Agriculture">Agriculture</SelectItem>
              <SelectItem value="Fish Farming">Fish Farming</SelectItem>
              <SelectItem value="Real Estate">Real Estate</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all') && (
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-muted-foreground">
              <X className="mr-2 h-4 w-4" />
              {t('common.resetFilters')}
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[400px] w-full bg-slate-100 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          {data?.data?.length > 0 ? (
            <>
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
                {data.data.map((project: any) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
              
              {data.totalPages > 1 && (
                <div className="flex justify-center gap-2 pt-8">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(prev => prev - 1)}
                  >
                    {t('common.previous')}
                  </Button>
                  <div className="flex items-center px-4 text-sm font-medium">
                    {t('common.pageOf', { page, total: data.totalPages })}
                  </div>
                  <Button
                    variant="outline"
                    disabled={page === data.totalPages}
                    onClick={() => setPage(prev => prev + 1)}
                  >
                    {t('common.next')}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-background/50 backdrop-blur-sm rounded-xl border-2 border-dashed border-border/50 transition-all">
              <p className="text-muted-foreground">{t('common.noProjects')}</p>
              <Button variant="link" onClick={handleReset} className="mt-2 text-primary">
                {t('common.clearAll')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
