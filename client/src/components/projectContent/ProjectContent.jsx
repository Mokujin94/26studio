import React, { useState } from "react";

import style from "./projectContent.module.scss";
import photo from "../../resource/graphics/images/projectCard/bg.jpg";
import ProjectViewer from "../ProjectViewer/ProjectViewer";

function ProjectContent({ pathFromProject, baseURL }) {
	const [isFullscreen, setIsFullscreen] = useState(false);
	const styles = isFullscreen
		? {
			width: "calc(100% + 21px)",
			height: "101%",
			MozTransformStyle: "scale(1) translateX(-1px)",
			OTransform: "scale(1) translateX(-1px)",
			WebkitTransform: "scale(1) translateX(-1px)",
		}
		: {
			width: "167%",
			height: "950px",
			MozTransformStyle: "scale(0.6)",
			OTransform: "scale(0.6)",
			WebkitTransform: "scale(0.6)",
		};

	const styleWrap = {
		height: isFullscreen ? "100%" : "100%",
	};

	return (
		<div className={isFullscreen ? style.block_active : style.block}>
			<div
				className={style.fullscreen}
				onClick={() => setIsFullscreen((state) => !state)}
			>
				{isFullscreen ? (
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M9 4C9 3.44772 8.55228 3 8 3C7.44772 3 7 3.44772 7 4V6.5C7 6.77614 6.77614 7 6.5 7H4C3.44772 7 3 7.44772 3 8C3 8.55228 3.44772 9 4 9H6.5C7.88071 9 9 7.88071 9 6.5V4Z"
							fill="#212121"
						/>
						<path
							d="M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20V17.5C7 17.2239 6.77614 17 6.5 17H4C3.44772 17 3 16.5523 3 16C3 15.4477 3.44772 15 4 15H6.5C7.88071 15 9 16.1193 9 17.5V20Z"
							fill="#212121"
						/>
						<path
							d="M16 3C15.4477 3 15 3.44772 15 4V6.5C15 7.88071 16.1193 9 17.5 9H20C20.5523 9 21 8.55228 21 8C21 7.44772 20.5523 7 20 7H17.5C17.2239 7 17 6.77614 17 6.5V4C17 3.44772 16.5523 3 16 3Z"
							fill="#212121"
						/>
						<path
							d="M15 20C15 20.5523 15.4477 21 16 21C16.5523 21 17 20.5523 17 20V17.5C17 17.2239 17.2239 17 17.5 17H20C20.5523 17 21 16.5523 21 16C21 15.4477 20.5523 15 20 15H17.5C16.1193 15 15 16.1193 15 17.5V20Z"
							fill="#212121"
						/>
					</svg>
				) : (
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M5 6C5 5.44772 5.44772 5 6 5H8C8.55228 5 9 4.55228 9 4C9 3.44772 8.55228 3 8 3H6C4.34315 3 3 4.34315 3 6V8C3 8.55228 3.44772 9 4 9C4.55228 9 5 8.55228 5 8V6Z"
							fill="#212121"
						/>
						<path
							d="M5 18C5 18.5523 5.44772 19 6 19H8C8.55228 19 9 19.4477 9 20C9 20.5523 8.55228 21 8 21H6C4.34315 21 3 19.6569 3 18V16C3 15.4477 3.44772 15 4 15C4.55228 15 5 15.4477 5 16V18Z"
							fill="#212121"
						/>
						<path
							d="M18 5C18.5523 5 19 5.44772 19 6V8C19 8.55228 19.4477 9 20 9C20.5523 9 21 8.55228 21 8V6C21 4.34315 19.6569 3 18 3H16C15.4477 3 15 3.44772 15 4C15 4.55228 15.4477 5 16 5H18Z"
							fill="#212121"
						/>
						<path
							d="M19 18C19 18.5523 18.5523 19 18 19H16C15.4477 19 15 19.4477 15 20C15 20.5523 15.4477 21 16 21H18C19.6569 21 21 19.6569 21 18V16C21 15.4477 20.5523 15 20 15C19.4477 15 19 15.4477 19 16V18Z"
							fill="#212121"
						/>
					</svg>
				)}
			</div>
			<ProjectViewer
				pathFromProject={pathFromProject}
				baseURL={baseURL}
				styles={styles}
				styleWrap={styleWrap}
			/>
		</div>
	);
}

export default ProjectContent;
