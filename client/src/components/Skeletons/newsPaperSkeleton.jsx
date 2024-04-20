import React from "react"
import ContentLoader from "react-content-loader"

const NewsPaperSkeleton = (props) => (
	<ContentLoader
		speed={1}
		width={880}
		height={720}
		viewBox="0 0 880 720"
		backgroundColor="#222c36"
		foregroundColor="#384756"
		{...props}
	>
		<rect x="0" y="0" rx="5" ry="5" width="880" height="30" />
		<rect x="0" y="50" rx="5" ry="5" width="880" height="60" />
		<rect x="0" y="130" rx="5" ry="5" width="880" height="30" />
		<rect x="0" y="180" rx="5" ry="5" width="880" height="40" />
		<rect x="0" y="550" rx="5" ry="5" width="880" height="60" />
		<rect x="0" y="630" rx="5" ry="5" width="880" height="30" />
		<rect x="0" y="680" rx="5" ry="5" width="880" height="40" />
		<rect x="290" y="240" rx="5" ry="5" width="300" height="290" />
	</ContentLoader>
)

export default NewsPaperSkeleton