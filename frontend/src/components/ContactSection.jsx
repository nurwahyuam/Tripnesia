import React from "react";
import Email from "../assets/LogoFooter/Email.svg";
import Contact from "../assets/LogoFooter/Contact-Center.svg";
import HeadOfflice from "../assets/LogoFooter/Head-Office.svg";

const ContactSection = () => {
  return (
    <div className="bg-white my-12">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Peta */}
        <div className="rounded-xl overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126646.25767336017!2d112.63011068066379!3d-7.2754416879333865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fbf8381ac47f%3A0x3027a76e352be40!2sSurabaya%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1761173151292!5m2!1sid!2sid"
            width="600"
            height="450"
            style={{ border: "none" }}
            loading="lazy"
          ></iframe>
        </div>

        {/* Informasi Kantor */}
        <div className="ml-28">
          <h4 className="text-xl font-bold text-gray-700 mb-4">Head Office</h4>
          <div>
            <div className="flex gap-3 my-4">
              <div className="mt-3">
                <img src={HeadOfflice} alt="Head Office" width={30} />
              </div>
              <div className="text-left w-full text-gray-800">
                <p className="text-gray-400 ">Head Office</p>
                <p className="text-md font-semibold">
                  PT Trinesia Digital Services <br /> Jl. Wonocatur, Gg. Merpati No. 65, <br/>Banguntapan, Bantul, <br /> DI Yogyakarta, Indonesia 55198
                </p>
                <p className="text-gray-400 mt-2">Branch Office</p>
                <p className="text-md font-semibold">C/o Guidesantai GmbH<br /> Aeschengraben 29, 4051 <br />Basel, Switzerland</p>
              </div>
            </div>
            <div className="flex items-center gap-3 my-4">
              <div>
                <img src={Email} alt="Email" />
              </div>
              <div className="text-left text-gray-800">
                <p className="text-gray-400">Email</p>
                <p className="text-md font-semibold">tripnesia.info@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <div>
                <img src={Contact} alt="Contact Center" />
              </div>
              <div className="text-left text-gray-800">
                <p className="text-gray-400">Contact Center</p>
                <p className="text-md font-semibold">+62 852 3008 1586</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
