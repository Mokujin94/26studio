export function useDayMonthFormatter(newDate) {

	const date = new Date(newDate)
	const months = [
		"января", "февраля", "марта", "апреля", "мая", "июня",
		"июля", "августа", "сентября", "октября", "ноября", "декабря"
	];
	const day = date.getDate();
	const month = months[date.getMonth()];
	const year = date.getFullYear();
	const currentDate = new Date();

	if (currentDate.getFullYear() !== year) {
		return `${day} ${month} ${year}`;
	} else {
		return `${day} ${month}`;
	}
};