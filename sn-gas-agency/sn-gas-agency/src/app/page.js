"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { MdMenu, MdClose, MdHome, MdViewList, MdArticle } from "react-icons/md";

export default function Home() {
  const pathname = usePathname();
  const [activeNavbar, setActiveNavbar] = useState(pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setActiveNavbar(pathname);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="h-screen w-full relative overflow-hidden">
      <div className="h-full w-full hero">
        {/* {Navbar} */}
        <div className="h-[10%] layout mx-auto">
          <div className="flex justify-between items-center h-full w-full">
            <div className="hidden md:flex gap-36 text-white font-light items-center">
              <a
                href="/"
                className={`relative transition-all duration-300 ${
                  activeNavbar === "/" ? "active" : ""
                }`}
                onClick={() => {
                  setActiveNavbar("/");
                  closeMenu();
                }}
              >
                Home
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] w-full bg-white transform scale-x-0 transition-transform duration-300 ease-out ${
                    activeNavbar === "/" ? "scale-x-100" : ""
                  }`}
                ></span>
              </a>
              <a
                href="/product"
                className={`relative transition-all duration-300 ${
                  activeNavbar === "/product" ? "active" : ""
                }`}
                onClick={() => {
                  setActiveNavbar("/product");
                  closeMenu();
                }}
              >
                Product
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] w-full bg-white transform scale-x-0 transition-transform duration-300 ease-out ${
                    activeNavbar === "/product" ? "scale-x-100" : ""
                  }`}
                ></span>
              </a>
              <a
                href="/blogs"
                className={`relative transition-all duration-300 ${
                  activeNavbar === "/blogs" ? "active" : ""
                }`}
                onClick={() => {
                  setActiveNavbar("/blogs");
                  closeMenu();
                }}
              >
                Blogs
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] w-full bg-white transform scale-x-0 transition-transform duration-300 ease-out ${
                    activeNavbar === "/blogs" ? "scale-x-100" : ""
                  }`}
                ></span>
              </a>
            </div>
            <div className="block md:hidden">
              <button onClick={toggleMenu}>
                {isMenuOpen ? (
                  <MdClose className="text-white" size={24} />
                ) : (
                  <MdMenu className="text-white" size={24} />
                )}
              </button>
            </div>
          </div>
          <div
            className={`fixed inset-0 z-50 transform ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out bg-gray-800 bg-opacity-75`}
          >
            <div className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg flex flex-col p-4">
              <button className="self-end mb-4" onClick={toggleMenu}>
                <MdClose className="text-black" size={24} />
              </button>
              <a
                href="/"
                className={`relative flex items-center transition-all duration-300 text-black text-lg mb-4 p-2 ${
                  activeNavbar === "/" ? "bg-red-500 text-white rounded" : ""
                }`}
                onClick={() => {
                  setActiveNavbar("/");
                  closeMenu();
                }}
              >
                <MdHome className="mr-2" />
                Home
              </a>
              <a
                href="/product"
                className={`relative flex items-center transition-all duration-300 text-black text-lg mb-4 p-2 ${
                  activeNavbar === "/product"
                    ? "bg-red-500 text-white rounded"
                    : ""
                }`}
                onClick={() => {
                  setActiveNavbar("/product");
                  closeMenu();
                }}
              >
                <MdViewList className="mr-2" />
                Product
              </a>
              <a
                href="/blogs"
                className={`relative flex items-center transition-all duration-300 text-black text-lg mb-4 p-2 ${
                  activeNavbar === "/blogs"
                    ? "bg-red-500 text-white rounded"
                    : ""
                }`}
                onClick={() => {
                  setActiveNavbar("/blogs");
                  closeMenu();
                }}
              >
                <MdArticle className="mr-2" />
                Blogs
              </a>
            </div>
          </div>
        </div>{" "}
        {/* {Navbar} */}
        <Image
          className="absolute top-0 right-[5%]"
          src="/up-image.png"
          width={600}
          height={600}
          alt="Up Image"
        />
        <Image
          className="absolute top-[20%] left-0"
          src="/left-image.png"
          width={150}
          height={150}
          alt="Left Image"
        />
        <Image
          className="absolute bottom-5 right-0"
          src="/right-image.png"
          width={150}
          height={150}
          alt="Right Image"
        />
        <div className="h-[90%] flex justify-center items-center w-full relative">
          <h1 className="max-sm:text-[3rem] max-sm:tracking-[0.5rem] max-md:text-[5rem] max-md:tracking-[1rem] max-lg:text-[10rem] max-xl:text-[15rem] font 2xl:text-[20rem] text-white tracking-[5rem] uppercase font-bold">
            Ho<span className="ml-44">ME</span>
          </h1>
          <div className="absolute mr-20 max-sm:mr-0 max-md:mr-5">
            <Image
              src="/cylinder.png"
              height={1000}
              width={1000}
              alt="Cylinder Image"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
