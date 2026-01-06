import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/extensions/shadcn/components/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/extensions/shadcn/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/extensions/shadcn/components/tabs';
import { Separator } from '@/extensions/shadcn/components/separator';
import { AuthWrapper } from '../components/AuthWrapper';
import { toast } from 'sonner';
import { supabaseClient } from '../utils/supabase/client';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    blogPostsCount: 0,
    documentsCount: 0,
    productCategoriesCount: 0,
    requirementsCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        // Fetch counts from the database
        const [blogPostsResult, documentsResult, categoriesResult, requirementsResult] = await Promise.all([
          supabaseClient.from('blog_posts').select('id', { count: 'exact', head: true }),
          supabaseClient.from('documents').select('id', { count: 'exact', head: true }),
          supabaseClient.from('product_categories').select('id', { count: 'exact', head: true }),
          supabaseClient.from('product_requirements').select('id', { count: 'exact', head: true })
        ]);

        setStats({
          blogPostsCount: blogPostsResult.count || 0,
          documentsCount: documentsResult.count || 0,
          productCategoriesCount: categoriesResult.count || 0,
          requirementsCount: requirementsResult.count || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Nie udało się pobrać statystyk');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const menuItems = [
    {
      title: 'Zarządzanie blogiem',
      description: 'Dodawaj, edytuj i usuwaj wpisy na blogu oraz aktualności',
      count: stats.blogPostsCount,
      path: '/admin-blog-posts'
    },
    {
      title: 'Zarządzanie dokumentami',
      description: 'Dodawaj, edytuj i usuwaj dokumenty do pobrania',
      count: stats.documentsCount,
      path: '/admin-documents'
    },
    {
      title: 'Kategorie produktów',
      description: 'Zarządzaj kategoriami produktów i wymaganiami CPR',
      count: stats.productCategoriesCount,
      path: '/admin-product-categories'
    },
    {
      title: 'Konfiguracja Supabase',
      description: 'Skonfiguruj połączenie z bazą danych Supabase',
      icon: 'settings',
      path: '/admin-supabase-config'
    }
  ];

  return (
    <AuthWrapper>
      <div className="container py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Panel administracyjny</h1>
            <p className="text-muted-foreground mt-1">Zarządzaj treściami strony NowyCPR.pl</p>
          </div>
          <Button onClick={() => navigate('/')} variant="outline">
            Wróć do strony głównej
          </Button>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard">Pulpit</TabsTrigger>
            <TabsTrigger value="settings">Ustawienia</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Wpisy na blogu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? '...' : stats.blogPostsCount}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Dokumenty</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? '...' : stats.documentsCount}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Kategorie produktów</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? '...' : stats.productCategoriesCount}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Wymagania produktów</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? '...' : stats.requirementsCount}</div>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-3">Zarządzanie treścią</h2>
            <Separator className="my-4" />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {menuItems.map((item, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    {item.count !== undefined && (
                      <span className="text-muted-foreground">Ilość: {loading ? '...' : item.count}</span>
                    )}
                    <Button onClick={() => navigate(item.path)}>Zarządzaj</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Ustawienia bazy danych</CardTitle>
                <CardDescription>Skonfiguruj dostęp do bazy danych Supabase</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Zarządzaj połączeniem do bazy danych, kluczami API i konfiguracją Supabase.</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate('/SupabaseConfig')}>Konfiguracja Supabase</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthWrapper>
  );
}
