import React from "react";
import ApplicationLogo from "./ApplicationLogo";
import { Link } from "react-router-dom";
import Email from "../assets/LogoFooter/Email.svg";
import Contact from "../assets/LogoFooter/Contact-Center.svg";
import HeadOfflice from "../assets/LogoFooter/Head-Office.svg";
import Facebook from "../assets/LogoFooter/Facebook.svg";
import Instagram from "../assets/LogoFooter/Instagram.svg";

const Footer = () => {
  return (
    <div className="border-t border-gray-300">
      <div className="container mx-auto px-6 py-6 text-center text-gray-600">
        <div className="my-10 grid md:grid-cols-3 grid-cols-1 col-span-2 md:gap-25 gap-10">
          <div className="w-full">
            <Link to={"/"} className="flex items-center px-9.5">
              <ApplicationLogo type="black" width={150} />
            </Link>
            <div>
              <div className="flex gap-3 my-4">
                <div className="mt-3">
                  <img src={HeadOfflice} alt="Head Office" width={30} />
                </div>
                <div className="text-left w-full">
                  <p className="text-gray-400 ">Head Office</p>
                  <p className="text-sm font-semibold">
                    PT Trinesia Digital
                    <br />
                    Services Jl. Wonocatur, Gg. Merpati No. 65, Banguntapan, Bantul, DI Yogyakarta, Indonesia 55198
                  </p>
                  <p className="text-gray-400 mt-2">Branch Office</p>
                  <p className="text-sm font-semibold">C/o Guidesantai GmbH Aeschengraben 29, 4051 Basel, Switzerland</p>
                </div>
              </div>
              <div className="flex items-center gap-3 my-4">
                <div>
                  <img src={Email} alt="Email" />
                </div>
                <div className="text-left">
                  <p className="text-gray-400">Email</p>
                  <p className="text-sm font-semibold">tripnesia.info@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div>
                  <img src={Contact} alt="Contact Center" />
                </div>
                <div className="text-left">
                  <p className="text-gray-400">Contact Center</p>
                  <p className="text-sm font-semibold">+62 852 3008 1586</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2 grid md:grid-cols-3 grid-cols-1 gap-3">
            <div className="text-left mb-6">
              <h3 className="text-lg font-semibold mb-2 text-black">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link to={"/about-us"} className="hover:text-gray-800 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to={"/about-us"} className="hover:text-gray-800 transition-colors">
                    Europe With TripNesia
                  </Link>
                </li>
              </ul>
            </div>
            <div className="text-left mb-6">
              <h3 className="text-lg font-semibold mb-2 text-black">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link to={"/support"} className="hover:text-gray-800 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to={"/privacy-policy"} className="hover:text-gray-800 transition-colors">
                    Privary Policy
                  </Link>
                </li>
                <li>
                  <Link to={"/term-conditions"} className="hover:text-gray-800 transition-colors">
                    Term & Conditions
                  </Link>
                </li>
              </ul>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-black mb-2">Social Media</h3>
              <ul className="space-y-2">
                <li>
                  <Link to={"/"} className="hover:text-gray-800
                   hover:scale-y-105 hover:scale-[102%] transition-colors flex items-center gap-2">
                    <img src={Facebook} alt="Logo Facebook" />Tripnesia
                  </Link>
                </li>
                <li>
                  <Link to={"/"} className="hover:text-gray-800
                   hover:scale-y-105 hover:scale-[102%] transition-colors flex items-center gap-2">
                  <img src={Instagram} alt="Logo Instagram" />
                    Tripnesia
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
