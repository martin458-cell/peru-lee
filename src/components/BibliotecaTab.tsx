import React, { useState, useMemo } from 'react';
import { 
  Book, 
  FolderOpen, 
  ExternalLink, 
  Search, 
  Sparkles, 
  Filter, 
  FileText, 
  ArrowUpRight, 
  Download, 
  BookOpen, 
  Compass, 
  Tag, 
  Info, 
  CheckCircle, 
  HelpCircle 
} from 'lucide-react';

interface BookItem {
  title: string;
  driveId: string;
  grade: number;
}

// Full real database from official "Perú Lee" program
const RAW_BOOKS_DATA: Record<number, [string, string][]> = {
  1: [
    ["A mi perro", "1E5WxU3IrGvEOulMO2PCZC2iSEvhy9E2v"],
    ["Antes, muy antes", "1yDfUDtYE8pxY3gvMdxy7R4GdEUCgZM-5"],
    ["Desde mi ventana", "1FP8OrIXJpRCRkg3S1AfjIBj19tklbfYj"],
    ["El muqui", "123vO25fT4jjGNk-yYK-UygoYvNtyrBkk"],
    ["El viaje al cielo", "1GkqMnp3MqCyHqAVhWZokXBmJf0q2evI6"],
    ["El zorro enamorado de la luna", "1FyMjbqYT9UfQ7v3um6Xs5t_taTeru5hn"],
    ["Intimpa, árbol del sol", "1SKDIQ2CqTx49hepyPsuiY73z96tUSXt1"],
    ["La abuela Micaela", "1npBBPBzPUPzH7r-W4EIn5Hi_GxidZZv9"],
    ["La fiesta de Tanta Wawas", "1mLEN5xc7U8bMCc8DZhXSywXiMgeM2f_M"],
    ["Mi alpaca Kusi", "1eas9x_-E7zpRpIoVSiPnnMPRU2yBT4_P"],
    ["Mi mantita linda", "1p7zPXCBRA_cjSeJmcYk9hfOWTW2qOJYI"],
    ["Nunash, la bella durmiente", "1yBrBh-P8hd6Jzf3AGSY4YOz8qypKVYfR"]
  ],
  2: [
    ["Antes, muy antes", "1_GCfMg7kCmWN9oX-NGrLp8qxPfKkwjkO"],
    ["Dos abejas amigas", "1EtO5hmSZnOkbxi85j53tPPwqVm5RLryV"],
    ["El agua", "1VIR-lj7pggiNEfe5nwgWXLuuj102UshY"],
    ["El muqui", "14LHYLl-8R8TersLllHtqfJYAJxiZAaGw"],
    ["El viaje al cielo", "1F9UOr2jGRISLdkAFNauLZdl39SIxF1HI"],
    ["El zorro enamorado de la luna", "1w16BsxIKmctpN1N77zXNADRIgSe2GuJf"],
    ["Intimpa, árbol del sol", "1veZXlmF_HV-R_psHoNqUSJNVC_dm7qsb"],
    ["La abuela Micaela", "1XYW5NQO3BDKFUIE44rhcGWQoo1scOFJj"],
    ["La cometa atascada", "1bbTGIccvBsKkK8qJAvwlR5tuifMFIVFF"],
    ["La fiesta de Tanta Wawas", "1ipVcM6dzMXkox4alWVMxMLhG1HTPXqMw"],
    ["La pachamanca", "1dKkEh0n1PIZKKRwMGe189EUKQsTwo0_J"],
    ["Mi mantita linda", "1V1RHz0U4bz6023eDANHpBMwXJuyvbT-z"],
    ["Nunash, la bella durmiente", "1jaaq5dVclXEEkU15f499AdzLwCyje7e8"],
    ["Vacaciones diferentes", "1mi7E5G09I1xzUSbVFCfb8h8bD1vnimq9"],
    ["Viringo, el perro sin pelo del Perú", "1tTCPwknmz6ebFPGv2z01w8M9vYQlU9rZ"]
  ],
  3: [
    ["Antiguamente en el monte los animales, las plantas y otros seres eran gente (naciones shipibo y uitoto)", "18PR1E1N3POmHXyRlgNy4iXhlte_JWr7H"],
    ["Daniela", "1GCPlqAeH12aIWZ6__a07uHo-l5mvhGVB"],
    ["El alfarero rebelde", "1ZDMGYwLdQ7xcJyODTSeNBkDXn3ecIDA3"],
    ["El muqui", "1KFPd6LpTmakmg_db2yiheRzkbqZY4f1D"],
    ["El nuevo comienzo", "1nRKjjKHfl1zsXfTjXX2KcvNMRo0CbTLo"],
    ["El pájaro Pauca", "1X2og7a1MdAlDKdaa2ExbPHgK1BgSjfSg"],
    ["El pastorcillo mentiroso", "1kKgpMJPKAVsKbbzzzV58ToXkie44xVCm"],
    ["El viaje al cielo", "1bjGt-V5kksL41w52TSEvC2ijiWTPFgRJ"],
    ["El zorro enamorado de la luna", "19sA9grE2TaIRQ6bPKqFc2jYgDb-AlvXk"],
    ["Failoc, el mar caliente de Lambayeque", "16xW2HUIdF22T5CMjWrazxP2p6r-CmSpN"],
    ["Intimpa, árbol del sol", "1P26nliv3XJLn6R8WVZT8E_XpfzpBsl2o"],
    ["La achirana del Inca", "1WXaT5YpENASMEYxvGGPAHPPtTo-U9uzp"],
    ["La boca como nido", "1NbmHz6t7U545nI6_P6z8k8g6RCQS3nYR"],
    ["La energía", "1d4QawcPdWtcHUG4E76NTMhaRZemOGVBM"],
    ["La nube viajera", "1UxzOLuOBzUTwIQn43B4smscOMb_mbR3U"],
    ["La puya", "1ML-7rQs66qE_M86KF2_eFHSmg9cl7PAL"],
    ["Mi papá superhéroe", "17sbaC2_VlWFt8GTH3jZZGNp7yXKwTqam"],
    ["Nuevos amigos", "1AGJkSin_2KA_j5IbXkJkWsHwLGjDgpUk"],
    ["Nunash, la bella durmiente", "19PJlnbvKwBYklM5UgHb4pJxxKcDQfzzO"],
    ["Plantas para cuidar", "19n9J0iYa1BlTXPaMmW7yr7BpiCin4WgD"],
    ["Dédalo e Ícaro", "1TxAYS_A8d_AAmuDe0qAoB9wV3R3_YWZ0"]
  ],
  4: [
    ["Antiguamente en el monte los animales, las plantas y otros seres eran gente (naciones shipibo y uitoto)", "1se9F52oKQpyKR_ej9KWiGBXCgoAh3O2a"],
    ["El agua en el planeta", "1KkgmzpkCDBsGucNWHWAhu8goS8H6eVWk"],
    ["El alfarero rebelde", "1XDBIfIveo_ZYBOpUzAZ_CFK3dG7eAkYN"],
    ["El balance trágico de marzo del fenómeno de El Niño en Piura", "1x3b789VK0DxzTSqvrhCmUkIxV08mOeWK"],
    ["El muqui", "1Inj70Vt6uL0eMj9ERdmFZQHIHpPLmLO-"],
    ["El oasis de Huacachina", "1rQi3WqYdkywypcdOyyCU5xhleTTjbRIY"],
    ["El viaje al cielo", "1Nb1YOPyhCCVzRMJhEQvO4MXIRdEpP5uF"],
    ["El zorro enamorado de la luna", "1cPNVk4U1nh2hyr2ctezuUi3w3na_J6v-"],
    ["Intimpa, árbol del sol", "1kWdUbegZg3SE0hYW_EJV5KLQ41kO-5N2"],
    ["La bruja Maruja", "15VZjdc91S7OdUn_4trW_dR2px4a5OlPL"],
    ["La festividad del Señor de los Milagros", "1MNn1GYRx__PChAsb5NH-P5H0gzTBikhx"],
    ["La leyenda del Chogui", "1fcBSnbTC-GdnsQQP5L1SNSSgh_-X6S7D"],
    ["La megalópolis", "1tiRSA-k58neHFteYPNFP-0k36s9gKmw4"],
    ["Lari Lari", "1HLPCm4B8mO5mvGTWb_nflOhd1wwQWuBw"],
    ["Nunash, la bella durmiente", "1xVTfU5NqiM6jWxRmj2oaM1Y-1tazk4UB"],
    ["Piel húmeda", "1it-GsCJ3UDiKA14Mmo_f7-05VbxaAW7I"],
    ["Una visita a la ciudad de Caral", "1Nqx3LnjiKfVvCV7RI3OYAMF2tVN9nozQ"]
  ],
  5: [
    ["Algo me está sucediendo", "1u6nDOVZeNRmBEOf8eKCtsmExwzMtu5-j"],
    ["Antiguamente en el monte los animales, las plantas y otros seres eran gente (naciones shipibo y uitoto)", "1ZG0gkGyEU2uDtcY_mUUIa1FrDt79YrDV"],
    ["Día del Niño: ¿cuál es el origen de esta celebración?", "1sTcJE29SeOHJ82Ral1ZTuL0mr-ODRJkI"],
    ["El alfarero rebelde", "1JLXC-c2CXOhGY4AUbAqnXu0ZWj36xo6d"],
    ["El cuento que perdió su título", "1PM7GjydmBCzDGcjoXwypLbu6qvn45FrJ"],
    ["El momento de conocernos", "1pe0LP1J-is7zJhmpJbXBp0Anb1Yf3iwX"],
    ["El mono choro, en la lista de primates en mayor peligro en el mundo", "1KXzrr0Sy_LxYRxtxa0OndExX15tJuQBX"],
    ["El valle de Alto Mayo", "1O36X4tDqnWst7ocxDPqF80QioqSf_tCz"],
    ["El viaje al cielo", "1pzdAyseXeBCcru86J1N_A1DT1g_rwbXk"],
    ["Hay 64 especies en peligro de extinción en el Perú", "1EbyYD2QPG1fFv8dUiF9MN39Wyuf7gw98"],
    ["José Abelardo Quiñones Gonzales", "1URkkGTlaUY4QDQZGVTZFo-7uLrAyFoVU"],
    ["José María Eguren Rodríguez", "1O2scDpgEIpkq3-YStIVwx0Mh0u-6Wac6"],
    ["La bella durmiente", "1MTB9hGMSBLvMYUq-QgPURjBw-qGVleut"],
    ["La cultura awajún y el consumo sostenible", "15DNnBWmYd_gdvA3yIzC8uajGAqXU55__"],
    ["La diversidad cultural del Perú: cuestión de reflexión", "14HVBM2HDMRmYMmPF9AWT8sQkHts0iCnj"],
    ["La leyenda de los colibríes de Nasca", "1fvvOt3JD9TaEzFIjXQpLyYLsYnL8NMP0"],
    ["La televisión: la historia del movimiento de la imagen", "1ya_QgixUkg2ew6qrJn_WJPW4gMOoWrK2"],
    ["Las abejas", "1rfpg_ufAiAt9vYJvMJ4jTf7oex-979uL"],
    ["Machu Picchu", "1oOOVvgf0m5tLLk34kYFSW0i5EqwoQAkK"],
    ["Mario Florián", "1DS22V0w15ZVstwNfHIhG0r36TWOLtdT2"],
    ["Oso silvestre del Perú: una especie que debemos salvar", "1dI5P7v3AXbPf29l6v_6YfK2h2OaPlYAo"],
    ["Parque Nacional Huascarán", "1imyTW3Q1XU0s3LFbRTUPAJzFEUP2yVZb"],
    ["Todos unidos contra el dengue", "1DfSPUKlzRRVCEu0gePJyiSy7G5W6DG1g"],
    ["¿Qué son las legumbres?", "1GjPZ7cm0Z4Eq8vWM6QdZrEyq3wxo_z4X"]
  ],
  6: [
    ["Abejas en peligro de extinción", "1vIjboqc8EXeAzMZzfeybeHEJklurvR8e"],
    ["Algo muy grave va a suceder en este pueblo", "1B38fHQicu8v2HAiFdz430k9rjCAgQWLL"],
    ["Antiguamente en el monte los animales, las plantas y otros seres eran gente (naciones shipibo y uitoto)", "1AWBZMSNFl2axkSSm8559eXlC1WuIfYOF"],
    ["Aracely Quispe, la peruana que nació en un pueblo sin electricidad y ahora es ingeniera de la NASA", "1kSKttr4N9qsYL6eJRqAZtR5SHDZjmH-U"],
    ["Crónica de un viaje por el sur del Perú 2014 (Mario Ramos Melgar)", "10HScXKxOjbtDq21mFSy-msJ3zsBobTSO"],
    ["El alfarero rebelde", "1IqDC-WQfK10nZHECOrJIzXwIzzvdBFbM"],
    ["El reino Chimú", "1R04iSf0KCjR9p6VD2G4OYH3KIZzaits-"],
    ["El superpoder de este joven peruano es limpiar lagunas contaminadas", "1cWbZchYhxoN-KDnxXfhYcJ9bLblYf4Qs"],
    ["El viaje al cielo", "1KHEck8LH6jkHGJfM5aW3ldeqPSMCjVCn"],
    ["El zorro y el cuy", "1TV4FUeyFvlgdEtF_Z93O1rb9Mjzk65wZ"],
    ["Escribimos una crónica para dar a conocer un lugar del Perú", "1XLfOVkHD2-EBJDOXpgJh8uxH7JfgdTb1"],
    ["Esta idea peruana trascenderá en el mundo: galletas contra la anemia ganó concurso de History Channel", "1Mi1RUV-K5-APhZThtRxWoLfeYo_rkzp6"],
    ["La contaminación del aire", "1khpNxXmFCEx-ZHlIMhjNbaxfn-YqssWw"],
    ["La contaminación, un problema urgente para el planeta", "1k9dGQE0xG4efCPwoo5-vNWWCTmUY_pHH"],
    ["La explotación de los recursos naturales", "1qKaUsirYEYXWv4MF7EF7AOOWaZzdVU-l"],
    ["La extinción de las abejas: un fenómeno que amenaza al ecosistema", "1ULXv8MvWu9qcV2AByNJ00baHeRtsOLuF"],
    ["La Libertad: proponen reforestar algarrobos y proteger al cañán, animal en extinción", "1tyomRnigOguq9IxQQdV3C2RBYbzvPsIs"],
    ["Los cambios en la adolescencia", "10CC9uxp5POZ96QoCBFAwPeON3k6RH-Aw"],
    ["Los dos pueblos", "1wyt0AtBniyUZWXy6WyjhrWUP4lkeSzbZ"],
    ["Mejoramos la vida con ciencia y tecnología", "1kxAraoE-d1WV1dFmRvDznVYfOgthzyHb"],
    ["Significado de ecosistema", "1uCqWQt8s4JlExCmFSJaGyv3t1n_wsUDs"],
    ["Tránsito entre dos mundos", "1onjxUykw7OYvHHFkA7bGziGDKRZWHq75"]
  ]
};

