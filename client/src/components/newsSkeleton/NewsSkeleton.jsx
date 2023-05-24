import React from "react"
import ContentLoader from "react-content-loader"

function NewsSkeleton(props) {
    return (
        <ContentLoader 
            speed={2}
            width={390}
            height={450}
            viewBox="0 0 390 450"
            backgroundColor="#27323e"
            foregroundColor="#384756"
            {...props}
        >
            <rect x="0" y="0" rx="35" ry="35" width="390" height="450" /> 
        </ContentLoader>
        
    );
}

export default NewsSkeleton

