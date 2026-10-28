'use client'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchSidebarMenu,
  setSelectedPage,
  fetchMenuIcons,
} from '@/app/redux/sidebarSlice'
import { FaAngleDown, FaAngleUp, FaBars, FaTimes } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import Loading from '@/app/common/loading'
import * as LucideIcons from 'lucide-react'
import {
  selectMenuItems,
  selectIcons,
  selectLoading,
  selectError,
} from './sidebar-selectors'

const Sidebar = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const sidebarRef = useRef(null)

  const menuItems = useSelector(selectMenuItems)
  const icons = useSelector(selectIcons)
  const loading = useSelector(selectLoading)
  const error = useSelector(selectError)

  const [openMenuId, setOpenMenuId] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const [activeSubMenuId, setActiveSubMenuId] = useState(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchSidebarMenu())
    dispatch(fetchMenuIcons())

    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setMobileSidebarOpen(false)
      }
    }

    if (mobileSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dispatch, mobileSidebarOpen])

  const toggleSubMenu = (menuId, menuName, hasSubMenu) => {
    if (!hasSubMenu) {
      dispatch(setSelectedPage({ menuId, menuName }))
      router.push(`/pages/Dashboard`)
      setMobileSidebarOpen(false)
    } else {
      setOpenMenuId((prevMenuId) => (prevMenuId === menuId ? null : menuId))
    }
  }

  const handleSubMenuClick = (
    menuId,
    subMenuId,
    subMenuName,
    subMenuPageName,
    pageName
  ) => {
    setActiveSubMenuId(subMenuId)
    setOpenMenuId(menuId)
    router.push(`/pages/${pageName}/${subMenuPageName}`)
    setMobileSidebarOpen(false)
  }

  const menuIconsMap = useMemo(() => {
    const map = {}
    icons.forEach((icon) => {
      map[icon.menuId] = icon.menuIcon
    })
    return map
  }, [icons])

  const getMenuIcon = (menuId) => {
    const IconComponent = LucideIcons[menuIconsMap[menuId]] || LucideIcons.Circle
    return <IconComponent className="w-5 h-5 text-[#062c21]" />
  }

  if (loading) return <Loading />

  return (
    <>
      <div className="fixed z-50 lg:hidden md:top-20 sm:top-20 xs:top-20 left-4">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="mt-3 bg-white text-[#062c21] rounded-md border border-emerald-200 shadow-sm"
        >
          {mobileSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      <div
        ref={sidebarRef}
        className={`
          h-screen p-4 overflow-y-auto bg-white border-r border-emerald-900/10 shadow-sm w-64 custom-scrollbar pt-[50px] pb-[80px]
          fixed lg:relative top-15  left-0 z-40
          transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div
          className="flex items-center justify-between p-2 text-xl font-bold text-[#062c21] rounded cursor-pointer hover:bg-emerald-50/80"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span>Menu</span>
          {isMenuOpen ? <FaAngleUp /> : <FaAngleDown />}
        </div>
        {isMenuOpen && (
          <div className="mt-4">
            {!loading &&
              !error &&
              menuItems.map((item) => {
                const isOpen = openMenuId === item.menuId
                return (
                  <div className="mt-2" key={item.menuId}>
                    <div
                      className="flex items-center justify-between p-2 font-semibold text-[#062c21] rounded-md cursor-pointer group hover:bg-emerald-50/80"
                      onClick={() =>
                        toggleSubMenu(
                          item.menuId,
                          item.menuName,
                          item.subMenu?.length > 0
                        )
                      }
                    >
                      <span className="flex items-center gap-3 text-[#062c21]">
                        {getMenuIcon(item.menuId)}
                        {item.menuName}
                      </span>
                      {item.subMenu?.length > 0 &&
                        (isOpen ? (
                          <FaAngleUp className="fill-[#062c21]" />
                        ) : (
                          <FaAngleDown className="fill-[#062c21]" />
                        ))}
                    </div>
                    {item.subMenu?.length > 0 && isOpen && (
                      <ul className="pl-4 space-y-2 ms-5">
                        {item.subMenu.map((sub) => (
                          <li
                            key={sub.subMenuId}
                            className={`p-2 radius-sm text-sm cursor-pointer hover:bg-emerald-50 hover:text-[#062c21] ${
                              activeSubMenuId === sub.subMenuId
                                ? 'bg-[#062c21] text-amber-300 font-semibold'
                                : 'text-[#062c21] font-normal'
                            }`}
                            onClick={() =>
                              handleSubMenuClick(
                                item.menuId,
                                sub.subMenuId,
                                sub.subMenuName,
                                sub.subMenuPageName,
                                sub.pageName
                              )
                            }
                          >
                            {sub.subMenuName}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}
          </div>
        )}
      </div>
    </>
  )
}

export default Sidebar