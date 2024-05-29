'use client';

import { toast } from 'sonner';
import { useCallback } from 'react';
import pg, { QueryResult } from 'pg';
import { useSettings } from '@/components/settings-context';

const { Client } = pg;

const useDatabase = () => {
  const { settings } = useSettings();

  const useValidConnection = useCallback(async (): Promise<{ res: boolean | null, message: string }> => {
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
      console.log('connecting')
      await client.connect()
      .then(() => {
        return { res: true, message: 'Connected successfully' };
      })
      return { res: null, message: 'Connecting...'}
    } catch (error) {
      return { res: false, message: error!.toString() };
    } finally {
      client.end();
    }
  }, [settings]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query = useCallback(async (text: string): Promise<{ output: QueryResult<any> | null, time: number } | null> => {
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
      const start = Date.now();
      const output = await client.query(text);
      const end = Date.now();
      const time = end - start;
      return { output, time };
    } catch (error) {
      toast.error('Error executing query', { description: error!.toString() });
      return null;
    } finally {
      client.end();
    }
  }, [settings]);

  return { query, useValidConnection };
};

export default useDatabase;
