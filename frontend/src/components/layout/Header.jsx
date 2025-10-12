// File: src/components/layout/Header.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import useAuthStore from "../../store/authStore";
import LanguageSwitcher from "../LanguageSwitcher";
import {
  Home,
  Heart,
  Calendar,
  User,
  LogOut,
  ChefHat,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: "/", label: t('nav.home'), icon: Home },
    { path: "/favorites", label: t('nav.favorites'), icon: Heart },
    { path: "/meal-planner", label: t('nav.mealPlanner'), icon: Calendar },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-green-600 p-2 rounded-lg group-hover:bg-green-700 transition">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800 hidden sm:block">
              Smart Recipe Finder
            </span>
            <span className="text-xl font-bold text-gray-800 sm:hidden">
              SRF
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                      active
                        ? "bg-green-100 text-green-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right Side - Language + User Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                    isActive("/profile")
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user?.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                >
                  <LogOut className="h-5 w-5" />
                  <span>{t('nav.logout')}</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  {t('auth.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  {t('auth.signUp')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="px-4 py-3 bg-gray-50 rounded-lg mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-800">
                      {user?.username}
                    </span>
                  </div>
                </div>

                {/* Navigation Links */}
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 ${
                        active
                          ? "bg-green-100 text-green-700 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}

                {/* Profile Link */}
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 ${
                    isActive("/profile")
                      ? "bg-green-100 text-green-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>{t('nav.profile')}</span>
                </Link>

                {/* Language Switcher Mobile */}
                <div className="px-4 py-3 mb-3">
                  <LanguageSwitcher />
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition mt-3"
                >
                  <LogOut className="h-5 w-5" />
                  <span>{t('nav.logout')}</span>
                </button>
              </>
            ) : (
              <>
                {/* Language Switcher for non-auth */}
                <div className="px-4 py-3 mb-3">
                  <LanguageSwitcher />
                </div>
                
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg mb-2"
                >
                  {t('auth.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center"
                >
                  {t('auth.signUp')}
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;