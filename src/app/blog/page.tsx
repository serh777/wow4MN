'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import Link from 'next/link';
import { Icons } from '@/components/ui/icons';
import Image from 'next/image';
import { IconWrapper } from '@/components/ui/icon-wrapper';
import { Search, Calendar, Clock, User, TrendingUp, Filter, ArrowRight, Sparkles, Bot, BarChart3, Globe, Share2, Bookmark } from 'lucide-react';

// Componente para manejar imágenes con fallback
const BlogImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc('/images/blog/default-blog-image.svg');
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {hasError && imgSrc === '/images/blog/default-blog-image.svg' ? (
        <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <div className="text-white text-center">
            <Icons.content className="w-12 h-12 mx-auto mb-2 opacity-70" />
            <p className="text-sm opacity-90">Imagen del blog</p>
          </div>
        </div>
      ) : (
        <Image
          src={imgSrc}
          alt={alt}
          width={400}
          height={200}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={handleError}
        />
      )}
    </div>
  );
};

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const blogPosts = useMemo(() => [
    {
      id: 1,
      title: "Optimizando Smart Contracts para SEO",
      description: "Guía completa sobre cómo mejorar la visibilidad de tus contratos inteligentes en exploradores blockchain y aumentar su discoverabilidad.",
      date: "2024-03-15",
      category: "Técnico",
      readTime: "8 min",
      views: 1250,
      trending: true,
      tags: ["Smart Contracts", "SEO", "Blockchain"],
      author: "María González",
      image: "/images/blog/Optimizando Smart Contracts para SEO.jpg"
    },
    {
      id: 2,
      title: "Mejores Prácticas SEO para DeFi",
      description: "Estrategias efectivas para aumentar la visibilidad de proyectos DeFi en el ecosistema Web3 y atraer más usuarios.",
      date: "2024-03-10",
      category: "DeFi",
      readTime: "12 min",
      views: 980,
      trending: true,
      tags: ["DeFi", "SEO", "Marketing"],
      author: "Carlos Ruiz",
      image: "/images/blog/SEO para DeFi.jpg"
    },
    {
      id: 3,
      title: "SEO para Colecciones NFT",
      description: "Cómo optimizar tus colecciones NFT para máxima visibilidad y alcance en marketplaces y motores de búsqueda.",
      date: "2024-03-05",
      category: "NFTs",
      readTime: "6 min",
      views: 750,
      trending: false,
      tags: ["NFTs", "Colecciones", "Marketplace"],
      author: "Ana López",
      image: "/images/blog/SEO para Colecciones NFT.jpg"
    },
    {
      id: 4,
      title: "Análisis de Keywords Web3",
      description: "Guía definitiva sobre investigación de palabras clave para proyectos blockchain y cómo implementarlas efectivamente.",
      date: "2024-03-01",
      category: "SEO",
      readTime: "10 min",
      views: 1100,
      trending: false,
      tags: ["Keywords", "Research", "Analytics"],
      author: "David Martín",
      image: "/images/blog/Análisis de Keywords Web3.jpg"
    },
    {
      id: 5,
      title: "Optimización Social para DAOs",
      description: "Estrategias de optimización social para organizaciones autónomas descentralizadas y construcción de comunidades.",
      date: "2024-02-25",
      category: "Social",
      readTime: "7 min",
      views: 650,
      trending: false,
      tags: ["DAOs", "Community", "Social Media"],
      author: "Laura Fernández",
      image: "/images/blog/Optimización Social para DAOs.jpg"
    },
    {
      id: 6,
      title: "Métricas SEO en Blockchain",
      description: "Cómo medir y analizar el rendimiento SEO de proyectos blockchain usando herramientas especializadas.",
      date: "2024-02-20",
      category: "Análisis",
      readTime: "9 min",
      views: 890,
      trending: false,
      tags: ["Analytics", "Metrics", "Performance"],
      author: "Roberto Silva",
      image: "/images/blog/Métricas SEO en Blockchain.jpg"
    },
    {
      id: 7,
      title: "Web3 Content Marketing Strategies",
      description: "Estrategias avanzadas de marketing de contenidos para proyectos Web3 y cómo crear engagement auténtico.",
      date: "2024-02-15",
      category: "Marketing",
      readTime: "11 min",
      views: 720,
      trending: false,
      tags: ["Content Marketing", "Web3", "Strategy"],
      author: "Elena Vega",
      image: "/images/blog/default-blog-image.svg"
    },
    {
      id: 8,
      title: "Tokenomics y SEO: Una Guía Completa",
      description: "Cómo optimizar la documentación y comunicación de tokenomics para mejorar la visibilidad del proyecto.",
      date: "2024-02-10",
      category: "Técnico",
      readTime: "13 min",
      views: 950,
      trending: false,
      tags: ["Tokenomics", "Documentation", "SEO"],
      author: "Miguel Torres",
      image: "/images/blog/default-blog-image.svg"
    }
  ], []);

  const categories = ['all', 'Técnico', 'DeFi', 'NFTs', 'SEO', 'Social', 'Análisis', 'Marketing'];

  const filteredPosts = useMemo(() => {
    let filtered = blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Ordenar posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'views':
          return b.views - a.views;
        case 'readTime':
          return parseInt(a.readTime) - parseInt(b.readTime);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy, blogPosts]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const trendingPosts = blogPosts.filter(post => post.trending).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 md:py-24">
        {/* Hero Section con estilo moderno */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative overflow-hidden mb-16">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          
          <div className="container px-4 md:px-6 relative">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                <BarChart3 className="w-4 h-4" />
                Conocimiento especializado Web3
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Blog WowSeoWeb3
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Descubre las últimas tendencias, tutoriales y análisis sobre SEO, blockchain y Web3. 
                <span className="text-primary font-semibold">Conocimiento que impulsa tu éxito.</span>
              </p>
              
              {/* Estadísticas del blog */}
              <div className="flex flex-wrap justify-center gap-6 py-4">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span><strong>50+</strong> Artículos especializados</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-green-500" />
                  <span><strong>Web3</strong> y blockchain</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Bot className="h-4 w-4 text-blue-500" />
                  <span><strong>IA</strong> y SEO avanzado</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Posts Section */}
        {trendingPosts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Trending Now</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {trendingPosts.map((post) => (
                <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 border-primary/20">
                  <div className="aspect-video relative overflow-hidden">
                    <BlogImage
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="destructive" className="bg-red-500">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 mb-12 border">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar artículos, tags, autores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'Todas' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Más reciente</SelectItem>
                  <SelectItem value="views">Más visto</SelectItem>
                  <SelectItem value="readTime">Tiempo lectura</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            Mostrando {filteredPosts.length} artículo{filteredPosts.length !== 1 ? 's' : ''}
            {searchTerm && ` para "${searchTerm}"`}
            {selectedCategory !== 'all' && ` en ${selectedCategory}`}
          </div>
        </div>

        {/* Blog Posts Grid */}
        {currentPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {currentPosts.map((post) => (
              <Card key={post.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-background via-primary/5 to-secondary/10 border-primary/20 hover:border-primary/40">
                <div className="aspect-video relative overflow-hidden">
                  <BlogImage
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm border-primary/20">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm border-primary/20">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs border-primary/30 hover:bg-primary/10 transition-colors">
                      {post.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-background/50 backdrop-blur-sm rounded-full px-2 py-1 border border-primary/20">
                       <TrendingUp className="h-3 w-3 text-primary" />
                       {post.views.toLocaleString()}
                     </div>
                  </div>
                  
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors leading-tight text-lg">
                    {post.title}
                  </CardTitle>
                  
                  <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                    {post.description}
                  </CardDescription>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5 border-secondary/30 hover:bg-secondary/10 transition-colors">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-primary" />
                        {new Date(post.date).toLocaleDateString('es-ES', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-green-500" />
                        {post.readTime}
                      </span>
                    </div>
                    <span className="text-xs">Por {post.author}</span>
                  </div>
                  
                  <Link href={`/blog/${post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}>
                     <Button className="w-full group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:text-white transition-all duration-300">
                       Leer artículo
                       <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                     </Button>
                   </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <Search className="h-16 w-16 mx-auto text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No se encontraron artículos</h3>
              <p className="text-muted-foreground mb-4">
                Intenta ajustar tus filtros o términos de búsqueda
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setCurrentPage(1);
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mb-16">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                 <Button
                   key={page}
                   variant={currentPage === page ? "primary" : "outline"}
                   size="sm"
                   onClick={() => setCurrentPage(page)}
                   className="w-10"
                 >
                   {page}
                 </Button>
               ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        )}

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 md:p-12 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium">
               <Icons.email className="h-4 w-4" />
               Newsletter Exclusivo
             </div>
            
            <h2 className="text-3xl md:text-4xl font-bold">
              ¿Quieres contenido exclusivo?
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Únete a nuestra comunidad y recibe guías avanzadas, 
              análisis de tendencias y estrategias exclusivas directamente en tu bandeja de entrada.
            </p>
            
            <div className="max-w-md mx-auto">
              <form className="flex gap-3">
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1"
                />
                <Button size="lg" className="px-8">
                   <Icons.email className="mr-2 h-4 w-4" />
                   Suscribirse
                 </Button>
              </form>
              
              <p className="text-xs text-muted-foreground mt-3">
                📧 Sin spam. Cancela cuando quieras. 🔒 Tus datos están seguros.
              </p>
            </div>
            
            <div className="flex justify-center items-center gap-8 pt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Newsletter en crecimiento</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Contenido semanal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Guías exclusivas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}