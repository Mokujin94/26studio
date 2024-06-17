import { useMemo } from 'react';

// Хук для форматирования количества ответов
const useFormatResponses = (count) => {
	const responseText = useMemo(() => {
		if (count === 0) {
			return 'нет ответов';
		}
		const lastDigit = count % 10;
		const lastTwoDigits = count % 100;
		if (lastDigit === 1 && lastTwoDigits !== 11) {
			return `${count} ответ`;
		} else if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
			return `${count} ответа`;
		} else {
			return `${count} ответов`;
		}
	}, [count]);

	return responseText;
};

export default useFormatResponses;
