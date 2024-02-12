import { IncomingMessage, ServerResponse } from 'http';

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

export const readBody = async (request: IncomingMessage | ServerResponse): Promise<unknown> => {
  return await new Promise((resolve, reject) => {
    let body = '';

    request.on('data', chunk => {
      body += chunk.toString();
    });

    request.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch {
        console.error(`Unable to parse JSON from ${body}`);
        reject(new Error(`Unable to parse JSON from ${body}`));
      }
    });

    request.on('error', error => {
      reject(error);
    });
  });
};
