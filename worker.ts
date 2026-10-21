// Route DUO room requests through the same deployed Worker as the app.
// This avoids requiring NEXT_PUBLIC_DUO_ROOM_API to be configured separately.
import nextWorker from "./.open-next/worker.js";
import roomService, { Room } from "./room-service/worker";

export { Room };

export default {
  async fetch(request: Request, env: any, ctx: any) {
    const pathname = new URL(request.url).pathname;
    if (pathname === "/health" || pathname === "/rooms" || pathname.startsWith("/rooms/")) {
      return roomService.fetch(request, env);
    }
    return nextWorker.fetch(request, env, ctx);
  },
};
