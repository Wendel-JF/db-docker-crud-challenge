export const formatDate = (d: Date | null | undefined) => {
  if (!d) return "";
  return `${d.getDate()}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};
  