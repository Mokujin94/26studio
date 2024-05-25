import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getLinkPreview } from '../../http/linkApi';
import { Link } from "react-router-dom";

const PreviewWrapper = styled.div`
	margin: 5px 0;
  border-left: 3px solid #3c4752;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #b1cff1;
`;

const Image = styled.img`
  width: 100%;
  border-radius: 8px;
`;

const Title = styled.h4`
	color: #222c36;
	font-size: 14px;
`;

const Description = styled.p`
  margin: 5px 0;
	color: #222c36;
	font-size: 14px;
	line-height: 18px;
	display: -webkit-box;
	-webkit-line-clamp: 4;
	-webkit-box-orient: vertical;
	overflow: hidden;
	white-space: pre-wrap;
	word-break: break-word;
`;

const LinkPreview = ({ isScrollBottom, windowChatRef, url }) => {
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

	if (!metadata) {
		return null;
	}

	return (
		<Link to={url} target='_blank'>
			<PreviewWrapper>
				<Title>{metadata.title}</Title>
				<Description>{metadata.description}</Description>
				{metadata.image ? <Image src={metadata.image} alt={metadata.title} onLoad={onLoadImage} /> : metadata.favicon ? <Image src={metadata.favicon} alt={metadata.title} onLoad={onLoadImage} /> : null}
				{/* <a href={url} target="_blank" rel="noopener noreferrer">{url}</a> */}
			</PreviewWrapper>
		</Link>

	);
};

LinkPreview.propTypes = {
	url: PropTypes.string.isRequired,
};

export default LinkPreview;