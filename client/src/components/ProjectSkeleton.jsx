import React from "react"
import ContentLoader from "react-content-loader"

const ProjectSkeleton = (props) => (
	<ContentLoader
		className="project-skeleton"
		speed={1}
		width={308}
		height={257}
		viewBox="0 0 308 257"
		backgroundColor={props.color || "#27323e"}
		foregroundColor={props.foregroundColor || "#384756"}
		{...props}
	>
		<rect x="0" y="462" rx="0" ry="0" width="452" height="100" />
		<rect x="0" y="0" rx="10" ry="10" width="308" height="257" />
	</ContentLoader>
)

export default ProjectSkeleton