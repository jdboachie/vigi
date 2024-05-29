'use client'

import pg from 'pg'
import type { Settings } from '@/components/settings-context';

const { Client } = pg;

export const isValidConnection = async (settings: Settings): Promise<{res: boolean, message: string}> => {
  const { user, password, host, port, database, ssl } = settings;
  const client = new Client({
    user,
    password,
    host,
    port,
    database,
    ssl,
  });

  try {
    await client.connect();
    return {res: true, message: 'Connected successfully'};
  } catch (error) {
    return {res: false, message: error!.toString()};
  } finally {
    client.end();
  }
};