export interface Student {
  fullname: string;
  dni: string;
  age: string;
  grade: string;
  section: string;
  parentName: string;
  parentDni: string;
  parentRel: string;
}

export interface FichaRecord {
  id: string;
  category: string;
  ieName: string;
  ieModular: string;
  ieDre: string;
  ieUgel: string;
  ieGestion: string;
  ieRegion: string;
  ieProvincia: string;
  ieDistrito: string;
  ieDireccion: string;
  workTitle: string;
  workLang: string;
  workLink: string;
  docName: string;
  docDni: string;
  docSpec: string;
  docCell: string;
  docEmail: string;
  students: Student[];
  createdAt: string;
}

export interface EvaluationRecord {
  id: string;
  studentName: string;
  category: string;
  scores: number[];
  desafioScores: number[];
  totalProductRaw: number;
  maxProductRaw: number;
  finalScorePercent: number;
  level: string;
  createdAt: string;
}
