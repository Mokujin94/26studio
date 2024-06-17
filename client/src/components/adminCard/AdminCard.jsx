import style from './adminCard.module.scss'

const AdminCard = ({title, icon}) => {
    return (
        <div className={style.card}>
            <div className={style.card__icon}>
                {icon}
            </div>
            <h2 className={style.card__title}>{title}</h2>
        </div>
    )
}

export default AdminCard;