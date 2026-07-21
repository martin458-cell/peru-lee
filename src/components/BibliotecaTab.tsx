import React, { useState } from 'react';
import { Book, FolderOpen, ExternalLink, Search, Sparkles, Filter, FileText, ArrowUpRight } from 'lucide-react';

interface BookItem {
  id: string;
  title: string;
  author: string;
  category: 'A' | 'B' | 'C';
  grades: string;
  genre: string;
  description: string;
  theme: string;
  driveLink: string;
}

export default function BibliotecaTab() {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'A' | 'B' | 'C'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Curated list of classic & official readings frequently utilized in primary school "Perú Lee"
  const books: BookItem[] = [
    // Categoría A
    {
      id: '1',
      title: 'El bagrecico',
      author: 'Francisco Izquierdo Ríos',
      category: 'A',
      grades: '1.° y 2.° de Primaria',
      genre: 'Cuento Infantil',
      description: 'La célebre aventura de un pequeño pez bagre que decide conocer el mar, superando múltiples peligros y enseñando perseverancia a los más pequeños.',
      theme: 'Perseverancia, descubrimiento, curiosidad',
      driveLink: 'https://drive.google.com/drive/folders/19o4BlSQTLX6UyL_IzZB1aaRRNgscs5lP?usp=sharing'
    },
    {
      id: '2',
      title: 'El torito de la piel de brillante',
      author: 'José María Arguedas (Mito recopilado)',
      category: 'A',
      grades: '1.° y 2.° de Primaria',
      genre: 'Mito / Leyenda Andina',
      description: 'La entrañable y mística historia de un torito fiel que debe enfrentarse a un toro negro surgido de las profundidades de un lago.',
      theme: 'Lealtad, sacrificio, identidad cultural',
      driveLink: 'https://drive.google.com/drive/folders/19o4BlSQTLX6UyL_IzZB1aaRRNgscs5lP?usp=sharing'
    },
    {
      id: '3',
      title: 'La zorra y la huallata',
      author: 'Tradición Oral Andina',
      category: 'A',
      grades: '1.° y 2.° de Primaria',
      genre: 'Fábula Tradicional',
      description: 'Una fábula divertida de la sierra peruana donde una zorra intenta imitar la belleza de las patas rojas de las crías de la huallata.',
      theme: 'Aceptación, consecuencias de la envidia',
      driveLink: 'https://drive.google.com/drive/folders/19o4BlSQTLX6UyL_IzZB1aaRRNgscs5lP?usp=sharing'
    },
    // Categoría B
    {
      id: '4',
      title: 'Paco Yunque',
      author: 'César Vallejo',
      category: 'B',
      grades: '3.° y 4.° de Primaria',
      genre: 'Cuento Social',
      description: 'El clásico relato escolar que describe las vivencias de Paco Yunque frente a las injusticias cometidas por Humberto Grieve en su primer día de clases.',
      theme: 'Justicia, solidaridad, empatía escolar',
      driveLink: 'https://drive.google.com/drive/folders/19o4BlSQTLX6UyL_IzZB1aaRRNgscs5lP?usp=sharing'
    },
    {
      id: '5',
      title: 'Cholito en los Andes mágicos',
      author: 'Óscar Colchado Lucio',
      category: 'B',
      grades: '3.° y 4.° de Primaria',
      genre: 'Novela de Aventuras',
      description: 'Las fantásticas aventuras de Cholito en un mundo andino poblado por seres mitológicos como el Ichic Olco, el Chacho y el Supay.',
      theme: 'Mitología peruana, astucia, coraje',
      driveLink: 'https://drive.google.com/drive/folders/19o4BlSQTLX6UyL_IzZB1aaRRNgscs5lP?usp=sharing'
    },
    {
      id: '6',
      title: 'Warma Kuyay (Amor de niño)',
      author: 'José María Arguedas',
      category: 'B',
      grades: '3.° y 4.° de Primaria',
      genre: 'Cuento Indigenista',
      description: 'Un tierno pero nostálgico relato sobre el primer amor infantil de Ernesto en el contexto de una hacienda andina.',
      theme: 'Primer amor, ternura, conflicto social',
      driveLink: 'https://drive.google.com/drive/folders/19o4BlSQTLX6UyL_IzZB1aaRRNgscs5lP?usp=sharing'
    },
    // Categoría C
    {
      id: '7',
      title: 'El Caballero Carmelo',
      author: 'Abraham Valdelomar',
      category: 'C',
      grades: '5.° y 6.° de Primaria',
      genre: 'Cuento Criollista',
      description: 'La entrañable y emotiva historia de un viejo y valiente gallo de pelea que debe defender el honor de la familia en una última lid en Pisco.',
      theme: 'Honor, nobleza familiar, vejez, valentía',
      driveLink: 'https://drive.google.com/drive/folders/19o4BlSQTLX6UyL_IzZB1aaRRNgscs5lP?usp=sharing'
    },
    {
      id: '8',
      title: 'El vuelo de los cóndores',
      author: 'Abraham Valdelomar',
      category: 'C',
      grades: '5.° y 6.° de Primaria',
      genre: 'Cuento Costumbrista',
      description: 'Un niño de Pisco presencia las hazañas del circo y desarrolla una profunda compasión por Orfilia, la pequeña trapecista que sufre un accidente.',
      theme: 'Compasión, dolor infantil, solidaridad, amistad',
      driveLink: 'https://drive.google.com/drive/folders/19o4BlSQTLX6UyL_IzZB1aaRRNgscs5lP?usp=sharing'
    },
    {
      id: '9',
      title: 'Los gallinazos sin plumas',
      author: 'Julio Ramón Ribeyro',
      category: 'C',
      grades: '5.° y 6.° de Primaria',
      genre: 'Realismo Urbano',
      description: 'Efraín y Enrique son obligados por su desalmado abuelo don Santos a recolectar comida en los basurales limeños para alimentar al cerdo Pascual.',
      theme: 'Abuso infantil, fraternidad, supervivencia urbana',
      driveLink: 'https://drive.google.com/drive/folders/19o4BlSQTLX6UyL_IzZB1aaRRNgscs5lP?usp=sharing'
    }
  ];

  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === 'ALL' || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.theme.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Imposing, visually rich Drive access section */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#1A365D] via-[#111827] to-[#1A365D] text-white p-8 sm:p-10 border border-white/10 shadow-2xl">
        {/* Abstract design elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.12),transparent)] pointer-events-none"></div>
        <div className="absolute left-1/3 top-1/4 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-3xl space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-600 text-white border border-emerald-500/30 shadow-sm animate-pulse">
              <FolderOpen className="w-3.5 h-3.5" />
              REPOSITORIO COMPARTIDO DISPONIBLE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight leading-tight">
              Carpeta de Bibliografía Oficial <br/>
              <span className="text-natural-accent font-normal italic">"El Perú Lee" 2026</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
              Accede directamente al espacio en la nube preparado para la comunidad docente de la <strong>I.E.P.M. N° 24009 "Túpac Amaru II"</strong>. Contiene lecturas obligatorias digitalizadas, antologías oficiales de comprensión lectora, y guías de aplicación curricular descargables.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3 max-w-lg">
              <div className="bg-red-600/20 text-red-400 p-2.5 rounded-xl shrink-0">
                <Sparkles className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-xs text-slate-300 font-light leading-normal">
                Puedes abrir el enlace en tu celular o computadora para descargar las lecturas completas directamente a tus diapositivas o material de clase.
              </p>
            </div>
          </div>
          
          <div className="shrink-0">
            <a
              href="https://drive.google.com/drive/folders/19o4BlSQTLX6UyL_IzZB1aaRRNgscs5lP?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-sm px-8 py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-red-500/40 cursor-pointer"
            >
              <FolderOpen className="w-5 h-5" />
              <span>INGRESAR AL DRIVE DE LECTURAS</span>
              <ArrowUpRight className="w-4 h-4 opacity-80" />
            </a>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-natural-border rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-natural-secondary mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Filtrar por:
            </span>
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === 'ALL'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-slate-50 text-natural-secondary border-natural-border hover:bg-slate-100'
              }`}
            >
              Todas las Lecturas
            </button>
            <button
              onClick={() => setSelectedCategory('A')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === 'A'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-slate-50 text-natural-secondary border-natural-border hover:bg-slate-100'
              }`}
            >
              Categoría A (1° y 2°)
            </button>
            <button
              onClick={() => setSelectedCategory('B')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === 'B'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-slate-50 text-natural-secondary border-natural-border hover:bg-slate-100'
              }`}
            >
              Categoría B (3° y 4°)
            </button>
            <button
              onClick={() => setSelectedCategory('C')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === 'C'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-slate-50 text-natural-secondary border-natural-border hover:bg-slate-100'
              }`}
            >
              Categoría C (5° y 6°)
            </button>
          </div>

          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por título, autor o tema..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-natural-border text-xs focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div 
            key={book.id} 
            className="bg-white rounded-3xl border border-natural-border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Header portion with category-based top bar */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase ${
                  book.category === 'A' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
                    : book.category === 'B' 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/50' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200/50'
                }`}>
                  CATEGORÍA {book.category}
                </span>
                <span className="text-[11px] font-semibold text-natural-secondary">
                  {book.grades}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-serif font-extrabold text-natural-text leading-tight hover:text-red-700 transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs font-semibold text-red-600 italic">
                  Autor: {book.author}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                    {book.genre}
                  </span>
                </div>
                <p className="text-xs text-natural-secondary font-light leading-relaxed">
                  {book.description}
                </p>
              </div>

              <div className="pt-2 border-t border-natural-border">
                <span className="text-[10px] font-bold text-natural-text uppercase tracking-wide block mb-1">Ejes Temáticos:</span>
                <p className="text-xs text-natural-secondary font-light italic">
                  {book.theme}
                </p>
              </div>
            </div>

            {/* Actions segment */}
            <div className="p-5 bg-slate-50 border-t border-natural-border flex gap-3">
              <a
                href={book.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-white hover:bg-red-50 text-red-700 border border-red-200 hover:border-red-300 font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Abrir Carpeta</span>
              </a>
              <a
                href={`https://www.google.com/search?q=Guia+de+lectura+y+comprension+${encodeURIComponent(book.title + ' ' + book.author)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1A365D] hover:bg-[#2B6CB0] text-white font-bold text-xs py-2.5 px-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="Buscar Guías de Comprensión"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Guía</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Empty search fallback */}
      {filteredBooks.length === 0 && (
        <div className="text-center py-12 bg-white border border-natural-border rounded-3xl">
          <Book className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-natural-text">No se encontraron lecturas que coincidan con la búsqueda.</p>
          <p className="text-xs text-natural-secondary mt-1">Intente buscar con otros términos o cambie el filtro de categoría.</p>
        </div>
      )}

    </div>
  );
}
