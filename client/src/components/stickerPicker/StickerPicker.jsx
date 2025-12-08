import React, { useState } from 'react';
import style from './stickerPicker.module.scss';
import { stickerPacks } from '../../data/stickers';

const StickerPicker = ({ onStickerSelect, onClose }) => {
	const [activePack, setActivePack] = useState(stickerPacks[0]?.id || '');

	const currentPack = stickerPacks.find(pack => pack.id === activePack);

	const handleStickerClick = (sticker) => {
		onStickerSelect(sticker);
	};

	return (
		<div className={style.stickerPicker}>
			{/* Заголовок */}
			<div className={style.stickerPicker__header}>
				<span className={style.stickerPicker__title}>Стикеры</span>
			</div>

			{/* Вкладки паков */}
			<div className={style.stickerPicker__tabs}>
				{stickerPacks.map(pack => (
					<button
						key={pack.id}
						className={`${style.stickerPicker__tab} ${activePack === pack.id ? style.stickerPicker__tab_active : ''}`}
						onClick={() => setActivePack(pack.id)}
						title={pack.name}
					>
						{pack.icon}
					</button>
				))}
			</div>

			{/* Сетка стикеров */}
			<div className={style.stickerPicker__content}>
				{currentPack && (
					<div className={style.stickerPicker__grid}>
						{currentPack.stickers.map(sticker => (
							<button
								key={sticker.id}
								className={style.stickerPicker__sticker}
								onClick={() => handleStickerClick(sticker)}
							>
								{sticker.type === 'emoji' ? (
									<span className={style.stickerPicker__stickerEmoji}>
										{sticker.emoji}
									</span>
								) : (
									<img
										src={sticker.url}
										alt=""
										className={style.stickerPicker__stickerImage}
									/>
								)}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default StickerPicker;


