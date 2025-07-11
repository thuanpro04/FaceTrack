function formatDateToVn(isoString: Date) {
  const date = new Date(isoString);
  const vnTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  // lấy thông tin cụ thể
  const day = vnTime.getDate().toString().padStart(2, '0');
  const month = (vnTime.getMonth() + 1).toString().padStart(2, '0');
  const year = vnTime.getFullYear();
  const hours = vnTime.getHours().toString().padStart(2, '0');
  const minutes = vnTime.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes} - ${day}/${month}/${year}`;
}
export {formatDateToVn};
