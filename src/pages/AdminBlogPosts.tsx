import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthWrapper } from '../components/AuthWrapper';
import { Button } from '@/extensions/shadcn/components/button';
import { Input } from '@/extensions/shadcn/components/input';
import { Label } from '@/extensions/shadcn/components/label';
import { Textarea } from '@/extensions/shadcn/components/textarea';
import { Switch } from '@/extensions/shadcn/components/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/extensions/shadcn/components/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/extensions/shadcn/components/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/extensions/shadcn/components/table';
import { Separator } from '@/extensions/shadcn/components/separator';
import { toast } from 'sonner';
import { 
  fetchBlogPosts, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost 
} from '../utils/supabase/admin';
import type { BlogPostRow } from '../utils/supabase/types';

export default function AdminBlogPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPostRow>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: '',
    is_published: true,
    featured_image_url: '',
    tags: []
  });
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadBlogPosts = async () => {
    setIsLoading(true);
    try {
      const result = await fetchBlogPosts(true); // Include unpublished posts for admin
      if (result.success && result.data) {
        setPosts(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error loading blog posts:', error);
      toast.error('Nie udało się załadować wpisów bloga');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const searchLower = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.slug.toLowerCase().includes(searchLower) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchLower)) ||
      (post.author && post.author.toLowerCase().includes(searchLower))
    );
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters except -
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setCurrentPost(prev => ({
      ...prev,
      title,
      // Only auto-generate slug if we're creating a new post and slug hasn't been manually edited
      slug: isCreating && (!prev.slug || prev.slug === generateSlug(prev.title || '')) 
        ? generateSlug(title)
        : prev.slug
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setCurrentPost(prev => ({ ...prev, is_published: checked }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setCurrentPost(prev => ({ ...prev, tags }));
  };

  const resetForm = () => {
    setCurrentPost({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      author: '',
      is_published: true,
      featured_image_url: '',
      tags: []
    });
  };

  const handleCreate = async () => {
    if (!currentPost.title || !currentPost.slug || !currentPost.content) {
      toast.error('Tytuł, URL (slug) i treść są wymagane');
      return;
    }

    setIsCreating(true);
    try {
      const result = await createBlogPost(currentPost as Omit<BlogPostRow, 'id' | 'created_at' | 'updated_at'>);
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        resetForm();
        loadBlogPosts();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast.error('Wystąpił błąd podczas tworzenia wpisu');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async () => {
    if (!currentPost.id || !currentPost.title || !currentPost.slug || !currentPost.content) {
      toast.error('Tytuł, URL (slug) i treść są wymagane');
      return;
    }

    setIsEditing(true);
    try {
      const result = await updateBlogPost(
        currentPost.id, 
        {
          title: currentPost.title,
          slug: currentPost.slug,
          content: currentPost.content,
          excerpt: currentPost.excerpt,
          author: currentPost.author,
          is_published: currentPost.is_published,
          featured_image_url: currentPost.featured_image_url,
          tags: currentPost.tags
        }
      );
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        resetForm();
        loadBlogPosts();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast.error('Wystąpił błąd podczas aktualizacji wpisu');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const result = await deleteBlogPost(deleteId);
      if (result.success) {
        toast.success(result.message);
        setDeleteDialogOpen(false);
        loadBlogPosts();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast.error('Wystąpił błąd podczas usuwania wpisu');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setOpen(true);
  };

  const openEditDialog = (post: BlogPostRow) => {
    setCurrentPost({
      ...post,
      // Ensure tags is an array
      tags: post.tags || []
    });
    setOpen(true);
  };

  return (
    <AuthWrapper>
      <div className="container py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Zarządzanie blogiem</h1>
            <p className="text-muted-foreground mt-1">Dodawaj, edytuj i usuwaj wpisy na blogu</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate('/AdminDashboard')}>
              Powrót do panelu
            </Button>
            <Button onClick={openCreateDialog}>Dodaj nowy wpis</Button>
          </div>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Szukaj wpisów..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Wpisy na blogu</CardTitle>
            <CardDescription>
              Zarządzaj wpisami na blogu i aktualnościami o CPR 2024.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Ładowanie wpisów...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                {searchQuery ? 'Nie znaleziono wpisów pasujących do wyszukiwania' : 'Brak wpisów na blogu'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tytuł</TableHead>
                    <TableHead>URL (slug)</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data publikacji</TableHead>
                    <TableHead className="text-right">Akcje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.slug}</TableCell>
                      <TableCell>{post.author || 'Brak'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${post.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {post.is_published ? 'Opublikowany' : 'Szkic'}
                        </span>
                      </TableCell>
                      <TableCell>{post.published_at ? new Date(post.published_at).toLocaleDateString('pl-PL') : 'Nieopublikowany'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(post)}
                          >
                            Edytuj
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => confirmDelete(post.id)}
                          >
                            Usuń
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{currentPost.id ? 'Edytuj wpis' : 'Dodaj nowy wpis'}</DialogTitle>
              <DialogDescription>
                {currentPost.id ? 'Zaktualizuj istniejący wpis na blogu.' : 'Utwórz nowy wpis na blogu.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="title">Tytuł*</Label>
                <Input
                  id="title"
                  name="title"
                  value={currentPost.title || ''}
                  onChange={handleTitleChange}
                  placeholder="Wprowadź tytuł wpisu"
                  disabled={isCreating || isEditing}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="slug">URL (slug)*</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={currentPost.slug || ''}
                  onChange={handleInputChange}
                  placeholder="wprowadz-url-wpisu"
                  disabled={isCreating || isEditing}
                />
                <p className="text-sm text-muted-foreground">
                  Adres URL wpisu, który będzie dostępny pod adresem /blog/[slug].
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  name="author"
                  value={currentPost.author || ''}
                  onChange={handleInputChange}
                  placeholder="Imię i nazwisko autora"
                  disabled={isCreating || isEditing}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="excerpt">Wstęp</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={currentPost.excerpt || ''}
                  onChange={handleInputChange}
                  placeholder="Krótki opis wpisu wyświetlany na liście wpisów"
                  disabled={isCreating || isEditing}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="featured_image_url">URL obrazka wyróżniającego</Label>
                <Input
                  id="featured_image_url"
                  name="featured_image_url"
                  value={currentPost.featured_image_url || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  disabled={isCreating || isEditing}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="tags">Tagi (oddzielone przecinkami)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={currentPost.tags?.join(', ') || ''}
                  onChange={handleTagsChange}
                  placeholder="tag1, tag2, tag3"
                  disabled={isCreating || isEditing}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="content">Treść*</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={currentPost.content || ''}
                  onChange={handleInputChange}
                  placeholder="Treść wpisu w formacie Markdown"
                  disabled={isCreating || isEditing}
                  rows={10}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={currentPost.is_published || false}
                  onCheckedChange={handleSwitchChange}
                  disabled={isCreating || isEditing}
                />
                <Label htmlFor="is_published">Opublikowany</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} disabled={isCreating || isEditing}>
                Anuluj
              </Button>
              <Button 
                onClick={currentPost.id ? handleUpdate : handleCreate} 
                disabled={isCreating || isEditing}
              >
                {isCreating || isEditing ? (
                  'Zapisywanie...'
                ) : currentPost.id ? (
                  'Zapisz zmiany'
                ) : (
                  'Dodaj wpis'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Potwierdź usunięcie</DialogTitle>
              <DialogDescription>
                Czy na pewno chcesz usunąć ten wpis? Tej operacji nie można cofnąć.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
                Anuluj
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? 'Usuwanie...' : 'Usuń wpis'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthWrapper>
  );
}
