import React, { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { WelcomeBox } from "../components/WelcomeBox";
import { CatGallery } from "../components/CatGallery";
import homeBackground from "../assets/img/cat_bg_pattern.png";



export const Home = () => {

	return (
		<div className="flex-fill home-container">
			<WelcomeBox />
			<div><CatGallery /></div>
		</div>

	);
}; 