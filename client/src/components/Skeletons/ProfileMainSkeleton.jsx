import React from "react";
import ContentLoader from "react-content-loader";

const ProfileMainSkeleton = (props) => (
  <ContentLoader
    speed={1}
    width={1128}
    height={390}
    viewBox="0 0 1128 390"
    backgroundColor="#222C36"
    foregroundColor="#384756"
    {...props}
  >
    <circle cx="165" cy="165" r="125" />
    <rect x="76" y="310" rx="10" ry="10" width="178" height="40" />
    <rect x="350" y="90" rx="0" ry="0" width="276" height="58" />
    <rect x="473" y="227" rx="0" ry="0" width="36" height="0" />
    <rect x="350" y="158" rx="0" ry="0" width="310" height="22" />
    <rect x="350" y="185" rx="0" ry="0" width="312" height="22" />
    <rect x="350" y="217" rx="5" ry="5" width="730" height="123" />
  </ContentLoader>
);

export default ProfileMainSkeleton;
