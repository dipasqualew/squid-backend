
export enum ContentType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
}

export enum PublicState {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export interface Squid {
  uuid: string;
  owner_uuid: string;
  title: string;
  contentType: ContentType;
  public: PublicState,
  contents?: string;
}

export interface Squad {
  uuid: string;
  start: string;
  end: string;
}
