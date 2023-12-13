export const checkFile = (file) => {
  const isCsv = file.type === 'text/csv' || file.name.endsWith('.csv');

  if (!isCsv) {
    message.error('You can only upload CSV files!');
  }

  return isCsv;
};
