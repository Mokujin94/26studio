import { Link } from "react-router-dom";
import AdminCard from "../../components/adminCard/AdminCard";
import { GROUP_MANAGEMENT_ROUTE } from "../../utils/consts";
import { useEffect } from "react";

const Admin = () => {

	const cards = [
		{
			id: 0, title: 'Группы', icon: <svg xmlns="http://www.w3.org/2000/svg" width="118" height="118" viewBox="0 0 118 118" fill="none">
				<path d="M94.5507 30.4402C94.1787 30.3812 93.7997 30.3812 93.4277 30.4402C89.4834 30.2978 85.749 28.6304 83.0138 25.7902C80.2785 22.95 78.7568 19.1596 78.7701 15.2201C78.7701 6.78415 85.567 0 94.0188 0C98.063 0 101.942 1.60354 104.801 4.45786C107.661 7.31219 109.267 11.1835 109.267 15.2201C109.257 19.1624 107.719 22.9479 104.976 25.7846C102.233 28.6213 98.4976 30.2895 94.5507 30.4402ZM88.4631 73.3868C96.5602 74.7437 105.485 73.3278 111.75 69.1394C120.083 63.5941 120.083 54.5092 111.75 48.9639C105.426 44.7754 96.3829 43.3596 88.2858 44.7754M23.4493 30.4402C23.8039 30.3812 24.2176 30.3812 24.5723 30.4402C28.5166 30.2978 32.251 28.6304 34.9862 25.7902C37.7215 22.95 39.2432 19.1596 39.2299 15.2201C39.2299 6.78415 32.433 0 23.9812 0C19.937 0 16.0585 1.60354 13.1988 4.45786C10.3391 7.31219 8.73253 11.1835 8.73253 15.2201C8.79164 23.4791 15.293 30.1452 23.4493 30.4402ZM29.5369 73.3868C21.4398 74.7437 12.5152 73.3278 6.25019 69.1394C-2.0834 63.5941 -2.0834 54.5092 6.25019 48.9639C12.5743 44.7754 21.6171 43.3596 29.7143 44.7754M59.0887 74.5077C58.7167 74.4487 58.3377 74.4487 57.9657 74.5077C54.0213 74.3653 50.2869 72.6978 47.5517 69.8577C44.8165 67.0175 43.2947 63.2271 43.308 59.2876C43.308 50.8516 50.1049 44.0675 58.5567 44.0675C62.6009 44.0675 66.4795 45.671 69.3392 48.5254C72.1989 51.3797 73.8054 55.251 73.8054 59.2876C73.7463 67.5466 67.2449 74.2717 59.0887 74.5077ZM41.8896 93.0904C33.556 98.6357 33.556 107.721 41.8896 113.266C51.3461 119.578 66.8312 119.578 76.2878 113.266C84.6213 107.721 84.6213 98.6357 76.2878 93.0904C66.8903 86.8372 51.3461 86.8372 41.8896 93.0904Z" fill="white" />
			</svg>, disabled: false
		},
		{
			id: 1, title: 'Новости', icon: <svg xmlns="http://www.w3.org/2000/svg" width="118" height="118" viewBox="0 0 24 24" fill="none">
				<path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				<path d="M17.5 17.0801H15.65" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				<path d="M12.97 17.0801H6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				<path d="M17.5 13.3201H11.97" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				<path d="M9.27 13.3201H6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
			</svg>, disabled: true
		},
		{
			id: 2, title: 'Проекты', icon: <svg xmlns="http://www.w3.org/2000/svg" width="114" height="118" viewBox="0 0 114 118" fill="none">
				<path fillRule="evenodd" clipRule="evenodd" d="M57 2.95C57 1.32076 55.405 0 53.4375 0H28.5C12.7599 0 0 10.5661 0 23.6V94.4C0 107.434 12.7599 118 28.5 118H85.5C101.24 118 114 107.434 114 94.4V50.15C114 48.5208 112.405 47.2 110.438 47.2H92.625C72.9499 47.2 57 33.9924 57 17.7V2.95ZM108.439 35.4C110.808 35.4 112.51 33.5057 111.372 31.7851C110.406 30.3242 109.187 28.9709 107.739 27.7719L80.4619 5.18421C79.0139 3.98523 77.3797 2.97603 75.6155 2.17594C73.5376 1.23361 71.25 2.64347 71.25 4.60524V17.7C71.25 27.4754 80.8199 35.4 92.625 35.4H108.439ZM35.625 41.3C31.69 41.3 28.5 43.9415 28.5 47.2C28.5 50.4585 31.69 53.1 35.625 53.1H42.75C46.685 53.1 49.875 50.4585 49.875 47.2C49.875 43.9415 46.685 41.3 42.75 41.3H35.625ZM28.5 70.8C28.5 67.5415 31.69 64.9 35.625 64.9H78.375C82.31 64.9 85.5 67.5415 85.5 70.8C85.5 74.0585 82.31 76.7 78.375 76.7H35.625C31.69 76.7 28.5 74.0585 28.5 70.8ZM28.5 94.4C28.5 91.1415 31.69 88.5 35.625 88.5H78.375C82.31 88.5 85.5 91.1415 85.5 94.4C85.5 97.6585 82.31 100.3 78.375 100.3H35.625C31.69 100.3 28.5 97.6585 28.5 94.4Z" fill="white" />
			</svg>, disabled: true
		},
		{
			id: 3, title: 'Роли', icon: <svg xmlns="http://www.w3.org/2000/svg" width="118" height="118" viewBox="0 0 24 24" fill="none">
				<path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				<path d="M19.2101 15.74L15.67 19.2801C15.53 19.4201 15.4 19.68 15.37 19.87L15.18 21.22C15.11 21.71 15.45 22.05 15.94 21.98L17.29 21.79C17.48 21.76 17.75 21.63 17.88 21.49L21.42 17.95C22.03 17.34 22.32 16.63 21.42 15.73C20.53 14.84 19.8201 15.13 19.2101 15.74Z" stroke="white" strokeWidth="1.5" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
				<path d="M18.7001 16.25C19.0001 17.33 19.84 18.17 20.92 18.47" stroke="white" strokeWidth="1.5" stroke-miterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
				<path d="M3.40991 22C3.40991 18.13 7.25994 15 11.9999 15C13.0399 15 14.0399 15.15 14.9699 15.43" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
			</svg>, disabled: true
		}
	]

	useEffect(() => {
		document.title = "Админ панель";
	}, [])

	return (
		<div className="admin">
			<div className="container">
				<h1 className="admin__title">Панель управления</h1>
				<div className="admin__wrapper">
					{cards.map(({ id, title, icon, disabled }) => {
						if (disabled) {
							return (
								<div className='admin__card__disabled'>
									<AdminCard key={id} title={title} icon={icon} />
								</div>
							)
						}
						return (
							<Link to={GROUP_MANAGEMENT_ROUTE} >
								<AdminCard key={id} title={title} icon={icon} />
							</Link>
						)
					})}
				</div>
			</div>
		</div>
	)
}

export default Admin;