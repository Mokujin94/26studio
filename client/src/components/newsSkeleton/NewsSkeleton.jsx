import React from "react";
import ContentLoader from "react-content-loader";

import style from "./newsSkeleton.module.scss";

function NewsSkeleton(props) {
	return (
		<ContentLoader
			speed={1}
			width={300}
			height={295}
			viewBox="0 0 300 295"
			backgroundColor="#27323e"
			foregroundColor="#384756"
			className={style.skeleton}
			{...props}
		>
			<rect x="0" y="462" rx="0" ry="0" width="452" height="100" />
			<rect x="0" y="0" rx="10" ry="10" width="300" height="295" />
		</ContentLoader>
	);
}

export default NewsSkeleton;
