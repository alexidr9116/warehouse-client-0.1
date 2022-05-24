import PropTypes from 'prop-types';
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import useAuth from "../../hook/useAuth";
import Drawer from '../../component/Drawer';
import DropdownMenu from '../../component/DropdownMenu';

import { API_CLIENT, API_WAREHOUSE, ASSETS_URL, SEND_GET_REQUEST } from '../../utils/API';
import ChangePassword from '../ChangePassword';
import Navbar from './Navbar';
import { AdminRouters } from '../../routers/AdminRouters';
import { DefaultRouters } from '../../routers/DefaultRouters';
import { setNotificationsToStore } from '../../store/action/notificationAction';



Header.propTypes = {
  dashboard: PropTypes.bool
}
const languages = {
  mn: {
    language: 'mn', icon: 'twemoji:flag-mongolia'
  },
  ch: {
    language: 'ch', icon: 'twemoji:flag-china'
  },
  en: {
    language: 'en', icon: 'twemoji:flag-for-flag-united-kingdom'
  }
}
export default function Header({ dashboard = false }) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState();
  const [language, setLanguage] = useState(languages.mn);
  const [changePassword, setChangePassword] = useState(false);
  const { i18n, t } = useTranslation();
  const {warehouse} = useSelector((state)=>state.warehouse);
  const { pathname } = useLocation();
  const { notifications } = useSelector((state) => state.notification);
  const handleLanguage = (lang, i) => {
    localStorage.setItem("language", lang);
    setLanguage({ language: lang, icon: i });
    i18n.changeLanguage(lang);
  };

  const handleBilling = () => {
    if (user && user !== null) {
      navigate('/client/billing', { replace: true })
    }
    else {
      toast.error("You must login with mobile")
    }
  }
  const handleProfile = () => {
    if (user && user !== null) {
      navigate('/client/profile', { replace: true })
    }
    else {
      toast.error("You must login with mobile")
    }
  }

  const handlePassword = () => {
    setChangePassword(true);
  }
  useEffect(() => {
    const lang = localStorage.getItem("language") || "en";
    setLanguage(lang === "en" ? languages.en : (lang === "mn" ? languages.mn : languages.ch));
  }, [])
  useEffect(() => {
    const loadNotification = async () => {

      const res = await SEND_GET_REQUEST(API_CLIENT.getReceivedNotifications);
      if (res.status === 200) {
        setNotificationsToStore(res.data.notifications);
      }
    }
    if (isAuthenticated) {
      loadNotification();
     
    }


  }, [isAuthenticated]);
  return (
    <div className="p-2  z-50">
      <div className="container flex justify-between  max-w-6xl">
        <div className="flex ">
          {isAuthenticated &&
            <div className='flex sm:hidden'>
              <IconButton onClick={() => setDrawer(true)}><MenuIcon></MenuIcon></IconButton>
            </div>
          }

          <Link to="/" className="mr-5 hidden md:flex">
            <div className='flex items-center gap-2'><img src="../../assets/logo.png" className="h-16 w-16" alt="logo" /></div>
          </Link>
          {warehouse && !warehouse?.name &&
            <Link to="/" className="mr-5 flex md:hidden">
              <div className='flex items-center gap-2'><img src="../../assets/logo.png" className="h-16 w-16" alt="logo" /></div>
            </Link>
          }

        </div>
        {/* menu */}
        <div className='flex md:hidden uppercase items-center' ><label className='text-lg'>{warehouse?.name || ""}</label></div>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className={`font-bold text-lg ${(pathname === '/') ? 'text-red-500' : ''}`} >{t('menu.home')}</Link>
          {isAuthenticated && <>
            <Link to="/dashboard" className={`font-bold text-lg ${(pathname === '/dashboard') ? 'text-red-500' : ''}`} >{t('menu.dashboard')}</Link>
            <Link to="/client/profile" className={`font-bold text-lg ${(pathname === '/client/profile') ? 'text-red-500' : ''}`} >{t('menu.profile')}</Link>
            <Link to="/client/get-products" className={`font-bold text-lg ${(pathname === '/client/get-products') ? 'text-red-500' : ''}`} >{t('menu.myOrder')}</Link>
          </>}
          {!isAuthenticated && <>
            <Link to="/auth/login" className="font-bold text-lg ">{t('menu.login')}</Link></>}
          <Link to="/warehouse-rank" className={`font-bold text-lg ${(pathname === '/warehouse-rank') ? 'text-red-500' : ''}`} >{t('menu.warehouseRank')}</Link>
          <Link to="/maintenance" className={`font-bold text-lg ${(pathname === '/maintenance') ? 'text-red-500' : ''}`} >{t('menu.support')}</Link>

        </div>
        <div className="flex items-center">

          {isAuthenticated &&
            <div className="indicator mr-1">

              {notifications && notifications.filter(n => !n.read).length > 0 && <Link to="/client/notification"> <span className="indicator-item badge badge-error text-white">{notifications.filter(n => !n.read).length}</span>
                <div className="hover:text-sky-500 cursor-pointer"><Icon icon="akar-icons:bell" height={30} width={30} /></div>
              </Link>
              }
              {(!notifications || (notifications && notifications.filter(n => !n.read).length === 0)) && <div className="hover:text-sky-500 cursor-pointer"><Icon icon="akar-icons:bell" height={30} width={30} /></div>}
            </div>
          }
          <DropdownMenu
            summary={
              <label className="flex items-center gap-2 mx-2">
                {user !== null && user.avatar && user.avatar !== '' &&
                  <img src={`${ASSETS_URL.root}${user.avatar}`} alt="avatar"
                    className="rounded-full w-10 h-10 " width={40} height={40}
                  />
                }
                {(!user || user === null || user.avatar === '') &&
                  <img src={'../../assets/avatar.jpg'} alt="avatar"
                    className="rounded-full w-10 h-10 " width={40} height={40}
                  />
                }

                <div className="hidden md:block">
                  <p className="text-sm font-bold">{user !== null ? user.name : ""}</p>
                  <p className="text-sm">{user !== null ? user.mobile : ""}</p>
                </div>
              </label>
            }
          >
            <div className="shadow bg-base-100 rounded px-2 py-1 mt-2 min-w-max last:border-none">
              <div className="py-1 flex ">
                <div className={`btn btn-ghost btn-sm gap-2 justify-start ${language.language === "mn" && 'btn-active'}`}
                  onClick={() => { handleLanguage('mn', 'twemoji:flag-mongolia') }} >
                  <Icon className="cursor-pointer" icon="twemoji:flag-mongolia" width={24} />

                </div>
                <div className={`btn btn-ghost btn-sm gap-2 justify-start ${language.language === "ch" && 'btn-active'}`}
                  onClick={() => { handleLanguage('ch', 'twemoji:flag-china') }} >
                  <Icon className="cursor-pointer" icon="twemoji:flag-china" width={24} />

                </div>
                <div className={`btn btn-ghost btn-sm gap-2 justify-start ${language.language === "en" && 'btn-active'}`}
                  onClick={() => handleLanguage('en', 'twemoji:flag-for-flag-united-kingdom')} >
                  <Icon className="cursor-pointer " icon="twemoji:flag-for-flag-united-kingdom" width={24} />

                </div>
              </div>
              {!isAuthenticated && <>
                <div className='border-t py-1'>
                  <button className='btn btn-sm btn-ghost w-full justify-start gap-3' onClick={() => navigate('/', { replace: true })}>
                    {t('menu.home')}
                  </button>
                </div>
                <div className='border-t py-1'>
                  <button className='btn btn-sm btn-ghost w-full justify-start gap-3' onClick={() => navigate('/auth/login', { replace: true })}>
                    {t('menu.login')}
                  </button>
                </div>
                <div className='border-t py-1'>
                  <button className='btn btn-sm btn-ghost w-full justify-start gap-3' onClick={() => navigate('/warehouse-rank', { replace: true })}>
                    {t('menu.warehouseRank')}
                  </button>
                </div>
              </>
              }
              {isAuthenticated && user && !user.role.includes("Staff") &&

                <div className='border-t py-1'>
                  <button className='btn btn-sm btn-ghost w-full justify-start gap-3' onClick={() => navigate('/dashboard')}>
                    {t('menu.dashboard')}
                  </button>
                </div>

              }

              {isAuthenticated && !user.role.includes("Staff") && <>
                <div className="border-t py-1">
                  <button className="btn btn-ghost btn-sm w-full justify-start gap-3" onClick={handlePassword} >

                    {t('words.changePassword')}
                  </button>
                </div>

                <div className='border-t py-1'>
                  <button className='btn btn-sm btn-ghost w-full justify-start gap-3' onClick={handleProfile}>
                    {t('menu.profile')}
                  </button>
                </div></>
              }
              {
                user && isAuthenticated && user.role.includes('admin') && <>
                  <div className='border-t py-1'>
                    <button className='btn btn-sm btn-ghost w-full justify-start gap-3' onClick={handleBilling}>
                      {t('menu.billing')}
                    </button>
                  </div>
                  <div className='border-t py-1'>
                    <button className='btn btn-sm w-full btn-ghost  justify-start gap-3' onClick={() => { navigate('/admin/warehouse', { replace: true }) }}>
                      {t('menu.warehouse')}
                    </button>
                  </div>

                </>
              }
              {
                user && isAuthenticated && user.role.includes('super-admin') &&
                <div className='border-t py-1'>
                  <button className='btn btn-sm w-full btn-ghost  justify-start gap-3' onClick={() => { navigate('/admin/users', { replace: true }) }}>
                    {t('menu.users')}
                  </button>
                </div>
              }
              {
                isAuthenticated && user && user.role.includes("Staff") &&
                <>
                  <div className='py-1 border-t'>
                    <button className='btn btn-sm w-full btn-ghost  justify-start gap-3' onClick={() => {
                      navigate('/staff/goods-list')
                    }}>
                      {t('menu.goodsList')}
                    </button>
                  </div>

                  <div className='py-1 border-t'>
                    <button className='btn btn-sm w-full btn-ghost  justify-start gap-3' onClick={() => {
                      navigate('/staff/register-goods')
                    }}>
                      {t('menu.register')}
                    </button>
                  </div>


                  <div className='py-1 border-t'>
                    <button className='btn btn-sm w-full btn-ghost  justify-start gap-3' onClick={() => {
                      navigate('/staff/left-goods')
                    }}>
                      {t('menu.left')}
                    </button>
                  </div>
                  <div className='py-1 border-t'>
                    <button className='btn btn-sm w-full btn-ghost  justify-start gap-3' onClick={() => {
                      navigate('/staff/arrived-goods')
                    }}>
                      {t('menu.arrived')}
                    </button>
                  </div>
                </>
              }
              {
                user && isAuthenticated &&
                <div className='py-1 border-t'>
                  <button className='btn btn-sm w-full btn-ghost  justify-start gap-3' onClick={() => {
                    logout();
                  }}>
                    {t('menu.logout')}
                  </button>
                </div>
              }
            </div>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex  w-full mt-1">
        <span className="bg-gray-100 h-[1px] flex-grow" />

      </div>
      {/* drawer */}
      {isAuthenticated &&
        <Drawer
          side="left"
          onClose={() => { setDrawer(false) }}
          open={drawer}
          className="bg-white w-[300px]"
        >

          <Navbar routers={(user && user.role.includes('admin') ? AdminRouters : DefaultRouters)} onClose={() => setDrawer(false)}>
          </Navbar>
        </Drawer>
      }
      {/* password modal */}
      {changePassword && <ChangePassword onClose={() => setChangePassword(false)} />}
    </div>
  );
}