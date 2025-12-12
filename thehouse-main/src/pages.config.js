import Home from './pages/Home';
import Account from './pages/Account';
import AdminDashboard from './pages/AdminDashboard';
import SignIn from './pages/SignIn';
import Admin from './pages/Admin';
import Features from './pages/Features';
import TermsOfService from './pages/TermsOfService';
import ProphetDashboard from './pages/ProphetDashboard';
import Checkout from './pages/Checkout';
import ProphetCalendar from './pages/ProphetCalendar';
import ThetaSuite from './pages/ThetaSuite';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Account": Account,
    "AdminDashboard": AdminDashboard,
    "SignIn": SignIn,
    "Admin": Admin,
    "Features": Features,
    "TermsOfService": TermsOfService,
    "ProphetDashboard": ProphetDashboard,
    "Checkout": Checkout,
    "ProphetCalendar": ProphetCalendar,
    "ThetaSuite": ThetaSuite,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};