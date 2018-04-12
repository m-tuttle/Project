import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'react-materialize';

const Navbar = () => {

    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to='/' className="brand-logo">ShowFlow</Link>
                <ul id="nav-mobile" className="right">
                    <li><Link to={`/search/${this.query}`}><Icon className="black-text" type="submit">search</Icon>
                    </Link></li>
                    <li><input className="black-text" label="Search" type="text" id="search" onChange={(event) => {this.query = event.target.value}}></input></li>
                    <li><Link to='/home' className='black-text'>Home</Link></li>
                    <li><Link to='/profile' className='black-text'>Profile</Link></li>
                </ul>
            </div>
        </nav>
    )
};

export default Navbar;