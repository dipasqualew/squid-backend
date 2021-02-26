
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
  content_type: ContentType;
  public: PublicState,
}

export interface SquidContents {
  uuid: string;
  contents: string;
}

export interface Squad {
  uuid: string;
  start: string;
  end: string;
}
