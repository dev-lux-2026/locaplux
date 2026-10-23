export const dynamic = "force-dynamic";
import { NextRequest } from 'next/server';
import { eventBus } from '@/lib/events/eventBus';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const listener = (data: any) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch (e) {
          // Évite le crash si le flux est déjà fermé
        }
      };

      eventBus.on('notification', listener);

      // 💓 PING REGULIER : Envoie un battement de cœur toutes les 15 secondes pour garder le flux vivant
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch (e) {
          clearInterval(keepAlive);
        }
      }, 15000);

      // ⏱️ SECURITE TIME LIMIT : Fermeture propre au bout de 25s pour éviter le timeout Vercel de 300s
      const timeout = setTimeout(() => {
        clearInterval(keepAlive);
        eventBus.off('notification', listener);
        try { controller.close(); } catch (e) {}
      }, 25000);

      req.signal.addEventListener('abort', () => {
        clearInterval(keepAlive);
        clearTimeout(timeout);
        eventBus.off('notification', listener);
        try { controller.close(); } catch (e) {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
