import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parsePostgresConnectionString(connectionString: string) {
  const formats = [
      /postgres:\/\/([^:]+):([^@]+)@([^:/]+)(?::(\d+))?\/([^?]+)(\?.+)?/,
      /postgresql:\/\/([^:]+):([^@]+)@([^:/]+)(?::(\d+))?\/([^?]+)(\?.+)?/
  ];

  let match: RegExpMatchArray | null = null;

  for (const format of formats) {
      match = connectionString.match(format);
      if (match) break;
  }

  if (!match) {
      throw new Error("Invalid connection string format");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, username, password, host, port, database, ssl] = match;

  return {
      username,
      password,
      host,
      port: port ? parseInt(port, 10) : 5432,
      database,
      ssl: ssl ? true : false
  };
}