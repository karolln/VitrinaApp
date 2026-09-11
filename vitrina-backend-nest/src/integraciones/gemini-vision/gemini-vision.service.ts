import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';

export interface SugerenciaProducto {
  nombre: string;
  categoria: string;
}

@Injectable()
export class GeminiVisionService {
  private readonly logger = new Logger(GeminiVisionService.name);
  private readonly apiKey = process.env.GEMINI_API_KEY;
  private readonly modelo = 'gemini-3.6-flash';

  async sugerirDesdeFoto(rutaArchivo: string, mimeType: string): Promise<SugerenciaProducto> {
    try {
      if (!this.apiKey) {
        throw new Error('GEMINI_API_KEY no está configurada en el .env');
      }

      const buffer = fs.readFileSync(rutaArchivo);
      const base64 = buffer.toString('base64');

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelo}:generateContent?key=${this.apiKey}`;

      const body = {
        contents: [
          {
            parts: [
              {
                text:
                  'Mira esta foto de un producto de una tienda/negocio. ' +
                  'Responde SOLO con un JSON, sin texto adicional, sin markdown, con este formato exacto: ' +
                  '{"nombre": "nombre corto del producto", "categoria": "categoría general"}. ' +
                  'Usa español. Si no estás seguro, da tu mejor estimación razonable.',
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64,
                },
              },
            ],
          },
        ],
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini respondió ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
      const limpio = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(limpio);

      return {
        nombre: parsed.nombre || 'Producto sin nombre',
        categoria: parsed.categoria || 'Sin categoría',
      };
    } catch (err) {
      this.logger.error('Error analizando foto con Gemini Vision', err as Error);
      return { nombre: 'Producto sin nombre', categoria: 'Sin categoría' };
    }
  }
}