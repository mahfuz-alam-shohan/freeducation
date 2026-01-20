export interface OpenAPIInfo {
  title: string;
  version: string;
  description?: string;
  contact?: {
    name?: string;
    email?: string;
    url?: string;
  };
  license?: {
    name: string;
    url?: string;
  };
}

export interface OpenAPIServer {
  url: string;
  description?: string;
}

export interface OpenAPIParameter {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  description?: string;
  required?: boolean;
  schema: {
    type: string;
    format?: string;
    enum?: string[];
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface OpenAPIRequestBody {
  description?: string;
  required?: boolean;
  content: {
    [contentType: string]: {
      schema: any;
      example?: any;
    };
  };
}

export interface OpenAPIResponse {
  description: string;
  content?: {
    [contentType: string]: {
      schema: any;
      example?: any;
    };
  };
  headers?: {
    [headerName: string]: {
      description?: string;
      schema: any;
    };
  };
}

export interface OpenAPIOperation {
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: OpenAPIParameter[];
  requestBody?: OpenAPIRequestBody;
  responses: {
    [statusCode: string]: OpenAPIResponse;
  };
  security?: any[];
}

export interface OpenAPIPath {
  [method: string]: OpenAPIOperation;
}

export interface OpenAPIDocument {
  openapi: string;
  info: OpenAPIInfo;
  servers?: OpenAPIServer[];
  paths: Record<string, OpenAPIPath>;
  components?: {
    schemas?: Record<string, any>;
    securitySchemes?: Record<string, any>;
    responses?: Record<string, OpenAPIResponse>;
  };
  tags?: Array<{
    name: string;
    description?: string;
  }>;
}
