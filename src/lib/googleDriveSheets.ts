import { FichaRecord, Student } from '../types';

const HEADERS = [
  'ID de Ficha',
  'Categoría',
  'Nombre de I.E.',
  'Código Modular',
  'DRE',
  'UGEL',
  'Gestión',
  'Región',
  'Provincia',
  'Distrito',
  'Dirección',
  'Título del Trabajo',
  'Idioma',
  'Enlace al Trabajo',
  'Nombre de Docente',
  'DNI de Docente',
  'Especialidad Docente',
  'Celular Docente',
  'Correo Docente',
  'Alumno 1: Nombre',
  'Alumno 1: DNI',
  'Alumno 1: Edad',
  'Alumno 1: Grado',
  'Alumno 1: Sección',
  'Alumno 1: Apoderado',
  'Alumno 1: DNI Apod.',
  'Alumno 1: Relación Apod.',
  'Alumno 2: Nombre',
  'Alumno 2: DNI',
  'Alumno 2: Edad',
  'Alumno 2: Grado',
  'Alumno 2: Sección',
  'Alumno 2: Apoderado',
  'Alumno 2: DNI Apod.',
  'Alumno 2: Relación Apod.',
  'Alumno 3: Nombre',
  'Alumno 3: DNI',
  'Alumno 3: Edad',
  'Alumno 3: Grado',
  'Alumno 3: Sección',
  'Alumno 3: Apoderado',
  'Alumno 3: DNI Apod.',
  'Alumno 3: Relación Apod.',
  'Fecha de Registro'
];

/**
 * Maps a FichaRecord object to a Google Sheets row array.
 */
function fichaToRow(ficha: FichaRecord): string[] {
  const row = [
    ficha.id || '',
    ficha.category || '',
    ficha.ieName || '',
    ficha.ieModular || '',
    ficha.ieDre || '',
    ficha.ieUgel || '',
    ficha.ieGestion || '',
    ficha.ieRegion || '',
    ficha.ieProvincia || '',
    ficha.ieDistrito || '',
    ficha.ieDireccion || '',
    ficha.workTitle || '',
    ficha.workLang || '',
    ficha.workLink || '',
    ficha.docName || '',
    ficha.docDni || '',
    ficha.docSpec || '',
    ficha.docCell || '',
    ficha.docEmail || ''
  ];

  // Map up to 3 students
  for (let i = 0; i < 3; i++) {
    const s: Student | undefined = ficha.students?.[i];
    if (s) {
      row.push(
        s.fullname || '',
        s.dni || '',
        s.age || '',
        s.grade || '',
        s.section || '',
        s.parentName || '',
        s.parentDni || '',
        s.parentRel || ''
      );
    } else {
      row.push('', '', '', '', '', '', '', '');
    }
  }

  row.push(ficha.createdAt || new Date().toISOString());
  return row;
}

/**
 * Fetch helper with authorization header
 */
async function fetchWithAuth(url: string, token: string, options: RequestInit = {}) {
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google API Error (${res.status}): ${errorText || res.statusText}`);
  }
  return res.json();
}

/**
 * Searches for or creates a folder in Google Drive
 */
export async function getOrCreateFolder(token: string, folderName: string): Promise<string> {
  const query = encodeURIComponent(`name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
  const listUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`;
  const result = await fetchWithAuth(listUrl, token);
  
  if (result.files && result.files.length > 0) {
    return result.files[0].id;
  }

  // Create folder if it doesn't exist
  const createUrl = 'https://www.googleapis.com/drive/v3/files';
  const folderMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder'
  };
  
  const folder = await fetchWithAuth(createUrl, token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(folderMetadata)
  });

  return folder.id;
}

/**
 * Searches for or creates the Google Sheet database for Fichas
 */
export async function getOrCreateFichasSheet(token: string): Promise<string> {
  const sheetName = 'Fichas Anexo 1 - Registro de Postulantes';
  const query = encodeURIComponent(`name = '${sheetName}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`);
  const listUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`;
  const result = await fetchWithAuth(listUrl, token);

  if (result.files && result.files.length > 0) {
    return result.files[0].id;
  }

  // Create spreadsheet
  const createUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
  const body = {
    properties: {
      title: sheetName
    },
    sheets: [
      {
        properties: {
          title: 'Fichas F1'
        }
      }
    ]
  };

  const spreadsheet = await fetchWithAuth(createUrl, token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const spreadsheetId = spreadsheet.spreadsheetId;

  // Write headers to the new spreadsheet
  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Fichas F1!A1:append?valueInputOption=USER_ENTERED`;
  await fetchWithAuth(appendUrl, token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      values: [HEADERS]
    })
  });

  return spreadsheetId;
}

