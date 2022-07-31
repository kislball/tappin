import { wsRoomProviderServiceTemplate } from "./ws-room-provider.ts";

export const wsMapRoomProvider = wsRoomProviderServiceTemplate((dsl) =>
  dsl
    .provide(() => {
      const rooms = new Map<string, string[]>();

      const ensureRoom = (name: string) => rooms.get(name) ?? [];

      // deno-lint-ignore require-await
      const joinRoom = async (id: string, room: string) => {
        const existing = ensureRoom(room);
        rooms.set(id, [...existing, id]);
      };

      // deno-lint-ignore require-await
      const leaveRoom = async (id: string, room: string) => {
        const existing = ensureRoom(room);
        rooms.set(room, existing.filter((e) => e !== id));
      };

      // deno-lint-ignore require-await
      const getContextsInRoom = async (room: string) => ensureRoom(room);

      return {
        joinRoom,
        leaveRoom,
        getContextsInRoom,
      };
    })
);
