// app/about/page.tsx

import React from "react";
import Navbar from "../../../src/app/components/Navbar";
import Footer from "../../../src/app/components/Footer"; // pastikan path-nya sesuai dengan struktur folder kamu
import Link from "next/link";

export const metadata = {
    title: "About - Sarynthelebel",
};

export default function About() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-white">
                <h1 className="text-3xl font-bold text-gray-700 mb-6">About Sarynthelebel</h1>
                <p className="text-gray-500 max-w-3xl mb-10 leading-relaxed">
                    Sak wijiné wektu ana sawijining désa ing ngendi para wargané urip tentrem lan rukun. Ing désa iku, saben esuk, cah-cah cilik padha dolanan ing latar, déné wong diwasa padha nyambut gawe ing sawah lan ladang. Swasana kang ayem tentrem ndadekaké urip ing désa kuwi saya harmonis. Nanging, sawijining dina, ana kedadian kang gawe kaget. Wit gedhé ing tengah désa tiba amarga angin gedhé. Warga banjur bebarengan ndandani lan gotong royong, nuduhaké rasa kebersamaan. Mula saka iku, urip bebarengan lan rukun iku penting supaya désa tetep tentrem lan maju.
                </p>
                <Link href="/">
                    <span className="text-black font-semibold underline underline-offset-4 hover:text-gray-700 transition-all">
                        Continue shopping → 
                    </span>
                </Link>
            </div>
            <Footer />
        </>
    );
}
