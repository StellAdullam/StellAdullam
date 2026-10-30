import { Elysia } from 'elysia';

export function escapeCsvField(field: unknown): string {
  const str = field === null || field === undefined ? '' : String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildCsvReport(headers: string[], rows: (string | number)[][]): string {
  const headerLine = headers.map(escapeCsvField).join(',');
  const rowLines = rows.map((r) => r.map(escapeCsvField).join(',')).join('\n');
  return `${headerLine}\n${rowLines}`;
}

export const exportRoutes = new Elysia({ prefix: '/api/v1/export' })
  .get('/transactions.csv', ({ set }) => {
    const headers = [
      'TransactionHash',
      'Timestamp',
      'Operation',
      'FromAddress',
      'ToAddress',
      'Amount',
      'Asset',
      'Status',
    ];

    const sampleRows: (string | number)[][] = [
      [
        '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
        new Date().toISOString(),
        'mint_shares',
        'GADMIN11111111111111111111111111111111111111111111111111111',
        'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI',
        1000,
        'PRPT-001',
        'CONFIRMED',
      ],
      [
        '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
        new Date().toISOString(),
        'deposit_collateral',
        'GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI',
        'CDEFILENDING11111111111111111111111111111111111111111111111',
        250,
        'PRPT-001',
        'CONFIRMED',
      ],
    ];

    const csvContent = buildCsvReport(headers, sampleRows);

    set.headers['Content-Type'] = 'text/csv; charset=utf-8';
    set.headers['Content-Disposition'] = 'attachment; filename="stelladullam_transactions_audit.csv"';

    return csvContent;
  });
