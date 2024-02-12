export interface UpdateDatabaseMessage {
  readonly type: 'updateDb';
  readonly database: string;
}

export type WorkerMessage = UpdateDatabaseMessage; // | ... -- to extend later
