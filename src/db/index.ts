'use client';

import { useSettings } from '@/components/settings-context';
import { useCallback } from 'react';
import pg, { QueryResult } from 'pg';
const { Client } = pg;
import { toast } from 'sonner';

const useDatabase = () => {
  const { settings } = useSettings();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query = useCallback(async (text: string): Promise<QueryResult<any> | null> => {
    const client = new Client(settings);

    try {
      await client.connect();
      return await client.query(text);
    } catch (error) {
      toast.error('Error executing query', { description: error!.toString() });
      return null;
    } finally {
      client.end();
    }
  }, [settings]);

  return { query };
};

export default useDatabase;
