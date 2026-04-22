export const formatToDB = (date) => {
  if (!date) return null;
  const d = new Date(date);
  
  const pad = (n) => n.toString().padStart(2, '0');
  
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = "00";

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const formatToInput = (dateString) => {
  if (!dateString) return "";
  return dateString.slice(0, 16); 
};