// Flatten the raw book database with helper properties
const ALL_BOOKS: BookItem[] = [];
Object.entries(RAW_BOOKS_DATA).forEach(([gradeStr, list]) => {
  const grade = parseInt(gradeStr, 10);
  list.forEach(([title, driveId]) => {
    ALL_BOOKS.push({ title, driveId, grade });
  });
});

// Configure color mapping and aesthetic parameters per grade
const GRADE_METADATA: Record<number, {
  label: string;
  category: 'A' | 'B' | 'C';
  catLabel: string;
  badgeBg: string;
  badgeText: string;
  accentColor: string;
  accentSoft: string;
  dotColor: string;
}> = {
  1: { 
    label: "1.° Grado", 
    category: 'A', 
    catLabel: "Categoría A (1° y 2°)", 
    badgeBg: "bg-red-50 hover:bg-red-100/70", 
    badgeText: "text-red-700", 
    accentColor: "border-l-[4px] border-l-[#b5534a]", 
    accentSoft: "rgba(181, 83, 74, 0.08)",
    dotColor: "#b5534a"
  },
  2: { 
    label: "2.° Grado", 
    category: 'A', 
    catLabel: "Categoría A (1° y 2°)", 
    badgeBg: "bg-orange-50 hover:bg-orange-100/70", 
    badgeText: "text-orange-700", 
    accentColor: "border-l-[4px] border-l-[#c97a3d]", 
    accentSoft: "rgba(201, 122, 61, 0.08)",
    dotColor: "#c97a3d"
  },
  3: { 
    label: "3.° Grado", 
    category: 'B', 
    catLabel: "Categoría B (3° y 4°)", 
    badgeBg: "bg-amber-50 hover:bg-amber-100/70", 
    badgeText: "text-amber-800", 
    accentColor: "border-l-[4px] border-l-[#ad8b1e]", 
    accentSoft: "rgba(173, 139, 30, 0.1)",
    dotColor: "#ad8b1e"
  },
  4: { 
    label: "4.° Grado", 
    category: 'B', 
    catLabel: "Categoría B (3° y 4°)", 
    badgeBg: "bg-emerald-50 hover:bg-emerald-100/70", 
    badgeText: "text-emerald-700", 
    accentColor: "border-l-[4px] border-l-[#4c7a52]", 
    accentSoft: "rgba(76, 122, 82, 0.08)",
    dotColor: "#4c7a52"
  },
  5: { 
    label: "5.° Grado", 
    category: 'C', 
    catLabel: "Categoría C (5° y 6°)", 
    badgeBg: "bg-blue-50 hover:bg-blue-100/70", 
    badgeText: "text-blue-700", 
    accentColor: "border-l-[4px] border-l-[#3e6e8e]", 
    accentSoft: "rgba(62, 110, 142, 0.08)",
    dotColor: "#3e6e8e"
  },
  6: { 
    label: "6.° Grado", 
    category: 'C', 
    catLabel: "Categoría C (5° y 6°)", 
    badgeBg: "bg-purple-50 hover:bg-purple-100/70", 
    badgeText: "text-purple-700", 
    accentColor: "border-l-[4px] border-l-[#7b5c82]", 
    accentSoft: "rgba(123, 92, 130, 0.08)",
    dotColor: "#7b5c82"
  }
};

