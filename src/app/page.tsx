"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatedText } from "@/components/ui/text-animation";
import ReactHowler from "react-howler";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollDrivenBoxes } from "@/components/three/ScrollDrivenBoxes";
import { Loader } from "@/components/Elements/Loader";
import { Suspense } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import products from "@/data/products.json" assert { type: "json" };
import merch from "@/data/merch.json" assert { type: "json" };
import FillOnHoverButton from "@/components/ui/fillOnHoverButton";
import { useLenis } from "lenis/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const lenis = useLenis();
  const [playing, setPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showLoader, setShowLoader] = useState(true);
  const [activeMerchTab, setActiveMerchTab] = useState<"caps" | "mugs" | "bottles" | "shirt">("caps");
  const [images, setImages] = useState<string[]>([]);

  const footerBtns = ["LinkedIn", "Contact Us", "Instagram"];

  // whenever tab changes (or on mount), load that tab’s images
  useEffect(() => {
    const imgs = merch[activeMerchTab].images;
    setImages(imgs);
  }, [activeMerchTab]);

  const handleSideClick = (idx: any) => {
    // Make a copy so we don’t mutate state directly
    const newImages = [...images];
    // Swap the clicked thumbnail with the main image
    [newImages[0], newImages[idx]] = [newImages[idx], newImages[0]];
    setImages(newImages);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".section",
        { opacity: 0, scale: 0.98 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".section",
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Parallax: images stay in place while section is in view, move up as you scroll past
      gsap.to(".parallax-img-1", {
        y: -170,
        ease: "power1.out",
        scrollTrigger: {
          trigger: ".section.min-h-screen",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".parallax-img-2", {
        y: -110,
        ease: "power1.out",
        scrollTrigger: {
          trigger: ".section.min-h-screen",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".parallax-img-3", {
        y: -250,
        ease: "power1.out",
        scrollTrigger: {
          trigger: ".section.min-h-screen",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".parallax-img-4", {
        y: -40,
        ease: "power1.out",
        scrollTrigger: {
          trigger: ".section.min-h-screen",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  function FallbackImage({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) {
    const [errored, setErrored] = useState(false);

    if (errored) {
      return (
        <div
          className={
            (className ?? "") +
            " bg-gray-200 flex items-center justify-center overflow-hidden"
          }
        >
          {alt}
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={() => setErrored(true)}
      />
    );
  }

  // disable lenis while loader is visible, reset scroll to top,
  // then re-enable when loader finishes
  useEffect(() => {
    if (!lenis) return;
    if (showLoader) {
      lenis.stop();
      window.scrollTo(0, 0);
    } else {
      lenis.start();
    }
  }, [lenis, showLoader]);

  return (
    <div className="relative w-full overflow-x-hidden bg-background text-foreground">
      {showLoader && (
        <Loader
          onContinue={() => {
            setShowLoader(false);
            setPlaying(true);
          }}
        />
      )}

      <ReactHowler src="/music.mp3" playing={playing} />
      <div className="fixed top-12 right-10 -translate-x-1/2 z-49">
        <MagneticButton
          playing={playing}
          onClick={() => setPlaying(p => !p)}
        />
      </div>

      <div className="relative z-10">
        <section className="section h-screen flex items-end justify-end bg-[url('/coffee.png')] bg-cover bg-center backdrop-blur-xd pr-16 pb-16">
          <div className=" text-left space-y-2">
            <h1 className="text-4xl font-normal font-inter text-white">
              Discover a space where<br />
              coffee meets culture
            </h1>
            <p className="text-lg font-light font-inter text-white uppercase">
              A blend of taste and elegance.
            </p>
          </div>
        </section>

        <section className="section min-h-screen relative flex items-stretch justify-stretch px-8">
          <div className="absolute top-45 left-12 max-w-[40rem]">
            <h2 className="text-5xl font-normal font-inter mb-2">
              A haven in the{" "}
              <span className="relative inline-flex items-center font-playfair italic">
                <svg
                  width="32"
                  height="34"
                  viewBox="0 0 32 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-[95%]  -top-4"
                  style={{ zIndex: 1 }}
                >
                  <path
                    d="M29.2682 22.1623C25.9814 27.8553 13.7819 31.3708 7.02545 32.6403C6.28274 32.7797 5.56779 32.3847 5.29543 31.6811C2.8765 25.4316 -0.322116 13.4143 3.28747 7.16234C9.41648 -3.45342 22.4069 4.0466 17.1534 13.1458C22.4069 4.04658 35.3973 11.5466 29.2682 22.1623Z"
                    fill="#FFA69E"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="relative z-10">heart</span>
              </span>{" "}
              of <br />the city
            </h2>
          </div>
          <div className="absolute bottom-30 right-12 text-right">
            <h2 className="text-lg font-normal font-inter mb-10">Designed for those who appreciate detail,<br /> Couleur Café is more than a place—it’s a<br /> moment suspended in time.</h2>
          </div>
          <img
            src="/section2_1.jpg"
            alt="Coffee Art 1"
            className="absolute -bottom-20 left-24 w-88 h-130 object-cover parallax-img-1"
          />
          <img
            src="/section2_2.jpg"
            alt="Coffee Art 2"
            className="absolute bottom-40 left-140 w-65 h-95 object-cover parallax-img-2"
          />
          <img
            src="/section2_3.jpg"
            alt="Coffee Art 3"
            className="absolute bottom-0 right-170 w-65 h-95 object-cover parallax-img-3"
          />
          <img
            src="/section2_4.jpg"
            alt="Coffee Art 4"
            className="absolute bottom-80 right-80 w-65 h-95 object-cover parallax-img-4"
          />
        </section>

        <section className="section h-screen flex items-center justify-center ">
          <div className="absolute top-25 left-12 text-left">
            <h2 className="text-5xl font-normal font-inter">Checkout color<br /><span className="font-playfair">Drinks & Cookies</span></h2>
          </div>
          <Tabs defaultValue="drinks" className="w-full h-2/3 absolute bottom-0">

            <div className="w-full h-30 flex flex-row justify-between top-1/2 right-12 px-12">
              <TabsList className="bg-linear-to-r from-[#FF9997] via-[#FFD4B6] to-[#F6BC8F] rounded-full h-18 w-56 flex justify-evenly items-center flex-row">
                <TabsTrigger value="drinks" className="rounded-full h-12 px-5 flex-none text-base">Drinks</TabsTrigger>
                <TabsTrigger value="cookies" className="rounded-full h-12 px-5 flex-none text-base">Cookies</TabsTrigger>
              </TabsList>
              <div className="font-inter text-lg font-normal text-left">All color coffees made with love, have a <br />taste just click on the images to buy.</div>

            </div>
            <TabsContent value="drinks" className="flex-1 px-12 grid grid-cols-7 gap-6 mt-16">
              {products.drinks.map(item => (
                <div key={item.id} className="cursor-pointer text-center">
                  <img
                    src={`/drinks/${item.image}`}
                    alt={item.name}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </TabsContent>
            <TabsContent value="cookies" className="flex-1 px-12 grid grid-cols-7 gap-6 mt-16">
              {products.cookies.map(item => (
                <div key={item.id} className="cursor-pointer text-center">
                  <img
                    src={`/cookies/${item.image}`}
                    alt={item.name}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </section>

        <section className="section h-screen flex items-center justify-center ">
          <Tabs
            defaultValue="caps"
            onValueChange={(v) => setActiveMerchTab(v as any)}
            className="w-full h-screen"
          >
            <div className="flex flex-row justify-between p-12 mt-12 w-full">
              <div>
                <h2 className="text-5xl font-normal font-inter">
                  Bring Couleur <br /> <span className="font-playfair">Café</span> home
                </h2>
              </div>

              <TabsList className=" h-17 w-113 flex justify-evenly items-center flex-row bg-[#FFF4EC] rounded-md text-base self-center">
                {(["caps", "mugs", "bottles", "shirt"] as const).map((cat) => (
                  <TabsTrigger key={cat} value={cat} className={`px-6 h-11 rounded-full flex-none ${activeMerchTab === cat ? "bg-linear-to-r from-[#FF9997] via-[#FFD4B6] to-[#F6BC8F] font-semibold" : ""}`}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={activeMerchTab} className="flex w-full h-full gap-8 px-24">
              {/* Left half: image gallery */}
              <div className="w-2/3 flex">
                {/* main image */}
                <div className="mr-5">
                  <FallbackImage
                    src={`/merch/${activeMerchTab}/${images[0]}`}
                    alt={activeMerchTab}
                    className="w-[720px] h-[580px] object-fill"
                  />
                </div>

                {/* side thumbnails */}
                <div className="w-[200px] h-[580px] flex flex-col justify-between ml-4">
                  {images.slice(1).map((src, idx) => (
                    <div
                      key={idx}
                      className="cursor-pointer"
                      onClick={() => handleSideClick(idx + 1)}
                    >
                      <FallbackImage
                        src={`/merch/${activeMerchTab}/${src}`}
                        alt={src}
                        className="w-[200px] h-[180px] object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right half: product info */}
              <div className="w-1/2 flex flex-col justify-start px-30 space-y-4">
                <h3 className="text-3xl font-normal">
                  {merch[activeMerchTab].name}
                </h3>
                <div className="flex justify-between items-center">
                  <div className="bg-[#E9E7DE] h-6 w-auto px-2 flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.77842 1.0326C5.86041 0.835488 6.13963 0.835488 6.22162 1.0326L7.53074 4.18012C7.5653 4.26321 7.64346 4.31999 7.73316 4.32718L11.1312 4.5996C11.344 4.61666 11.4302 4.88222 11.2682 5.0211L8.6792 7.2388C8.61088 7.29734 8.58104 7.38921 8.60192 7.47675L9.39288 10.7926C9.4424 11.0003 9.21648 11.1644 9.03432 11.0532L6.12512 9.2762C6.04832 9.22932 5.95172 9.22932 5.87492 9.2762L2.96574 11.0532C2.78356 11.1644 2.55766 11.0003 2.60719 10.7926L3.39815 7.47675C3.41904 7.38921 3.38918 7.29734 3.32084 7.2388L0.731911 5.0211C0.569782 4.88222 0.656069 4.61666 0.868864 4.5996L4.26688 4.32718C4.35658 4.31999 4.43474 4.26321 4.4693 4.18012L5.77842 1.0326Z" fill="black" />
                    </svg>
                    <span className="text-xs font-inter font-normal">
                      {merch[activeMerchTab].review.rating} stars, {merch[activeMerchTab].review.count} reviews
                    </span>

                  </div>
                  {"discountedPrice" in merch[activeMerchTab] && merch[activeMerchTab].discountedPrice ? (
                    <div className="flex gap-4 items-center">
                      <span className="text-2xl font-inter font-medium">{`$${merch[activeMerchTab].discountedPrice} USD`}</span>
                      <span className="text-xs font-inter font-normal line-through">$ {merch[activeMerchTab].price} USD</span>
                    </div>
                  ) : (
                    <div className="flex gap-4 items-center">
                      <span className="text-2xl font-inter font-medium">$ {merch[activeMerchTab].price} USD</span>
                    </div>
                  )}
                </div>

                <FillOnHoverButton className="mt-4 px-6 py-3 h-16 text-black font-inter text-base font-semibold rounded-full bg-[#E8E7DE]">
                  Shop Now
                </FillOnHoverButton>

                <div className="bg-[#FFF3EC] w-30 h-10 flex justify-center items-center text-sm font-inter font-normal">Product detail</div>

                {merch[activeMerchTab].details.map((detail, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <svg width="23" height="19" viewBox="0 0 23 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.8525 0.221558C11.2722 0.0779401 11.7278 0.0779401 12.1475 0.221558L18.858 2.51772C19.3539 2.68741 19.7634 3.045 19.9983 3.51355L22.5505 8.60355C22.8334 9.16771 22.8334 9.83229 22.5505 10.3965L19.9983 15.4864C19.7634 15.955 19.3539 16.3126 18.858 16.4823L12.1475 18.7784C11.7278 18.9221 11.2722 18.9221 10.8525 18.7784L4.14205 16.4823C3.64613 16.3126 3.23664 15.955 3.0017 15.4864L0.449496 10.3965C0.166617 9.83229 0.166616 9.16771 0.449496 8.60355L3.0017 3.51355C3.23664 3.045 3.64613 2.68741 4.14205 2.51772L10.8525 0.221558Z" fill="#FFF3EC" />
                      <rect x="7" y="7.64014" width="2.51098" height="7.03075" rx="1.25549" transform="rotate(-39.7143 7 7.64014)" fill="#FFA69E" />
                      <rect x="21.1033" width="2.51098" height="15.913" rx="1.25549" transform="rotate(44.4438 21.1033 0)" fill="#FFA69E" />
                    </svg>
                    <span className="text-base font-inter font-normal">{detail}</span>
                  </div>
                ))}


              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section className="section h-screen px-8 py-12">
          {/* full-width banner */}
          <img
            src="/footer.jpg"
            alt="Footer Banner"
            className="w-full h-3/5 mt-[15vh] object-cover rounded-lg mb-8"
          />

          {/* flex row: left text, right buttons */}
          <div className="flex flex-col h-1/5 justify-center">
            <div className="flex items-center justify-between mb-4">
              <p className="text-5xl font-inter font-normal">
                Couleur <span className="font-playfair">Café</span>
              </p>
              <div className="flex space-x-4">
                {footerBtns.map(label => (
                  <button
                    key={label}
                    className="px-6 py-2 bg-[#E8E7DE] text-black rounded-full font-inter font-medium h-16 uppercase"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* small footer note, right aligned */}
            <p className="text-xs text-right font-inter font-light text-[#3F2821]">
              Design By Djmaliboy | Developed By Ice Cream
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}