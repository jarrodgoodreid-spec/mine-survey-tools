import { TOOLS, toolPath } from './seo/tools.mjs';

export default {
  async redirects() {
    return TOOLS.map(tool => ({
      source: '/tools',
      has: [{ type: 'query', key: 'tool', value: tool.key }],
      destination: toolPath(tool),
      permanent: true
    }));
  }
};
