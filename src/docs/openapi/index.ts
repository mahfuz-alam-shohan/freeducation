import { createOpenAPIDocument } from './specification';

export const getOpenAPIDocument = () => {
  return createOpenAPIDocument();
};

export const getOpenAPIYAML = (): string => {
  const doc = createOpenAPIDocument();
  
  // Convert to YAML (simple implementation for now)
  const yamlString = jsonToYaml(doc);
  return yamlString;
};

export const getOpenAPIJSON = (): string => {
  const doc = createOpenAPIDocument();
  return JSON.stringify(doc, null, 2);
};

// Simple JSON to YAML converter (basic implementation)
const jsonToYaml = (obj: any, indent = 0): string => {
  const spaces = '  '.repeat(indent);
  let yaml = '';

  if (obj === null || obj === undefined) {
    return 'null\n';
  }

  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return `${obj}\n`;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]\n';
    
    obj.forEach(item => {
      yaml += `${spaces}- `;
      if (typeof item === 'object' && item !== null) {
        yaml += '\n' + jsonToYaml(item, indent + 1);
      } else {
        yaml += jsonToYaml(item, 0).trim() + '\n';
      }
    });
    return yaml;
  }

  if (typeof obj === 'object') {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        yaml += `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`;
      } else if (Array.isArray(value)) {
        yaml += `${spaces}${key}:\n${jsonToYaml(value, indent)}`;
      } else {
        yaml += `${spaces}${key}: ${jsonToYaml(value, 0).trim()}\n`;
      }
    });
  }

  return yaml;
};
