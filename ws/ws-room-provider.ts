import { createTemplate, token } from "../core/service.ts";

/** Responsible for storing information about which context in which room */
export interface WsRoomProvider {
  /** Joins context with given id into a room */
  joinRoom(id: string, room: string): Promise<void>;
  /** Removes context from given room */
  leaveRoom(id: string, room: string): Promise<void>;
  /** Gets all context ids in a given room */
  getContextsInRoom(room: string): Promise<string[]>;
}

export const wsRoomProviderToken = token("WsRoomProvider");

export const wsRoomProviderServiceTemplate = createTemplate<WsRoomProvider>(
  (dsl) =>
    dsl
      .token(wsRoomProviderToken),
);
