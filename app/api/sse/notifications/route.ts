import { NextRequest } from 'next/server';
import { eventBus } from '@/lib/events/eventBus';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const listener = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      eventBus.on('notification', listener);

      req.signal.addEventListener('abort', () => {
        eventBus.off('notification', listener);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
