import { IncomingMessage } from 'http';

export const isPathNameWithParam = (requestPathname: string, baseApiPathname: string): boolean => {
  const regex = new RegExp(`^${baseApiPathname}/([^/]+)`);
  return !!requestPathname.match(regex);
};

export const extractParam = (requestPathname: string, baseApiPathname: string): string => {
  if (!isPathNameWithParam(requestPathname, baseApiPathname)) {
    throw new Error('No param');
  }

  return requestPathname.slice(baseApiPathname.length + 1);
};

export const readBody = async (request: IncomingMessage): Promise<unknown> => {
  return await new Promise(resolve => {
    let body = '';
    request.on('data', chunk => {
      body += chunk.toString();
    });
    request.on('end', () => {
      const parsed = JSON.parse(body);
      resolve(parsed);
    });
  });
};
