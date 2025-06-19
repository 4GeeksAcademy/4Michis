import michisLogoWt from "../assets/img/michis_wt.png";


export const Footer = () => (
	<footer className="footer d-flex justify-content-center">
		<div className="justify-content-center">
			<div className="row text-center">
				<div className="col-12 p-3"><img className="michis-logo" src={michisLogoWt} /></div>
				<div className="col-12 p-3">Un sistema para encontrarlos, un sistema para atraerlos a todos y adoptarlos en un hogar lleno de Michis. </div>
			</div>
			<div className="row mt-auto align-items-end  text-center">
				<div className="col-12 reserved-rights p-3">All rights reserved 4Michis 2025 &copy;</div>
			</div>
		</div>
	</footer>
);
