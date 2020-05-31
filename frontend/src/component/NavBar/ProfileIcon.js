import React, { useState } from "react";
import ProfileMenu from "./ProfileMenu";

const ProfileIcon = ({ isSignedIn, userID, logOut }) => {
	const [menuOpen, setMenuOpen] = useState(false);

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	return isSignedIn ? (
		<li>
			<div onClick={toggleMenu} className='nav-padding'>
				<div className='profile'>
					<img
						alt='Account'
						src='https://a0.muscache.com/defaults/user_pic-50x50.png?v=3'
					/>
				</div>
			</div>
			<div>{menuOpen ? <ProfileMenu toggleMenu={toggleMenu} userID={userID} logOut={logOut} /> : null}</div>
		</li>
	) : null;
};

export default ProfileIcon;
