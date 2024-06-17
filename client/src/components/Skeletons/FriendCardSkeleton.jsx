import React from "react";
import ContentLoader from "react-content-loader";

const FriendCardSkeleton = (props) => (
	<ContentLoader
		className="friend-skeleton"
		speed={1}
		width={452}
		height={100}
		viewBox="0 0 452 100"
		backgroundColor="#222C36"
		foregroundColor="#384756"
		{...props}
	>
		<rect x="0" y="0" rx="10" ry="10" width="452" height="100" />
		<rect x="0" y="462" rx="0" ry="0" width="452" height="100" />
	</ContentLoader>
);

export default FriendCardSkeleton;
