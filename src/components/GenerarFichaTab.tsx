import React, { useState, useEffect } from 'react';
import { FileText, Save, Download, Printer, User, Building, BookMarked, HelpCircle, ChevronDown, CheckCircle, Cloud, ExternalLink } from 'lucide-react';
import { Student } from '../types';
import { getOrCreateFolder, uploadFileToGoogleDrive, syncSingleFichaToGoogleSheet } from '../lib/googleDriveSheets';

interface GenerarFichaProps {
  onShowToast: (msg: string) => void;
  onRefreshHistory: () => void;
  initialFichaToLoad?: any;
  isAdmin: boolean;
  googleToken?: string | null;
  googleSpreadsheetId?: string | null;
  googleUser?: any;
  onGoogleLogin?: () => void;
}

export default function GenerarFichaTab({ 
  onShowToast, 
  onRefreshHistory, 
  initialFichaToLoad, 
  isAdmin,
  googleToken,
  googleSpreadsheetId,
  googleUser,
  onGoogleLogin
}: GenerarFichaProps) {
  // Tabs accordions state
  const [activeAccordion, setActiveAccordion] = useState<string>('work');

  // Form states
  const [category, setCategory] = useState<string>('C');
  const [ieName, setIeName] = useState('I.E.P.M. N° 24009 Túpac Amaru II');
  const [ieModular, setIeModular] = useState('0361493');
  const [ieDre, setIeDre] = useState('Ayacucho');
  const [ieUgel, setIeUgel] = useState('UGEL Lucanas');
  const [ieGestion, setIeGestion] = useState('Pública EBR');
  const [ieRegion, setIeRegion] = useState('Ayacucho');
  const [ieProvincia, setIeProvincia] = useState('Lucanas');
  const [ieDistrito, setIeDistrito] = useState('Puquio');
  const [ieDireccion, setIeDireccion] = useState('Jr. Andamarca S/N');

  const [workTitle, setWorkTitle] = useState('');
  const [workLang, setWorkLang] = useState('');
  const [workLink, setWorkLink] = useState('');

  const [docName, setDocName] = useState('');
  const [docDni, setDocDni] = useState('');
  const [docSpec, setDocSpec] = useState('');
  const [docCell, setDocCell] = useState('');
  const [docEmail, setDocEmail] = useState('');

  // Dynamic students list
  const [students, setStudents] = useState<Student[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loadedId, setLoadedId] = useState<string | null>(null);

  const isReadOnly = !!loadedId && !isAdmin;

  const [isUploadingDrive, setIsUploadingDrive] = useState(false);
  const [driveFileLink, setDriveFileLink] = useState<string | null>(null);

  const saveWordToGoogleDrive = async () => {
    if (!googleToken) {
      if (onGoogleLogin) {
        onGoogleLogin();
      } else {
        onShowToast("Por favor, conecta primero tu cuenta de Google.");
      }
      return;
    }

    setIsUploadingDrive(true);
    setDriveFileLink(null);
    try {
      // 1. Get or create folder
      onShowToast("Obteniendo o creando carpeta 'Expedientes Ficha Anexo 1' en Google Drive...");
      const folderId = await getOrCreateFolder(googleToken, "Expedientes Ficha Anexo 1");

      // 2. Generate file blob
      const template = getDocXml();
      const blob = new Blob([template], { type: "application/msword" });
      const filename = `Anexo1_Ficha_Inscripcion_${category}_${workTitle.slice(0, 25).replace(/\s+/g, '_') || 'Ficha'}.doc`;

      // 3. Upload file
      onShowToast("Subiendo archivo Word (.doc) a Google Drive...");
      const fileData = await uploadFileToGoogleDrive(googleToken, folderId, filename, "application/msword", blob);

      setDriveFileLink(fileData.webViewLink);
      onShowToast("¡Documento guardado con éxito en tu Google Drive!");
    } catch (err: any) {
      console.error(err);
      onShowToast("Error al guardar en Google Drive: " + err.message);
    } finally {
      setIsUploadingDrive(false);
    }
  };

  const handleClearForm = () => {
    setLoadedId(null);
    setDriveFileLink(null);
    setWorkTitle('');
    setWorkLang('');
    setWorkLink('');
    setDocName('');
    setDocDni('');
    setDocSpec('');
    setDocCell('');
    setDocEmail('');
    
    const studentCount = category === 'A' ? 1 : 3;
    const defaultStudents = Array(studentCount).fill(null).map((_, i) => ({
      fullname: '',
      dni: '',
      age: '',
      grade: category === 'A' 
        ? `${i + 1}.er Grado de Primaria` 
        : category === 'B' 
          ? `${3 + Math.floor(i/2)}.er Grado de Primaria` 
          : category === 'C'
            ? `${5 + Math.floor(i/2)}.to Grado de Primaria`
            : `Grado Secundaria`,
      section: '',
      parentName: '',
      parentDni: '',
      parentRel: 'Padre/Madre'
    }));
    setStudents(defaultStudents);
    onShowToast("Formulario limpiado para un nuevo registro.");
  };

  const handleDuplicateForEdit = () => {
    setLoadedId(null);
    onShowToast("¡Copia editable creada! Se conservaron los datos. Ahora puedes modificarlos y registrarlos como una nueva ficha.");
  };

  // Load selected ficha record if supplied (passed from History reload action)
  useEffect(() => {
    if (initialFichaToLoad) {
      setDriveFileLink(null);
      setCategory(initialFichaToLoad.category || 'C');
      setIeName(initialFichaToLoad.ieName || '');
      setIeModular(initialFichaToLoad.ieModular || '');
      setIeDre(initialFichaToLoad.ieDre || '');
      setIeUgel(initialFichaToLoad.ieUgel || '');
      setIeGestion(initialFichaToLoad.ieGestion || '');
      setIeRegion(initialFichaToLoad.ieRegion || '');
      setIeProvincia(initialFichaToLoad.ieProvincia || '');
      setIeDistrito(initialFichaToLoad.ieDistrito || '');
      setIeDireccion(initialFichaToLoad.ieDireccion || '');
      setWorkTitle(initialFichaToLoad.workTitle || '');
      setWorkLang(initialFichaToLoad.workLang || '');
      setWorkLink(initialFichaToLoad.workLink || '');
      setDocName(initialFichaToLoad.docName || '');
      setDocDni(initialFichaToLoad.docDni || '');
      setDocSpec(initialFichaToLoad.docSpec || '');
      setDocCell(initialFichaToLoad.docCell || '');
      setDocEmail(initialFichaToLoad.docEmail || '');
      setStudents(initialFichaToLoad.students || []);
      setLoadedId(initialFichaToLoad.id || null);
      onShowToast(`Cargado registro de Ficha F1 en la vista previa y formulario.`);
    }
  }, [initialFichaToLoad]);

  // Adjust students list structure when Category changes
  useEffect(() => {
    if (loadedId) return; // Skip re-initialization if loading existing

    const studentCount = category === 'A' ? 1 : 3;
    const defaultStudents = Array(studentCount).fill(null).map((_, i) => ({
      fullname: '',
      dni: '',
      age: '',
      grade: category === 'A' 
        ? `${i + 1}.er Grado de Primaria` 
        : category === 'B' 
          ? `${3 + Math.floor(i/2)}.er Grado de Primaria` 
          : category === 'C'
            ? `${5 + Math.floor(i/2)}.to Grado de Primaria`
            : `Grado Secundaria`,
      section: '',
      parentName: '',
      parentDni: '',
      parentRel: 'Padre/Madre'
    }));
    setStudents(defaultStudents);
  }, [category]);

  const handleStudentFieldChange = (index: number, field: keyof Student, val: string) => {
    const updated = [...students];
    updated[index] = { ...updated[index], [field]: val };
    setStudents(updated);
  };

  const toggleAccordion = (name: string) => {
    setActiveAccordion(activeAccordion === name ? '' : name);
  };

  const performSave = async (silent = false): Promise<string | null> => {
    // If loaded and not admin, block modifications
    if (loadedId && !isAdmin) {
      onShowToast("No se puede modificar una ficha que ya ha sido guardada o generada en modo público.");
      return null;
    }

    if (!workTitle.trim()) {
      onShowToast("Por favor, ingresa el Nombre del Trabajo / Producción en el apartado II.");
      return null;
    }
    if (!docName.trim()) {
      onShowToast("Por favor, ingresa los datos del Docente Asesor en el apartado III.");
      return null;
    }

    // Basic students check
    const emptyStudents = students.filter(s => !s.fullname.trim());
    if (emptyStudents.length === students.length) {
      onShowToast("Por favor, rellena al menos el primer estudiante en el apartado IV.");
      return null;
    }

    const recordId = loadedId || "f1-" + Date.now();
    const newFichaRecord = {
      id: recordId,
      category,
      ieName,
      ieModular,
      ieDre,
      ieUgel,
      ieGestion,
      ieRegion,
      ieProvincia,
      ieDistrito,
      ieDireccion,
      workTitle,
      workLang,
      workLink,
      docName,
      docDni,
      docSpec,
      docCell,
      docEmail,
      students,
      createdAt: initialFichaToLoad?.createdAt || new Date().toISOString()
    };

    // 1. Dual Persistence: Save to local storage first
    try {
      const localFichasRaw = localStorage.getItem('local_fichas');
      let localFichas = localFichasRaw ? JSON.parse(localFichasRaw) : [];
      
      const index = localFichas.findIndex((f: any) => f.id === recordId);
      if (index !== -1) {
        localFichas[index] = newFichaRecord;
      } else {
        localFichas.unshift(newFichaRecord);
      }
      localStorage.setItem('local_fichas', JSON.stringify(localFichas));
    } catch (e) {
      console.error("Local storage error:", e);
    }

    setIsSaving(true);
    try {
      // 2. Dual Persistence: Try to save/sync with server
      const response = await fetch('/api/fichas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFichaRecord)
      });

      setLoadedId(recordId);
      onRefreshHistory();

      if (response.ok) {
        if (!silent) {
          onShowToast(`¡Ficha de Inscripción guardada correctamente en la Base de Datos!`);
        }
      } else {
        if (!silent) {
          onShowToast("Guardado en almacenamiento local seguro (Sincronización de servidor diferida).");
        }
      }
    } catch (e) {
      console.error(e);
      setLoadedId(recordId);
      onRefreshHistory();
      if (!silent) {
        onShowToast("Ficha guardada localmente (Servidor temporalmente desconectado).");
      }
    } finally {
      setIsSaving(false);
    }

    // Google Sheets Auto-Sync if connected
    if (googleToken && googleSpreadsheetId) {
      try {
        await syncSingleFichaToGoogleSheet(googleToken, googleSpreadsheetId, newFichaRecord);
        if (!silent) {
          onShowToast(`¡Ficha de Inscripción guardada y sincronizada en Google Sheets!`);
        }
      } catch (gsErr: any) {
        console.error("Google Sheets sync error:", gsErr);
        if (!silent) {
          onShowToast("Guardado en DB, pero falló la sincronización con Google Sheets: " + gsErr.message);
        }
      }
    }

    return recordId;
  };

  const handleSaveToDatabase = async () => {
    await performSave(false);
  };

  const getDocXml = () => {
    // Generate clean Word Document table HTML matching preview values
    let studentsRows = '';
    students.forEach((std, i) => {
      studentsRows += `
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px; border: 1px solid #cbd5e1;">
          <thead>
            <tr style="background-color: #f1f5f9; color: #771d1d;">
              <th colspan="4" style="border: 1px solid #cbd5e1; padding: 4px 6px; text-align: left; font-size: 9pt; font-weight: bold;">Estudiante N° ${i + 1}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc; width: 15%; font-size: 8.5pt;">Apellidos y Nombres:</td>
              <td style="border: 1px solid #cbd5e1; padding: 4px; width: 45%; font-weight: bold; font-size: 8.5pt;">${std.fullname || "........................................................"}</td>
              <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc; width: 10%; font-size: 8.5pt;">DNI:</td>
              <td style="border: 1px solid #cbd5e1; padding: 4px; width: 30%; font-size: 8.5pt;">${std.dni || "........................."}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc; font-size: 8.5pt;">Edad / Grado:</td>
              <td style="border: 1px solid #cbd5e1; padding: 4px; font-size: 8.5pt;">${std.age || "....."} años / ${std.grade || "....."}</td>
              <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc; font-size: 8.5pt;">Sección:</td>
              <td style="border: 1px solid #cbd5e1; padding: 4px; font-size: 8.5pt;">${std.section || "....."}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc; font-size: 8.5pt;">Apoderado:</td>
              <td style="border: 1px solid #cbd5e1; padding: 4px; font-size: 8.5pt;">${std.parentName || "........................................................"}</td>
              <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc; font-size: 8.5pt;">DNI Apod.:</td>
              <td style="border: 1px solid #cbd5e1; padding: 4px; font-size: 8.5pt;">${std.parentDni || "........................."}</td>
            </tr>
          </tbody>
        </table>
      `;
    });

    return `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:w="urn:schemas-microsoft-com:office:word" 
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
          <meta charset="utf-8">
          <title>Anexo F1 - Ficha El Perú Lee</title>
          <style>
              @page {
                  size: 21cm 29.7cm; /* A4 */
                  margin: 1.5cm 1.5cm 1.5cm 1.5cm;
              }
              body {
                  font-family: 'Arial', sans-serif;
                  font-size: 9pt;
                  line-height: 1.25;
                  color: #1e293b;
              }
              table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 6pt;
              }
              th, td {
                  border: 1px solid #cbd5e1;
                  padding: 3.5pt 4.5pt;
                  text-align: left;
                  font-size: 8.5pt;
              }
              .bg-slate-50 { background-color: #f8fafc; }
              .bg-slate-100 { background-color: #f1f5f9; }
              .bg-slate-800 { background-color: #1e293b; color: #ffffff !important; }
              .font-bold { font-weight: bold; }
              .text-center { text-align: center; }
              .w-1/2 { width: 50%; }
              .text-brand-700 { color: #9b1c1c; }
          </style>
      </head>
      <body>
          <div style="border-bottom: 2px solid #e02424; padding-bottom: 4px; margin-bottom: 12px; display: table; width: 100%;">
            <div style="float: left; width: 60%;">
              <p style="font-weight: bold; font-size: 9pt; uppercase; margin: 0;">MINISTERIO DE EDUCACIÓN DEL PERÚ</p>
              <p style="font-size: 8pt; color: #64748b; margin: 0;">I.E.P.M. N° 24009 - Túpac Amaru II</p>
            </div>
            <div style="float: right; width: 40%; text-align: right;">
              <p style="font-weight: bold; font-size: 11pt; color: #e02424; margin: 0;">EL PERÚ LEE 2026</p>
              <p style="font-size: 8pt; color: #64748b; margin: 0;">Anexo F1: Ficha Oficial de Inscripción</p>
            </div>
          </div>

          <div style="text-align: center; margin: 15px 0;">
            <h2 style="font-size: 11pt; font-weight: bold; text-transform: uppercase; margin: 0;">ANEXO F1: FICHA DE INSCRIPCIÓN</h2>
            <p style="font-size: 8pt; color: #475569; margin: 2px 0;">Concurso Nacional de Comprensión Lectora - EBR</p>
          </div>

          <!-- SECCIÓN I -->
          <div style="background-color: #1e293b; color: #ffffff; font-weight: bold; font-size: 9pt; padding: 3px 6px; margin-bottom: 4px;">I. DATOS DE LA INSTITUCIÓN EDUCATIVA</div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
            <tbody>
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc; width: 15%;">I.E.:</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; width: 35%;">${ieName}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc; width: 15%;">Código Modular:</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; width: 35%;">${ieModular}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc;">DRE / GRE:</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px;">${ieDre}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc;">UGEL:</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px;">${ieUgel}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc;">Gestión:</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px;">${ieGestion}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc;">Región / Prov / Dist:</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px;">${ieRegion} / ${ieProvincia} / ${ieDistrito}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc;">Dirección I.E.:</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px;" colspan="3">${ieDireccion}</td>
              </tr>
            </tbody>
          </table>

          <!-- SECCIÓN II -->
          <div style="background-color: #1e293b; color: #ffffff; font-weight: bold; font-size: 9pt; padding: 3px 6px; margin-bottom: 4px;">II. DATOS DEL TRABAJO Y CATEGORÍA</div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
            <tbody>
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc; width: 15%;">Categoría:</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; width: 35%; font-weight: bold; color: #9b1c1c;">Categoría ${category}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc; width: 15%;">Modalidad:</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; width: 35%;">${category === 'A' ? "Individual" : "Grupal (3 integrantes)"}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc;">Nombre Trabajo:</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px;">${workTitle || "........................................................................."}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc;">Lengua / Variante:</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px;">${workLang || "........................................."}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc;">Enlace de Video:</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px;" colspan="3">${workLink || "........................................................................."}</td>
              </tr>
            </tbody>
          </table>

          <!-- SECCIÓN III -->
          <div style="background-color: #1e293b; color: #ffffff; font-weight: bold; font-size: 9pt; padding: 3px 6px; margin-bottom: 4px;">III. DATOS DEL DOCENTE ASESOR</div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
            <tbody>
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc; width: 15%;">Docente:</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold;">${docName || "........................................................................."}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc; width: 15%;">DNI:</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px;">${docDni || "........................................."}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc;">Especialidad:</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px;">${docSpec || "........................................................................."}</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc;">Celular:</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px;">${docCell || "........................................."}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #cbd5e1; padding: 4px; font-weight: bold; background-color: #f8fafc;">Correo Electrónico:</td>
                <td style="border: 1px solid #cbd5e1; padding: 4px;" colspan="3">${docEmail || "........................................................................."}</td>
              </tr>
            </tbody>
          </table>

          <!-- SECCIÓN IV -->
          <div style="background-color: #1e293b; color: #ffffff; font-weight: bold; font-size: 9pt; padding: 3px 6px; margin-bottom: 4px;">IV. DATOS DEL ESTUDIANTE (Y APODERADO)</div>
          ${studentsRows}

          <!-- SIGNATURES -->
          <table style="width: 100%; border: none; margin-top: 30px; text-align: center;">
            <tbody>
              <tr>
                <td style="width: 50%; border: none; padding: 10px;">
                  <div style="border-top: 1px solid #64748b; padding-top: 5px;">
                    <p style="font-weight: bold; margin: 0; font-size: 8.5pt;">Director de la Institución Educativa</p>
                    <p style="color: #64748b; font-size: 7.5pt; margin: 0;">Firma, Sello y Huella Digital</p>
                  </div>
                </td>
                <td style="width: 50%; border: none; padding: 10px;">
                  <div style="border-top: 1px solid #64748b; padding-top: 5px;">
                    <p style="font-weight: bold; margin: 0; font-size: 8.5pt;">Docente o Asesor Designado</p>
                    <p style="color: #64748b; font-size: 7.5pt; margin: 0;">Firma y Huella Digital (Acreditado)</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 4px; text-align: center; font-size: 7pt; color: #94a3b8;">
            Este anexo F1 tiene carácter de Declaración Jurada. El registro final e inscripción oficial debe completarse obligatoriamente a través del SICE (https://sice.minedu.gob.pe/).
          </div>
      </body>
      </html>
    `;
  };

  const downloadWordDocument = async () => {
    // Attempt to save/update first, but do not block download on validation failures
    let savedSuccessfully = false;
    if (!loadedId) {
      const savedId = await performSave(true);
      savedSuccessfully = !!savedId;
    } else if (isAdmin) {
      const savedId = await performSave(true);
      savedSuccessfully = !!savedId;
    } else {
      onShowToast("Descargando expediente Word (.doc) en modo Solo Lectura.");
    }

    const template = getDocXml();
    const blob = new Blob(['\ufeff' + template], {
      type: 'application/msword;charset=utf-8'
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Anexo_F1_Ficha_Inscripcion_EPL_Categoria_${category}_2026.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (!loadedId && !savedSuccessfully) {
      onShowToast("Expediente Word (.doc) descargado (No se registró en la BD por campos requeridos incompletos).");
    } else if (isAdmin || !loadedId) {
      onShowToast("Expediente Word (.doc) descargado y guardado correctamente en la Base de Datos.");
    } else {
      onShowToast("Expediente Word (.doc) descargado exitosamente en modo Solo Lectura.");
    }
  };

  const printDocument = async () => {
    // Attempt to save/update first, but do not block print on validation failures
    let savedSuccessfully = false;
    if (!loadedId) {
      const savedId = await performSave(true);
      savedSuccessfully = !!savedId;
    } else if (isAdmin) {
      const savedId = await performSave(true);
      savedSuccessfully = !!savedId;
    } else {
      onShowToast("Preparando impresión / PDF en modo Solo Lectura.");
    }

    setTimeout(() => {
      window.print();
      if (!loadedId && !savedSuccessfully) {
        onShowToast("Abriendo diálogo de impresión (No se registró en la BD por campos requeridos incompletos).");
      } else if (isAdmin || !loadedId) {
        onShowToast("Abriendo diálogo de impresión. Registro guardado en la Base de Datos.");
      } else {
        onShowToast("Abriendo diálogo de impresión en modo Solo Lectura.");
      }
    }, 150);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Tab intro banner */}
      <div className="bg-[#5A5A40] text-white p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 no-print border border-[#5A5A40]/10">
        <div>
          <span className="inline-block bg-white/15 text-white text-[10px] px-2.5 py-1 rounded-full font-bold mb-1.5 uppercase tracking-wider border border-white/10">
            Generador Oficial del Anexo F1 - Conexión Base de Datos
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold">Formulario de Inscripción de Participantes</h2>
          <p className="text-xs text-[#f5f5f0] font-light mt-1">
            Los datos institucionales de la **IEPM N° 24009 "Túpac Amaru II"** han sido pre-completados. Ingresa el trabajo, docente y alumnos, y haz clic en guardar para archivarlo en la base de datos.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* LEFT PANEL: CONFIGURATION AND FORM ACCORDIONS */}
        <div className="w-full space-y-6 no-print">
          
          {loadedId && (
            <div className={`p-4 rounded-3xl flex flex-col sm:flex-row justify-between items-center text-xs animate-fadeIn shadow-sm gap-3 ${
              isAdmin 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                : 'bg-amber-50 border border-amber-200 text-amber-850'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isAdmin ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></span>
                <span>
                  {isAdmin ? (
                    <span>
                      <strong>Modo Administrador:</strong> Editando ficha ID <code>{loadedId}</code>. Puedes modificar y guardar cambios.
                    </span>
                  ) : (
                    <span>
                      <strong>Modo Público (Solo Lectura):</strong> Ficha registrada ID <code>{loadedId}</code>. Inicie sesión como Administrador en la pestaña Base de Datos para modificarla.
                    </span>
                  )}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                {!isAdmin && (
                  <button 
                    type="button"
                    onClick={handleDuplicateForEdit}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-xl font-bold transition-all text-[11px] hover:shadow-md shrink-0"
                  >
                    Duplicar para Editar
                  </button>
                )}
                <button 
                  type="button"
                  onClick={handleClearForm}
                  className="bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-700 px-3 py-1.5 rounded-xl font-bold transition-all text-[11px] shrink-0"
                >
                  Crear Nuevo Registro
                </button>
              </div>
            </div>
          )}

          {/* Category Selector */}
          <div className="bg-white rounded-3xl shadow-sm border border-natural-border p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-natural-text mb-1.5 uppercase tracking-wider">Categoría de Inscripción</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                disabled={isReadOnly}
                className="w-full bg-[#f9f9f7] border border-natural-border rounded-xl px-3 py-2.5 text-xs font-bold text-natural-text focus:outline-none focus:ring-2 focus:ring-natural-primary disabled:opacity-75 disabled:cursor-not-allowed"
              >
                <option value="A">Categoría A (Individual - 1.er y 2.do Grado Primaria)</option>
                <option value="B">Categoría B (Grupal - 3.er y 4.to Grado Primaria)</option>
                <option value="C">Categoría C (Grupal - 5.to y 6.to Grado Primaria)</option>
                <option value="D">Categoría D (Grupal - 1.er y 2.do Grado Secundaria)</option>
                <option value="E">Categoría E (Grupal - 3.er, 4.to y 5.to Grado Secundaria)</option>
              </select>
            </div>
            <div className="p-3 bg-natural-primary/5 border border-natural-primary/15 rounded-xl text-[11px] text-natural-text leading-relaxed font-medium">
              <span className="font-bold block text-natural-text mb-0.5">Especificación del Formato:</span>
              <span className="text-natural-secondary">
                {category === 'A' 
                  ? "La Categoría A requiere la inscripción de un único estudiante de ciclo III. El producto consiste en un video de 'Mi bitácora de lectura' de entre 6 a 8 minutos." 
                  : `La Categoría ${category} requiere equipos estables de tres (3) estudiantes para presentar el producto correspondiente de forma cooperativa.`
                }
              </span>
            </div>
          </div>

          {/* Accordion Panels */}
          <div className="bg-white rounded-3xl shadow-sm border border-natural-border p-4 space-y-3">
            
            {/* Accordion I: Datos I.E. */}
            <div className="border border-natural-border rounded-xl overflow-hidden">
              <button 
                type="button"
                onClick={() => toggleAccordion('ie')}
                className="w-full px-4 py-3 bg-[#f9f9f7] hover:bg-[#f3f3ee] flex justify-between items-center text-xs font-bold text-natural-text border-b border-natural-border"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5A5A40]"></span>
                  I. DATOS DE LA INSTITUCIÓN EDUCATIVA
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${activeAccordion === 'ie' ? 'rotate-180' : ''}`} />
              </button>
              {activeAccordion === 'ie' && (
                <div className="p-4 space-y-3 text-xs bg-white animate-slideDown">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-natural-secondary mb-1">Nombre de la I.E.</label>
                      <input type="text" value={ieName} onChange={(e) => setIeName(e.target.value)} disabled={isReadOnly} className="w-full border border-natural-border rounded-lg p-2 bg-[#f9f9f7] font-medium text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-natural-secondary mb-1">Código Modular</label>
                      <input type="text" value={ieModular} onChange={(e) => setIeModular(e.target.value)} disabled={isReadOnly} className="w-full border border-natural-border rounded-lg p-2 bg-[#f9f9f7] font-medium text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-natural-secondary mb-1">DRE / GRE</label>
                      <input type="text" value={ieDre} onChange={(e) => setIeDre(e.target.value)} disabled={isReadOnly} className="w-full border border-natural-border rounded-lg p-2 bg-[#f9f9f7] font-medium text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-natural-secondary mb-1">UGEL</label>
                      <input type="text" value={ieUgel} onChange={(e) => setIeUgel(e.target.value)} disabled={isReadOnly} className="w-full border border-natural-border rounded-lg p-2 bg-[#f9f9f7] font-medium text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-natural-secondary mb-1">Tipo de Gestión</label>
                      <input type="text" value={ieGestion} onChange={(e) => setIeGestion(e.target.value)} disabled={isReadOnly} className="w-full border border-natural-border rounded-lg p-2 bg-[#f9f9f7] font-medium text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-natural-secondary mb-1">Región</label>
                      <input type="text" value={ieRegion} onChange={(e) => setIeRegion(e.target.value)} disabled={isReadOnly} className="w-full border border-natural-border rounded-lg p-2 bg-[#f9f9f7] font-medium text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-natural-secondary mb-1">Provincia</label>
                      <input type="text" value={ieProvincia} onChange={(e) => setIeProvincia(e.target.value)} disabled={isReadOnly} className="w-full border border-natural-border rounded-lg p-2 bg-[#f9f9f7] font-medium text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-natural-secondary mb-1">Distrito</label>
                      <input type="text" value={ieDistrito} onChange={(e) => setIeDistrito(e.target.value)} disabled={isReadOnly} className="w-full border border-natural-border rounded-lg p-2 bg-[#f9f9f7] font-medium text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-natural-secondary mb-1">Dirección Física</label>
                      <input type="text" value={ieDireccion} onChange={(e) => setIeDireccion(e.target.value)} disabled={isReadOnly} className="w-full border border-natural-border rounded-lg p-2 bg-[#f9f9f7] font-medium text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion II: Datos del Trabajo */}
            <div className="border border-natural-border rounded-xl overflow-hidden">
              <button 
                type="button"
                onClick={() => toggleAccordion('work')}
                className="w-full px-4 py-3 bg-[#f9f9f7] hover:bg-[#f3f3ee] flex justify-between items-center text-xs font-bold text-natural-text border-b border-natural-border"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5A5A40]"></span>
                  II. DATOS DEL TRABAJO Y CONCURSO
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${activeAccordion === 'work' ? 'rotate-180' : ''}`} />
              </button>
              {activeAccordion === 'work' && (
                <div className="p-4 space-y-3 text-xs bg-white animate-slideDown">
                  <div>
                    <label className="block text-[10px] font-bold text-natural-secondary mb-1">Nombre del Trabajo / Producción</label>
                    <input 
                      type="text" 
                      value={workTitle} 
                      onChange={(e) => setWorkTitle(e.target.value)} 
                      disabled={isReadOnly}
                      placeholder="Escribe el nombre de la obra o cartelera comparativa..." 
                      className="w-full border border-natural-border rounded-lg p-2 bg-[#f9f9f7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-natural-primary font-medium text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-natural-secondary mb-1">Lengua / Variante</label>
                      <input 
                        type="text" 
                        value={workLang} 
                        onChange={(e) => setWorkLang(e.target.value)} 
                        disabled={isReadOnly}
                        placeholder="Ej. Castellano / Quechua" 
                        className="w-full border border-natural-border rounded-lg p-2 bg-[#f9f9f7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-natural-primary font-medium text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-natural-secondary mb-1">Enlace de Video (SICE/Drive)</label>
                      <input 
                        type="url" 
                        value={workLink} 
                        onChange={(e) => setWorkLink(e.target.value)} 
                        disabled={isReadOnly}
                        placeholder="https://drive.google.com/..." 
                        className="w-full border border-natural-border rounded-lg p-2 bg-[#f9f9f7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-natural-primary font-mono text-[10px] text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion III: Datos del Docente */}
            <div className="border border-natural-border rounded-xl overflow-hidden">
              <button 
                type="button"
                onClick={() => toggleAccordion('docente')}
                className="w-full px-4 py-3 bg-[#f9f9f7] hover:bg-[#f3f3ee] flex justify-between items-center text-xs font-bold text-natural-text border-b border-natural-border"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5A5A40]"></span>
                  III. DATOS DEL DOCENTE ASESOR
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${activeAccordion === 'docente' ? 'rotate-180' : ''}`} />
              </button>
              {activeAccordion === 'docente' && (
                <div className="p-4 space-y-3 text-xs bg-white animate-slideDown">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-natural-secondary mb-1">Apellidos y Nombres completos</label>
                      <input 
                        type="text" 
                        value={docName} 
                        onChange={(e) => setDocName(e.target.value)} 
                        disabled={isReadOnly}
                        placeholder="Ej. Mendoza Quispe, Gladis Elena" 
                        className="w-full border border-natural-border rounded-lg p-2 bg-[#f9f9f7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-natural-primary font-medium text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-natural-secondary mb-1">DNI / CE</label>
                      <input 
                        type="text" 
                        value={docDni} 
                        onChange={(e) => setDocDni(e.target.value)} 
                        disabled={isReadOnly}
                        placeholder="Ingresa DNI" 
                        className="w-full border border-natural-border rounded-lg p-2 bg-[#f9f9f7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-natural-primary font-medium text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-natural-secondary mb-1">Especialidad</label>
                      <input 
                        type="text" 
                        value={docSpec} 
                        onChange={(e) => setDocSpec(e.target.value)} 
                        disabled={isReadOnly}
                        placeholder="Ej. Educación Primaria" 
                        className="w-full border border-natural-border rounded-lg p-2 bg-[#f9f9f7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-natural-primary font-medium text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-natural-secondary mb-1">Celular</label>
                      <input 
                        type="text" 
                        value={docCell} 
                        onChange={(e) => setDocCell(e.target.value)} 
                        disabled={isReadOnly}
                        placeholder="987654321" 
                        className="w-full border border-natural-border rounded-lg p-2 bg-[#f9f9f7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-natural-primary font-medium text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-natural-secondary mb-1">Correo Electrónico</label>
                      <input 
                        type="email" 
                        value={docEmail} 
                        onChange={(e) => setDocEmail(e.target.value)} 
                        disabled={isReadOnly}
                        placeholder="correo@ejemplo.com" 
                        className="w-full border border-natural-border rounded-lg p-2 bg-[#f9f9f7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-natural-primary font-medium text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion IV: Datos de Estudiantes */}
            <div className="border border-natural-border rounded-xl overflow-hidden">
              <button 
                type="button"
                onClick={() => toggleAccordion('students')}
                className="w-full px-4 py-3 bg-[#f9f9f7] hover:bg-[#f3f3ee] flex justify-between items-center text-xs font-bold text-natural-text border-b border-natural-border"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5A5A40]"></span>
                  IV. DATOS DE ESTUDIANTES Y APODERADOS
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${activeAccordion === 'students' ? 'rotate-180' : ''}`} />
              </button>
              {activeAccordion === 'students' && (
                <div className="p-4 space-y-4 text-xs bg-white animate-slideDown max-h-[400px] overflow-y-auto">
                  {students.map((std, i) => (
                    <div key={i} className="p-3 bg-[#f9f9f7] border border-natural-border rounded-xl space-y-3 relative">
                      <div className="border-b border-natural-border pb-1.5 flex justify-between items-center">
                        <span className="font-bold text-natural-primary">Estudiante N° {i + 1}</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="block text-[9px] font-bold text-natural-secondary mb-0.5">Apellidos y Nombres</label>
                          <input 
                            type="text" 
                            value={std.fullname} 
                            onChange={(e) => handleStudentFieldChange(i, 'fullname', e.target.value)}
                            disabled={isReadOnly}
                            placeholder="Ej. Cahuana Huamán, Juan Carlos" 
                            className="w-full border border-natural-border rounded-lg p-1.5 bg-white text-xs font-medium text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" 
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] font-bold text-natural-secondary mb-0.5">DNI</label>
                            <input 
                              type="text" 
                              value={std.dni} 
                              onChange={(e) => handleStudentFieldChange(i, 'dni', e.target.value)}
                              disabled={isReadOnly}
                              placeholder="71234567" 
                              className="w-full border border-natural-border rounded-lg p-1.5 bg-white text-xs text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" 
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-natural-secondary mb-0.5">Edad</label>
                            <input 
                              type="text" 
                              value={std.age} 
                              onChange={(e) => handleStudentFieldChange(i, 'age', e.target.value)}
                              disabled={isReadOnly}
                              placeholder="11 años" 
                              className="w-full border border-natural-border rounded-lg p-1.5 bg-white text-xs text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" 
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-natural-secondary mb-0.5">Grado</label>
                            <input 
                              type="text" 
                              value={std.grade} 
                              onChange={(e) => handleStudentFieldChange(i, 'grade', e.target.value)}
                              disabled={isReadOnly}
                              className="w-full border border-natural-border rounded-lg p-1.5 bg-white text-xs font-medium text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" 
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-natural-secondary mb-0.5">Sección</label>
                            <input 
                              type="text" 
                              value={std.section} 
                              onChange={(e) => handleStudentFieldChange(i, 'section', e.target.value)}
                              disabled={isReadOnly}
                              placeholder="Ej. B" 
                              className="w-full border border-natural-border rounded-lg p-1.5 bg-white text-xs text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" 
                            />
                          </div>
                        </div>

                        {/* Guardian details */}
                        <div className="border-t border-natural-border/60 pt-2 mt-1">
                          <p className="text-[9px] font-bold text-natural-text mb-1">Datos del Padre/Madre o Apoderado:</p>
                          <div className="grid grid-cols-3 gap-1.5">
                            <div className="col-span-2">
                              <label className="block text-[8px] font-bold text-natural-secondary mb-0.5">Apoderado Completo</label>
                              <input 
                                type="text" 
                                value={std.parentName} 
                                onChange={(e) => handleStudentFieldChange(i, 'parentName', e.target.value)}
                                disabled={isReadOnly}
                                placeholder="Ej. Cahuana Quispe, Pedro" 
                                className="w-full border border-natural-border rounded-lg p-1 bg-white text-[10px] text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" 
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-natural-secondary mb-0.5">DNI Apoderado</label>
                              <input 
                                type="text" 
                                value={std.parentDni} 
                                onChange={(e) => handleStudentFieldChange(i, 'parentDni', e.target.value)}
                                disabled={isReadOnly}
                                placeholder="DNI apoderado" 
                                className="w-full border border-natural-border rounded-lg p-1 bg-white text-[10px] text-natural-text disabled:opacity-75 disabled:cursor-not-allowed" 
                              />
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button 
              type="button"
              onClick={handleSaveToDatabase}
              disabled={isSaving || isReadOnly}
              className="flex-1 py-3 bg-natural-primary hover:bg-natural-primary-hover text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-white" />
              <span>
                {isSaving 
                  ? "Guardando..." 
                  : isReadOnly 
                    ? "Bloqueado (Solo Lectura)" 
                    : "Registrar en Base de Datos"
                }
              </span>
            </button>
            <button 
              type="button"
              onClick={downloadWordDocument}
              className="py-3 px-4 bg-natural-secondary hover:bg-[#a00000] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Generar Word (.doc)</span>
            </button>
            
            {googleToken ? (
              <button 
                type="button"
                onClick={saveWordToGoogleDrive}
                disabled={isUploadingDrive}
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow shrink-0 disabled:opacity-50"
              >
                <Cloud className={`w-4 h-4 ${isUploadingDrive ? 'animate-pulse' : ''}`} />
                <span>{isUploadingDrive ? "Guardando..." : "Guardar en Drive"}</span>
              </button>
            ) : (
              <button 
                type="button"
                onClick={onGoogleLogin}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow shrink-0"
              >
                <Cloud className="w-4 h-4 text-slate-500" />
                <span>Usar Google Drive</span>
              </button>
            )}
          </div>
          
          {driveFileLink && (
            <div className="mt-1 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-center justify-between gap-3 shadow-sm no-print">
              <span className="font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                ¡Guardado en tu Google Drive!
              </span>
              <a 
                href={driveFileLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline"
              >
                Abrir Archivo <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
          <button 
            type="button"
            onClick={printDocument}
            className="w-full py-2.5 bg-[#f9f9f7] hover:bg-[#f3f3ee] text-natural-text rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-natural-border"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Ficha / Guardar como PDF</span>
          </button>
        </div>

        {/* RIGHT PANEL: A4 SHEET LIVE PREVIEW */}
        <div className="flex-grow overflow-x-auto p-4 bg-[#e6e6de]/70 rounded-3xl flex flex-col items-center justify-start border border-natural-border/60 shadow-inner preview-scroll max-w-full">
          {/* Banner */}
          <div className="mb-4 bg-natural-primary/5 border border-natural-primary/20 text-natural-text rounded-xl px-4 py-3 text-xs w-full max-w-[210mm] flex items-start gap-2.5 shadow-sm no-print">
            <span className="text-base select-none mt-0.5">📝</span>
            <div>
              <p className="font-bold">Vista Previa Dinámica de la Ficha F1 Oficial</p>
              <p className="text-natural-secondary mt-0.5">Todos los datos que rellenes a la izquierda se sincronizan al instante dentro del formato oficial aprobado por el Ministerio de Educación del Perú.</p>
            </div>
          </div>

          {/* A4 Sheet Preview */}
          <div id="a4-document" className="a4-page shadow-2xl relative">
            {/* Header branding */}
            <div className="flex justify-between items-center border-b-2 border-red-600 pb-2 mb-4">
              <div>
                <p className="font-extrabold text-[9px] tracking-wide text-slate-800 uppercase m-0">MINISTERIO DE EDUCACIÓN DEL PERÚ</p>
                <p className="text-[8px] text-slate-500 m-0">{ieName}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-red-600 text-[11px] tracking-wider m-0 font-sans">EL PERÚ LEE 2026</p>
                <p className="text-[8px] text-slate-500 m-0">Anexo F1: Ficha Oficial de Inscripción</p>
              </div>
            </div>

            {/* Title */}
            <div className="text-center my-3">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wide m-0">ANEXO F1: FICHA DE INSCRIPCIÓN</h2>
              <p className="text-[8px] text-slate-600 mt-0.5">Concurso Nacional de Comprensión Lectora - EBR</p>
            </div>

            {/* SECTION I */}
            <div className="mb-3">
              <div className="bg-slate-800 text-white font-bold text-[8.5px] px-2 py-0.5 uppercase rounded-t">I. DATOS DE LA INSTITUCIÓN EDUCATIVA</div>
              <table className="w-full border-collapse text-[9px]" style={{ border: '1px solid #cbd5e1' }}>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-1 font-bold bg-slate-50 w-[15%]" style={{ backgroundColor: '#f8fafc' }}>I.E.:</td>
                    <td className="border border-slate-300 p-1 w-[35%] font-medium">{ieName}</td>
                    <td className="border border-slate-300 p-1 font-bold bg-slate-50 w-[15%]" style={{ backgroundColor: '#f8fafc' }}>Código Modular:</td>
                    <td className="border border-slate-300 p-1 w-[35%] font-mono">{ieModular}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1 font-bold bg-slate-50" style={{ backgroundColor: '#f8fafc' }}>DRE / GRE:</td>
                    <td className="border border-slate-300 p-1">{ieDre}</td>
                    <td className="border border-slate-300 p-1 font-bold bg-slate-50" style={{ backgroundColor: '#f8fafc' }}>UGEL:</td>
                    <td className="border border-slate-300 p-1">{ieUgel}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1 font-bold bg-slate-50" style={{ backgroundColor: '#f8fafc' }}>Gestión:</td>
                    <td className="border border-slate-300 p-1">{ieGestion}</td>
                    <td className="border border-slate-300 p-1 font-bold bg-slate-50" style={{ backgroundColor: '#f8fafc' }}>Región / Prov / Dist:</td>
                    <td className="border border-slate-300 p-1">{ieRegion} / {ieProvincia} / {ieDistrito}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1 font-bold bg-slate-50" style={{ backgroundColor: '#f8fafc' }}>Dirección I.E.:</td>
                    <td className="border border-slate-300 p-1" colSpan={3}>{ieDireccion}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SECTION II */}
            <div className="mb-3">
              <div className="bg-slate-800 text-white font-bold text-[8.5px] px-2 py-0.5 uppercase rounded-t">II. DATOS DEL TRABAJO Y CATEGORÍA</div>
              <table className="w-full border-collapse text-[9px]" style={{ border: '1px solid #cbd5e1' }}>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-1 font-bold bg-slate-50 w-[15%]" style={{ backgroundColor: '#f8fafc' }}>Categoría:</td>
                    <td className="border border-slate-300 p-1 w-[35%] font-bold text-red-700">Categoría {category}</td>
                    <td className="border border-slate-300 p-1 font-bold bg-slate-50 w-[15%]" style={{ backgroundColor: '#f8fafc' }}>Modalidad:</td>
                    <td className="border border-slate-300 p-1 w-[35%]">{category === 'A' ? "Individual" : "Grupal (3 integrantes)"}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1 font-bold bg-slate-50" style={{ backgroundColor: '#f8fafc' }}>Nombre Trabajo:</td>
                    <td className="border border-slate-300 p-1" style={{ wordBreak: 'break-word' }}>{workTitle || "................................................................................................."}</td>
                    <td className="border border-slate-300 p-1 font-bold bg-slate-50" style={{ backgroundColor: '#f8fafc' }}>Lengua / Variante:</td>
                    <td className="border border-slate-300 p-1">{workLang || "........................................."}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1 font-bold bg-slate-50" style={{ backgroundColor: '#f8fafc' }}>Enlace de Video:</td>
                    <td className="border border-slate-300 p-1 text-[8.5px] font-mono text-blue-700 select-all break-all" colSpan={3}>{workLink || "................................................................................................."}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SECTION III */}
            <div className="mb-3">
              <div className="bg-slate-800 text-white font-bold text-[8.5px] px-2 py-0.5 uppercase rounded-t">III. DATOS DEL DOCENTE ASESOR</div>
              <table className="w-full border-collapse text-[9px]" style={{ border: '1px solid #cbd5e1' }}>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-1 font-bold bg-slate-50 w-[15%]" style={{ backgroundColor: '#f8fafc' }}>Docente:</td>
                    <td className="border border-slate-300 p-1 w-[35%] font-semibold">{docName || "........................................................................"}</td>
                    <td className="border border-slate-300 p-1 font-bold bg-slate-50 w-[15%]" style={{ backgroundColor: '#f8fafc' }}>DNI:</td>
                    <td className="border border-slate-300 p-1 w-[35%]">{docDni || "........................................."}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1 font-bold bg-slate-50" style={{ backgroundColor: '#f8fafc' }}>Especialidad:</td>
                    <td className="border border-slate-300 p-1">{docSpec || "........................................................................"}</td>
                    <td className="border border-slate-300 p-1 font-bold bg-slate-50" style={{ backgroundColor: '#f8fafc' }}>Celular:</td>
                    <td className="border border-slate-300 p-1">{docCell || "........................................."}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-1 font-bold bg-slate-50" style={{ backgroundColor: '#f8fafc' }}>Correo Electrónico:</td>
                    <td className="border border-slate-300 p-1" colSpan={3}>{docEmail || "........................................................................"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SECTION IV */}
            <div className="mb-3">
              <div className="bg-slate-800 text-white font-bold text-[8.5px] px-2 py-0.5 uppercase rounded-t">IV. DATOS DEL ESTUDIANTE (Y APODERADO)</div>
              <div className="space-y-2 mt-1">
                {students.map((std, i) => (
                  <table key={i} className="w-full border-collapse text-[9px]" style={{ border: '1px solid #cbd5e1' }}>
                    <thead>
                      <tr className="bg-slate-100 text-slate-800" style={{ backgroundColor: '#f1f5f9' }}>
                        <th colSpan={4} className="border border-slate-300 p-1 text-left font-bold text-red-900" style={{ color: '#771d1d' }}>Estudiante N° {i + 1}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 p-1 font-bold bg-slate-50 w-[15%]" style={{ backgroundColor: '#f8fafc' }}>Apellidos y Nombres:</td>
                        <td className="border border-slate-300 p-1 w-[45%] font-semibold">{std.fullname || "........................................................................"}</td>
                        <td className="border border-slate-300 p-1 font-bold bg-slate-50 w-[10%]" style={{ backgroundColor: '#f8fafc' }}>DNI:</td>
                        <td className="border border-slate-300 p-1 w-[30%]">{std.dni || "........................."}</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-1 font-bold bg-slate-50" style={{ backgroundColor: '#f8fafc' }}>Edad / Grado:</td>
                        <td className="border border-slate-300 p-1">{std.age ? `${std.age} años` : "...."} / {std.grade || "........................."}</td>
                        <td className="border border-slate-300 p-1 font-bold bg-slate-50" style={{ backgroundColor: '#f8fafc' }}>Sección:</td>
                        <td className="border border-slate-300 p-1">{std.section || "............."}</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-1 font-bold bg-slate-50" style={{ backgroundColor: '#f8fafc' }}>Padre o Apoderado:</td>
                        <td className="border border-slate-300 p-1">{std.parentName || "........................................................................"}</td>
                        <td className="border border-slate-300 p-1 font-bold bg-slate-50" style={{ backgroundColor: '#f8fafc' }}>DNI Apod.:</td>
                        <td className="border border-slate-300 p-1">{std.parentDni || "........................."}</td>
                      </tr>
                    </tbody>
                  </table>
                ))}
              </div>
            </div>

            {/* Signatures */}
            <div className="mt-8 pt-6">
              <table className="w-full text-center text-[9px]" style={{ border: 'none' }}>
                <tbody>
                  <tr>
                    <td className="w-1/2 px-8" style={{ border: 'none', width: '50%' }}>
                      <div className="border-t border-slate-500 pt-2">
                        <p className="font-bold m-0">Director de la Institución Educativa</p>
                        <p className="text-slate-500 text-[8px] m-0">Firma, Sello y Huella Digital</p>
                      </div>
                    </td>
                    <td className="w-1/2 px-8" style={{ border: 'none', width: '50%' }}>
                      <div className="border-t border-slate-500 pt-2">
                        <p className="font-bold m-0">Docente o Asesor Designado</p>
                        <p className="text-slate-500 text-[8px] m-0">Firma y Huella Digital (Acreditado)</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="absolute bottom-3 left-4 right-4 text-center border-t border-slate-200 pt-1 text-[7px] text-slate-400">
              Este anexo F1 tiene carácter de Declaración Jurada. El registro final e inscripción oficial debe completarse obligatoriamente a través del SICE (https://sice.minedu.gob.pe/).
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
