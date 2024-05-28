import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import style from './linkPreview.module.scss';
import { getLinkPreview } from '../../http/linkApi';
import { Link } from "react-router-dom";

const LinkPreview = ({ isOther, isScrollBottom, windowChatRef, url }) => {
	const [metadata, setMetadata] = useState(null);

	useEffect(() => {
		const fetchMetadata = async () => {
			try {
				getLinkPreview(url).then(data => {
					console.log(data)
					setMetadata(data);

				}).then(() => {
					if (isScrollBottom) {
						setTimeout(() => {
							if (windowChatRef.current)
								windowChatRef.current.scrollTo({
									top: windowChatRef.current.scrollHeight,
									behavior: "smooth",
								});
						}, 0)

					}
				});

			} catch (error) {
				console.error('Error fetching link preview metadata:', error);
			}
		};

		fetchMetadata();
	}, [url]);

	const onLoadImage = () => {
		if (isScrollBottom && (metadata.image || metadata.favicon)) {
			setTimeout(() => {
				if (windowChatRef.current)
					windowChatRef.current.scrollTo({
						top: windowChatRef.current.scrollHeight,
						behavior: "smooth",
					});
			}, 0)

		}
	}

	if (!metadata || (!metadata.title && !metadata.description) || (!metadata.favicon && !metadata.image && (!metadata.title || !metadata.description))) {
		return null;
	}




	return (
		<Link to={url} target='_blank'>
			<div className={isOther ? style.linkPreview__other + " " + style.linkPreview : style.linkPreview}>
				<div className={style.linkPreview__wrapper} style={(metadata.title && !metadata.description) ? { alignItems: "center" } : null}>
					{(metadata.favicon && !metadata.image) && <img src={metadata.favicon} alt={metadata.title} className={style.linkPreview__favicon} />}
					<div className={style.linkPreview__info}>
						{metadata.title && <h2 className={style.linkPreview__info__title}>{metadata.title.trim()}</h2>}
						{metadata.description && <p className={style.linkPreview__info__descr}>{metadata.description.trim()}</p>}
					</div>
				</div>
				{metadata.image && <img src={metadata.image} alt={metadata.title} className={style.linkPreview__image} />}
			</div>
		</Link>

	);


};

LinkPreview.propTypes = {
	url: PropTypes.string.isRequired,
};

export default LinkPreview;