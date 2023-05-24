import React from "react"
import ContentLoader from "react-content-loader"

const ProjectSkeleton = (props) => (
  <ContentLoader 
    speed={2}
    width={390}
    height={220}
    viewBox="0 0 390 220"
    backgroundColor="#27323e"
    foregroundColor="#384756"
    {...props}
  >
    <rect x="0" y="0" rx="5" ry="5" width="390" height="220" />
  </ContentLoader>
)

export default ProjectSkeleton