import React from "react"
import ContentLoader from "react-content-loader"

const Skeleton = (props) => (
	<ContentLoader
		className="project-skeleton"
		speed={1}
		width={props.width}
		height={props.height}
		viewBox={`0 0 ${props.width} ${props.height}`}
		backgroundColor={props.backgroundColor || "#27323e"}
		foregroundColor={props.foreignColor || "#384756"}
		{...props}
	>
		<rect x="0" y="0" rx="5" ry="5" width={props.width} height={props.height} />
	</ContentLoader>
)

export default Skeleton