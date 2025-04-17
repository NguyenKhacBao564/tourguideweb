// src/utils/sidebarItems.js
import { FaUserLarge } from "react-icons/fa6";
import { BiCalendarCheck } from "react-icons/bi";
import { MdDiscount } from "react-icons/md";
import { IoLogOutSharp } from "react-icons/io5";

export const BusinessEmployeeSideBar = [
  { label: "Khách hàng", icon: <FaUserLarge />, link: "/businessemployee/customer" },
  { label: "Lịch đặt", icon: <BiCalendarCheck />, link: "/businessemployee/managetour" },
  { label: "Khuyến mãi", icon: <MdDiscount />, link: "/businessemployee/promotion" },
  { label: "Đăng xuất", icon: <IoLogOutSharp />, link: "/logout", isLogout: true },
];

export const AdminSideBar = [
  { label: "Tổng quan", icon: <FaUserLarge />, link: "/admin/dashboard" },
  { label: "Nhân viên", icon: <BiCalendarCheck />, link: "/admin/nhan-vien" },
  { label: "Quản lý tour", icon: <IoLogOutSharp />, link: "/admin/quan-ly-tour" }, // Không có isLogout: true
  { label: "Quản lý chi nhánh", icon: <MdDiscount />, link: "/admin/quan-ly-chi-nhanh" },
  { label: "Đăng xuất", icon: <IoLogOutSharp />, link: "/logout", isLogout: true },
];

export const ConsultantEmployeeSideBar = [
  { label: "ChatBot AI", icon: <FaUserLarge />, link: "/consultantemployee/chatbot" },
  { label: "Yêu cầu hỗ trợ", icon: <BiCalendarCheck />, link: "/consultantemployee/request-support" },
  { label: "Đăng xuất", icon: <IoLogOutSharp />, link: "/logout", isLogout: true },
];