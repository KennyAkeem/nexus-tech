"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import { getImagePrefix } from "@/utils/utils";
import CardSlider from "./slider";
import TypingLoop from "@/components/TypingLoop/TypingLoop";


const Hero = () => {
  const [isBuying, setIsBuyingOpen] = useState(false);
  const [isSelling, setIsSellingOpen] = useState(false);
  const BuyRef = useRef<HTMLDivElement>(null);
  const SellRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (BuyRef.current && !BuyRef.current.contains(event.target as Node)) {
        setIsBuyingOpen(false);
      }
      if (SellRef.current && !SellRef.current.contains(event.target as Node)) {
        setIsSellingOpen(false);
      }
    },
    [BuyRef, SellRef]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    document.body.style.overflow = isBuying || isSelling ? "hidden" : "";
  }, [isBuying, isSelling]);

  const leftAnimation = {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
    transition: { duration: 0.6 },
  };

  const rightAnimation = {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <section
      className="relative md:pt-40 md:pb-28 py-20 overflow-hidden z-1"
      id="main-banner"
    >
      <div className="container mx-auto lg:max-w-screen-xl px-4">
        <div className="grid grid-cols-12 gap-y-10">
          {/* Left Section */}
          <motion.div {...leftAnimation} className="lg:col-span-5 col-span-12">
            <div className="flex gap-4 items-center lg:justify-start justify-center mb-6 mt-16">
              <Image
                src={`${getImagePrefix()}images/icons/icon-bag.svg`}
                alt="icon"
                width={40}
                height={40}
              />
              <p className="text-white sm:text-2xl text-lg mb-0 text-center sm:text-left">
                Crypto On The <span className="text-primary">Go</span>
              </p>
            </div>

            <h1 className="font-medium lg:text-6xl md:text-5xl text-4xl lg:text-start text-center text-white mb-10 leading-tight">
              Trade <span className="text-primary">The Stock Market</span> With our{" "}
              <span className="text-primary">Sci-fi Strategies</span>!
            </h1>
           {/*  * Typing Loop Component */}
            <TypingLoop />
            {/* App Store Buttons */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6 sm:gap-10 mt-16">
              <Link href="#" className="hover:scale-105 duration-300">
                <Image
                  src={`${getImagePrefix()}images/hero/playstore.png`}
                  alt="Play Store"
                  width={200}
                  height={60}
                  className="w-[160px] sm:w-[200px] h-auto"
                />
              </Link>
              <Link href="#" className="hover:scale-105 duration-300">
                <Image
                  src={`${getImagePrefix()}images/hero/applestore.png`}
                  alt="App Store"
                  width={200}
                  height={60}
                  className="w-[160px] sm:w-[200px] h-auto"
                />
              </Link>
            </div>
          </motion.div>

          {/* Right Section (hidden on small screens) */}
          <motion.div
            {...rightAnimation}
            className="col-span-7 hidden lg:block"
          >
            <div className="ml-20 -mr-64">
              <Image
                src={`${getImagePrefix()}images/hero/banner-image.png`}
                alt="Banner"
                width={1150}
                height={1150}
              />
            </div>
          </motion.div>
        </div>

        {/* Card Slider */}
        <div className="mt-16">
          <CardSlider />
        </div>
      </div>

      {/* Background Gradient */}
      <div className="absolute w-60 h-60 bg-gradient-to-bl from-tealGreen to-charcoalGray blur-[400px] rounded-full -top-64 -right-14 -z-10"></div>
    </section>
  );
};

export default Hero;
