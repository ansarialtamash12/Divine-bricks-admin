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
      <button
        type="button"
        aria-label={mobileSidebarOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        className="fixed z-[70] left-3 top-[68px] lg:hidden flex items-center justify-center w-10 h-10 bg-white text-[#062c21] rounded-md border border-emerald-200 shadow-md"
      >
        {mobileSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close menu overlay"
          className="fixed inset-0 z-[35] bg-slate-900/30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div
        ref={sidebarRef}
        className={`
          fixed top-[60px] bottom-0 left-0 z-40 w-64 px-3 py-4 overflow-y-auto bg-white border-r border-emerald-900/10 shadow-lg custom-scrollbar
          lg:relative lg:top-auto lg:bottom-auto lg:z-auto lg:h-[calc(100dvh-60px)] lg:flex-none lg:shadow-sm
          transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div
          className="flex items-center justify-between p-2 pl-12 text-xl font-bold text-[#062c21] rounded cursor-pointer hover:bg-emerald-50/80 lg:pl-2"
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
                      // 👇 CHANGE 2: P-2 ki jagah px-2 py-1.5 kiya taaki horizontal space bache
                      className="flex items-center justify-between px-2 py-2 font-semibold text-[#062c21] rounded-md cursor-pointer group hover:bg-emerald-50/80"
                      onClick={() =>
                        toggleSubMenu(
                          item.menuId,
                          item.menuName,
                          item.subMenu?.length > 0
                        )
                      }
                    >
                      {/* 👇 CHANGE 3: gap-3 se gap-2 kiya aur text-[15px] set kiya */}
                      <span className="flex items-center gap-2 text-[#062c21] text-[15px] min-w-0">
                        <span className="shrink-0">{getMenuIcon(item.menuId)}</span>
                        <span className="truncate">{item.menuName}</span>
                      </span>
                      
                      {item.subMenu?.length > 0 &&
                        (isOpen ? (
                          <FaAngleUp className="fill-[#062c21] shrink-0" />
                        ) : (
                          <FaAngleDown className="fill-[#062c21] shrink-0" />
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