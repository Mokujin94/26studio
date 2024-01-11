export function useDateFormatter(inputDate) {
  const date = new Date(inputDate);

  // Получить текущую дату и время
  const currentDate = new Date();

  // Разница в миллисекундах между текущей датой и исходной датой
  const difference = currentDate - date;

  // Разница в секундах
  const differenceInSeconds = Math.floor(difference / 1000);

  // Если разница менее 1 минуты, покажем "1 сек назад"
  if (differenceInSeconds < 60) {
    return `${differenceInSeconds} сек назад`;
  }

  // Разница в минутах
  const differenceInMinutes = Math.floor(difference / (1000 * 60));

  // Если разница менее 1 часа, покажем количество минут назад
  if (differenceInMinutes < 60) {
    return `${differenceInMinutes} мин назад`;
  }

  // Разница в часах
  const differenceInHours = Math.floor(difference / (1000 * 60 * 60));

  // Если разница менее 24 часов, покажем количество часов назад
  if (
    differenceInHours === 1 ||
    (differenceInHours > 20 && differenceInHours < 25)
  ) {
    return `${differenceInHours} час назад`;
  }

  if (differenceInHours > 1 && differenceInHours < 5) {
    return `${differenceInHours} часа назад`;
  }

  if (differenceInHours > 4 && differenceInHours < 21) {
    return `${differenceInHours} часов назад`;
  }

  // Разница в днях
  const differenceInDays = Math.floor(difference / (1000 * 60 * 60 * 24));

  // Если разница менее 7 дней, покажем количество дней назад

  if (differenceInDays === 1) {
    return `${differenceInDays} день назад`;
  }

  if (differenceInDays > 1 && differenceInDays < 5) {
    return `${differenceInDays} дня назад`;
  }

  if (differenceInDays > 4 && differenceInDays < 8) {
    return `${differenceInDays} дней назад`;
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;
  return formattedDate;
}
