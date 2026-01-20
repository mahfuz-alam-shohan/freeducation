import { HTTP_STATUS, CONTENT_TYPES } from '../config';

export const jsonResponse = (body: Record<string, unknown>, status: number = HTTP_STATUS.OK): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": CONTENT_TYPES.JSON },
  });

export const htmlResponse = (html: string, status: number = HTTP_STATUS.OK, headers?: HeadersInit): Response =>
  new Response(html, {
    status,
    headers: { "content-type": CONTENT_TYPES.HTML, ...headers },
  });

export const redirectResponse = (location: string, headers?: HeadersInit): Response =>
  new Response(null, {
    status: 302,
    headers: { Location: location, ...headers },
  });

export const badRequest = (message: string): Response => jsonResponse({ error: message }, HTTP_STATUS.BAD_REQUEST);

export const serviceError = (message: string): Response =>
  new Response(message, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR, headers: { "content-type": CONTENT_TYPES.PLAIN } });
