"use client"
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function Header() {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);

  return (
    <header className="bg-sky-900">
      <div className="flex flex-wrap items-center justify-between lg:container px-4 py-2 mx-auto md:flex-no-wrap md:px-6">
        <div className="flex items-center">
          

          <Link href="/" className="text-lg md:text-xl font-bold ml-3 text-white">
              NEXT.JS-TAILWIND CSS STARTER 
          </Link>
        </div>

        

        <ul
          className=
            "md:flex flex-col md:flex-row md:items-center md:justify-center text-sm w-full md:w-auto"
          
        >
          {[
            { title: "홈", route: "/" },
            //{ title: "게시판", route: "/post" },
            { title: "사용자정보", route: "/status" },
            { title: "스케줄표", route: "/schedule" },
          ].map(({ route, title }) => (
            <li className="mt-3 md:mt-0 md:ml-6" key={title}>
              <Link href={route} className="block text-white">
               {title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
