import React from "react";
import ContentLoader from "react-content-loader";

const FriendSkeleton = (props) => (
  <ContentLoader
    speed={2}
    width={390}
    height={100}
    viewBox="0 0 390 100"
    backgroundColor="#27323e"
    foregroundColor="#384756"
    {...props}
  >
    <rect x="0" y="0" rx="25" ry="25" width="390" height="100" />
  </ContentLoader>
);

export default FriendSkeleton;
