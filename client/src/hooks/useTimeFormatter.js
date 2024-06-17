function padToTwoDigits(number) {
  return number.toString().padStart(2, '0'); // Добавление ведущего нуля
}

export default function useTimeFormatter(isoString) {
  // Создаем объект Date из строки ISO
  const date = new Date(isoString);

  // Получаем часы и минуты
  const hours = padToTwoDigits(date.getHours());
  const minutes = padToTwoDigits(date.getMinutes());

  // Возвращаем время в формате HH:MM
  return `${hours}:${minutes}`;
}