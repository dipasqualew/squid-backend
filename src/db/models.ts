
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

export interface SquidLink {
  uuid: string;
  start: string;
  end: string;
}

export interface Squad {
  uuid: string;
  title: string;
  description: string;
}

export interface SquidInSquad {
  uuid: string;
  squad_uuid: string;
  squid_uuid: string;
}

export interface User {
  uuid: string;
  full_name: string;
  preferred_name: string;
  email: string;
  password?: string;
}
