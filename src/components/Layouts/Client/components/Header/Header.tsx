import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Ticket, Search, Menu, ChevronDown, User, LogOut } from "lucide-react";
import AuthContainer from "../../../../Auth/AuthContainer";
import SearchBar from "./SearchBar";
// @ts-expect-error - JSX file without type declarations
import { useAuth } from "../../../../../contexts/AuthContext";
import {
  openAuthModal,
  setAuthModalHandler,
} from "../../../../../utils/axiosInterceptor";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout, pendingOrdersCount } = useAuth();
  const navigate = useNavigate();

  // Đăng ký handler để mở modal khi có lỗi 401
  useEffect(() => {
    setAuthModalHandler(() => setIsAuthModalOpen(true));
  }, []);

  // Đóng user menu khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function toMyTickets() {
    if (!user) {
      openAuthModal();
      return;
    }
    navigate("/my-tickets");
  }

  return (
    <header className="w-full bg-[#2dc275] shadow-sm">
      <div className="mx-5 lg:mx-auto max-w-[1250px]">
        {/* Main nav */}
        <div className="flex justify-between items-center py-4.5 flex-wrap md:flex-nowrap">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="https://salt.tkbcdn.com/ts/ds/32/dc/a2/7871f1207e8c4c2747698b5aa6d15a56.png"
              alt="tkbvnpay"
              width="100"
              height="33"
              className="w-[90px] sm:w-[110px] md:w-[127px] md:h-[41px]"
            />
          </Link>

          {/* Search */}
          <div className="hidden md:block">
            <SearchBar />
          </div>

          {/* Nav menu */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 font-semibold">
            <a
              role="button"
              onClick={toMyTickets}
              className="relative flex items-center gap-2 hover:text-black transition-colors duration-500 text-white text-sm lg:text-base cursor-pointer"
            >
              <Ticket size={22} className="hidden lg:block" />
              Vé của tôi
              {pendingOrdersCount > 0 && (
                <span className="absolute top-[-5px] left-[-10px] flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                  {pendingOrdersCount}
                </span>
              )}
            </a>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
                >
                  <img
                    src={
                      user.avatar
                        ? user.avatar.startsWith("http")
                          ? user.avatar
                          : `/images/user/${user.avatar}`
                        : `https://ui-avatars.com/api/?name=${user.fullName || user.email
                        }&background=0D8ABC&color=fff`
                    }
                    alt="Avatar"
                    className="h-8 w-8 rounded-full object-cover border-2 border-white"
                  />
                  <span className="text-sm font-medium hidden lg:inline">
                    Tài khoản
                  </span>
                  <ChevronDown size={16} className="hidden lg:block" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-12 w-56 origin-top-right transform rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1 text-gray-700">
                      <Link
                        to="/my-tickets"
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Ticket size={20} className="text-gray-600" />
                        <span>Vé của tôi</span>
                      </Link>
                      <Link
                        to="/account"
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User size={20} className="text-gray-600" />
                        <span>Tài khoản của tôi</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 border-t"
                      >
                        <LogOut size={20} className="text-gray-600" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hover:text-black transition-colors duration-500 text-white"
              >
                Đăng nhập | Đăng ký
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white text-2xl ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#828BA0]"
            />
            <input
              type="text"
              placeholder="Bạn tìm gì hôm nay?"
              className="bg-white pl-10 pr-4 py-2.5 rounded-md w-full text-sm"
            />
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-2 font-semibold bg-[#2dc275]/10 rounded-lg p-3">
            <Link
              to="/my-tickets"
              className="hover:text-amber-400 text-white py-2 border-b border-white/20"
              onClick={() => setIsMenuOpen(false)}
            >
              Vé của tôi
            </Link>
            {user ? (
              <div className="flex flex-col gap-2">
                <span className="text-white py-2">Tài khoản</span>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="hover:text-amber-400 text-white py-2 text-left"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="hover:text-amber-400 text-white py-2 text-left"
              >
                Đăng nhập | Đăng ký
              </button>
            )}
          </nav>
        )}
      </div>

      {/* Auth Modal */}
      <AuthContainer
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />
    </header>
  );
};

export default Header;
