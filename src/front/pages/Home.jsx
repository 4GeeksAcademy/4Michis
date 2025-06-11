import React, { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { WelcomeBox } from "../components/WelcomeBox";
import { CatGallery } from "../components/CatGallery";



export const Home = () => {

	return (
		<div className="flex-fill">
			<WelcomeBox />
			<CatGallery />
		</div>

	);
}; 