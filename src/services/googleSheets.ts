export interface LeadData {
  nombre: string;
  correo: string;
  telefono: string;
  servicios: string;
}

const APPS_SCRIPT_URL = import.meta.env.PUBLIC_URL_DE_APPS_SCRIPT;

export async function submitToGoogleSheets(data: LeadData): Promise<void> {
  try {
    const body = new URLSearchParams({
      nombre: data.nombre,
      correo: data.correo,
      telefono: data.telefono,
      servicios: data.servicios,
    });

    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body,
    });
  } catch (error) {
    console.error('No se pudo registrar el lead en Google Sheets:', error);
  }
}
