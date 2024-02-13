import React from "react";
import ContentLoader from "react-content-loader";

const ProfileFriendsSkeleton = (props) => (
  <ContentLoader
    speed={1}
    width={452}
    height={249}
    viewBox="0 0 452 249"
    backgroundColor="#222C36"
    foregroundColor="#384756"
    {...props}
  >
    <rect x="1" y="0" rx="10" ry="10" width="452" height="100" />
    <rect x="0" y="462" rx="0" ry="0" width="452" height="100" />
    <rect x="0" y="110" rx="10" ry="10" width="452" height="100" />
    <rect x="0" y="220" rx="10" ry="10" width="452" height="100" />
  </ContentLoader>
);

export default ProfileFriendsSkeleton;