export default function BibliotecaTab() {
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Normalize string for fuzzier searches (handling accents)
  const norm = (s: string) => {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const filteredBooks = useMemo(() => {
    const q = norm(searchTerm.trim());
    return ALL_BOOKS.filter((book) => {
      // Grade filter
      if (selectedGradeFilter !== 'all' && String(book.grade) !== selectedGradeFilter) {
        return false;
      }
      // Query filter
      if (q) {
        const titleNormalized = norm(book.title);
        const gradeMetadata = GRADE_METADATA[book.grade];
        const categoryLabel = gradeMetadata ? norm(gradeMetadata.catLabel) : "";
        const gradeLabel = gradeMetadata ? norm(gradeMetadata.label) : "";

        return titleNormalized.includes(q) || 
               categoryLabel.includes(q) || 
               gradeLabel.includes(q);
      }
      return true;
    });
  }, [selectedGradeFilter, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: ALL_BOOKS.length,
      grade1: RAW_BOOKS_DATA[1]?.length || 0,
      grade2: RAW_BOOKS_DATA[2]?.length || 0,
      grade3: RAW_BOOKS_DATA[3]?.length || 0,
      grade4: RAW_BOOKS_DATA[4]?.length || 0,
      grade5: RAW_BOOKS_DATA[5]?.length || 0,
      grade6: RAW_BOOKS_DATA[6]?.length || 0,
    };
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Dynamic Aesthetic Hero Card with Shared Drive Link */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#12233f] via-[#1a365d] to-[#12233f] text-white p-8 sm:p-10 border border-slate-700/40 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.12),transparent)] pointer-events-none"></div>
        <div className="absolute left-1/4 top-1/4 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-1/4 bottom-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white border border-red-500/20 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              PLAN LECTOR OFICIAL "EL PERÚ LEE"
            </span>
            
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold tracking-tight leading-tight">
              Catálogo de Lecturas del Plan Lector <br/>
              <span className="text-slate-300 font-normal italic text-2xl sm:text-3xl">Por Grados, con Acceso Digital</span>
            </h2>
            
            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
              Índice interactivo de cuentos, leyendas, fábulas y textos de comprensión lectora, organizados rigurosamente de <strong>1.° a 6.° grado de primaria</strong> para la comunidad docente de la I.E.P.M. N° 24009 "Túpac Amaru II". 
            </p>

            {/* Quick tips about integration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="bg-white/5 border border-white/15 rounded-xl p-3 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 leading-normal font-light">
                  <strong>Lectura Rápida:</strong> Haz clic en <span className="font-semibold text-white">Leer</span> para abrir el lector oficial en Google Drive.
                </p>
              </div>
              <div className="bg-white/5 border border-white/15 rounded-xl p-3 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 leading-normal font-light">
                  <strong>Descarga Directa:</strong> Haz clic en <span className="font-semibold text-white">Descargar</span> para descargar el PDF y guardarlo.
                </p>
              </div>
            </div>
          </div>
          
          <div className="shrink-0 flex flex-col items-center sm:items-start gap-3 bg-white/5 p-6 rounded-2xl border border-white/10 max-w-sm">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-red-500" />
              <span className="text-xs font-bold tracking-wide uppercase text-slate-200">Carpeta Raíz Drive</span>
            </div>
            <p className="text-xs text-slate-400 font-light leading-snug">
              ¿Deseas explorar los directorios de Plan Lector directamente en la nube?
            </p>
            <a
              href="https://drive.google.com/drive/folders/19o4BlSQTLX6UyL_IzZB1aaRRNgscs5lP?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full text-center bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-3 px-5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Abrir Drive Completo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Control Panel: Grade Selector & Live Search */}
      <div className="bg-white border border-natural-border rounded-2xl p-6 shadow-sm space-y-6">
        
        {/* Responsive Grade Filters */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-natural-secondary flex items-center gap-2 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-red-600" />
            Navegar por Grado de Primaria:
          </label>
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedGradeFilter('all')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                selectedGradeFilter === 'all'
                  ? 'bg-red-600 text-white border-red-600 shadow-md'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white border border-red-400"></span>
              Todos los Grados
              <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] bg-slate-200/50 text-slate-800 font-black">
                {stats.total}
              </span>
            </button>

            {[1, 2, 3, 4, 5, 6].map((gradeNum) => {
              const meta = GRADE_METADATA[gradeNum];
              const count = RAW_BOOKS_DATA[gradeNum]?.length || 0;
              const isSelected = selectedGradeFilter === String(gradeNum);
              
              return (
                <button
                  key={gradeNum}
                  onClick={() => setSelectedGradeFilter(String(gradeNum))}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    isSelected
                      ? 'text-white border-transparent shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  style={isSelected ? { backgroundColor: meta.dotColor } : {}}
                >
                  <span 
                    className="w-2 h-2 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: isSelected ? '#ffffff' : meta.dotColor }}
                  ></span>
                  {meta.label}
                  <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/50 text-slate-800'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search tool with clear button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar lectura por título (ej. Paco Yunque, El bagrecico, El muqui...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-slate-50/50 placeholder-slate-400 font-medium text-slate-800"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-red-600 px-1 py-0.5"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <span>Resultados: </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-black font-mono">
              {filteredBooks.length} de {stats.total}
            </span>
          </div>
        </div>

      </div>

      {/* Book Catalog Section */}
      <div className="space-y-6">
        
        {/* List filtered results grouped by category or simple clean grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBooks.map((book, index) => {
              const meta = GRADE_METADATA[book.grade];
              const viewUrl = `https://drive.google.com/file/d/${book.driveId}/view`;
              const dlUrl = `https://drive.google.com/uc?export=download&id=${book.driveId}`;
              const googleSearchUrl = `https://www.google.com/search?q=Guia+de+lectura+y+comprension+${encodeURIComponent(book.title)}`;

              return (
                <div 
                  key={`${book.driveId}-${index}`}
                  className={`bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] transition-all flex flex-col justify-between ${meta.accentColor}`}
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Header tags */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full uppercase ${meta.badgeBg} ${meta.badgeText}`}>
                        {meta.label}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {meta.category === 'A' ? 'Lectores Iniciales' : meta.category === 'B' ? 'Lectores Intermedios' : 'Lectores Avanzados'}
                      </span>
                    </div>

                    {/* Book title and default author indicator */}
                    <div className="space-y-1.5">
                      <h3 className="text-base font-serif font-extrabold text-slate-900 leading-snug">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Plan Lector · PDF Oficial
                      </p>
                    </div>

                    {/* Quick description of how to use inside of this application */}
                    <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1">
                      <span className="text-[9px] font-bold text-red-600 uppercase tracking-wide flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        Acceso Rápido
                      </span>
                      <p className="text-[11px] text-slate-500 leading-normal font-light">
                        Guía pedagógica disponible. Puedes utilizar el título en la <strong className="text-slate-700">Calculadora</strong> para configurar tus evaluaciones.
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Action bar with custom brand links */}
                  <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                    <a
                      href={viewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-white hover:bg-red-50 text-red-700 border border-red-200 hover:border-red-300 font-bold text-xs py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Leer</span>
                    </a>
                    
                    <a
                      href={dlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-[#1e293b] hover:bg-[#0f172a] text-white font-bold text-xs py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar</span>
                    </a>

                    <a
                      href={googleSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white hover:bg-slate-100 text-slate-500 border border-slate-200 p-2.5 rounded-lg transition-all flex items-center justify-center"
                      title="Buscar guías y fichas adicionales en Google"
                    >
                      <FileText className="w-4 h-4 text-slate-500" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Filter State */
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-bold text-slate-800">
                No se encontraron lecturas que coincidan con la búsqueda.
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No se encontraron coincidencias para "{searchTerm}". Prueba buscando por palabras clave o seleccionando un grado específico arriba.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedGradeFilter('all');
                setSearchTerm('');
              }}
              className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100/80 px-4 py-2 rounded-xl transition-all"
            >
              Restablecer Filtros
            </button>
          </div>
        )}

      </div>

      {/* Helpful educational info box */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 flex flex-col sm:flex-row items-start gap-4">
        <div className="bg-red-50 text-red-600 p-2.5 rounded-xl shrink-0">
          <Info className="w-5 h-5 text-red-600" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
            ¿Cómo integrar la biblioteca digital con tu Planificación Curricular?
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed font-light">
            Las lecturas que ves en esta biblioteca pertenecen al programa nacional <strong className="text-slate-700">"El Perú Lee"</strong>. Al seleccionar cualquier lectura y abrirla en Drive, puedes asignar la ficha correspondiente en el aula. Utiliza la pestaña <strong className="text-slate-700">"Guía Pedagógica PDF"</strong> o la pestaña <strong className="text-slate-700">"Categorías"</strong> para evaluar el progreso y registrar las valoraciones de los estudiantes en nuestro sistema integrado.
          </p>
        </div>
      </div>

    </div>
  );
}