/**
 * Syncs all given Fichas with the Google Sheet spreadsheet.
 * It will overwrite/update existing records by ID, or append if new.
 */
export async function syncFichasToGoogleSheet(token: string, spreadsheetId: string, fichas: FichaRecord[]): Promise<void> {
  // 1. Fetch current spreadsheet data to find existing rows by ID
  const readUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Fichas F1!A:A`;
  const result = await fetchWithAuth(readUrl, token);
  const existingIds: string[] = (result.values || []).map((row: any[]) => row[0]);

  const rowsToAppend: string[][] = [];
  
  for (const ficha of fichas) {
    if (!ficha.id) continue;
    const rowIndex = existingIds.indexOf(ficha.id);
    const rowValues = fichaToRow(ficha);

    if (rowIndex !== -1) {
      // Row exists - update it (note that Google Sheets is 1-indexed, so row index maps to A{rowIndex + 1})
      const sheetRowNumber = rowIndex + 1;
      const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Fichas F1!A${sheetRowNumber}:${sheetRowNumber}?valueInputOption=USER_ENTERED`;
      await fetchWithAuth(updateUrl, token, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          values: [rowValues]
        })
      });
    } else {
      // Row doesn't exist - append it
      rowsToAppend.push(rowValues);
    }
  }

  if (rowsToAppend.length > 0) {
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Fichas F1!A1:append?valueInputOption=USER_ENTERED`;
    await fetchWithAuth(appendUrl, token, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        values: rowsToAppend
      })
    });
  }
}

/**
 * Syncs a single FichaRecord to the Google Sheet spreadsheet.
 */
export async function syncSingleFichaToGoogleSheet(token: string, spreadsheetId: string, ficha: FichaRecord): Promise<void> {
  await syncFichasToGoogleSheet(token, spreadsheetId, [ficha]);
}

/**
 * Deletes or marks a FichaRecord as deleted on Google Sheets
 */
export async function deleteFichaFromGoogleSheet(token: string, spreadsheetId: string, fichaId: string): Promise<void> {
  const readUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Fichas F1!A:A`;
  const result = await fetchWithAuth(readUrl, token);
  const existingIds: string[] = (result.values || []).map((row: any[]) => row[0]);

  const rowIndex = existingIds.indexOf(fichaId);
  if (rowIndex !== -1) {
    const sheetRowNumber = rowIndex + 1;
    // Mark as ELIMINADO in the ID column and clear relevant info, or append (ELIMINADO)
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Fichas F1!A${sheetRowNumber}:B${sheetRowNumber}?valueInputOption=USER_ENTERED`;
    await fetchWithAuth(updateUrl, token, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        values: [[`${fichaId} (ELIMINADO)`, 'ELIMINADO']]
      })
    });
  }
}

/**
 * Uploads a text/blob file (like DOC or PDF) to Google Drive inside the specified folder.
 */
export async function uploadFileToGoogleDrive(
  token: string,
  folderId: string,
  filename: string,
  contentType: string,
  blob: Blob
): Promise<{ id: string; webViewLink: string }> {
  const metadata = {
    name: filename,
    parents: [folderId]
  };

  const formData = new FormData();
  formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  formData.append('file', blob);

  const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink';
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Drive Upload Error (${response.status}): ${errorText}`);
  }

  return response.json();
}
