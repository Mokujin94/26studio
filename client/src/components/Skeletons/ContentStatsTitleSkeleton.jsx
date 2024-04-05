import React from "react"
import ContentLoader from "react-content-loader"

const ContentStatsTitleSkeleton = (props) => (
	<ContentLoader
		speed={1}
		width={960}
		height={24}
		viewBox="0 0 960 24"
		backgroundColor="#27323e"
		foregroundColor="#384756"
		{...props}
	>
		<rect x="0" y="462" rx="0" ry="0" width="452" height="100" />
		<rect x="0" y="0" rx="5" ry="5" width="960" height="24" />
	</ContentLoader>
)

export default ContentStatsTitleSkeleton