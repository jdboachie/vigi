import pg, { QueryResult } from 'pg'
const { Client } = pg

// const pool = new Pool({
//   user: 'postgres',
//   password: 'postgres',
//   host: '0.0.0.0',
//   port: 5432,
//   database: 'sql_demo',
// })

const connectionString = `postgres://postgres.bmcetebocbqqshyextzi:pzB&Q-zX~DsP.7D@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`
const client = new Client ({
  connectionString,
  password: 'pzB&Q-zX~DsP.7D'
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const query = (text: string): Promise<QueryResult<any>> | null => {
  return client.query(text)
}
