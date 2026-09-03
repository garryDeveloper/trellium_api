/**
 * Whitelist, no blacklist: cualquier tipo que no esté acá se rechaza. Quedan
 * deliberadamente afuera `image/svg+xml` y `text/html`, que sirven como
 * vectores de XSS si el navegador los renderiza inline.
 */
export const ALLOWED_ATTACHMENT_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
  'text/plain': 'txt',
  'text/csv': 'csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'docx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
};

export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

export const ALLOWED_ATTACHMENT_LABEL =
  'JPG, PNG, GIF, WEBP, PDF, TXT, CSV, DOCX, XLSX';

export function isAllowedAttachmentType(mimeType: string): boolean {
  return Object.hasOwn(ALLOWED_ATTACHMENT_TYPES, mimeType);
}

/**
 * La extensión sale del MIME validado, nunca del nombre que mandó el cliente:
 * así un `factura.pdf.exe` no puede elegir con qué extensión se guarda.
 */
export function extensionForType(mimeType: string): string {
  return ALLOWED_ATTACHMENT_TYPES[mimeType];
}
