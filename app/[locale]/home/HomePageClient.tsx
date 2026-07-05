"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import BuyerIntro from "@/components/BuyerIntro";
import HomeConnected from "@/components/HomeConnected";
import { useState, useEffect, useRef } from "react";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";

export default function HomePageClient({ onboardingIncomplete }) {
  const { data: session, status } = useSession();
  const t = useTranslations("Home");

  const [isPaused, setIsPaused] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [popularProducts, setPopularProducts] = useState<any[]>([]);
  const [latestProducts, setLatestProducts] = useState<any[]>([]);

  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [featuredPartners, setFeaturedPartners] = useState<any[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const demoFeaturedProducts = [
    {
      slug: "demo-1",
      name: "Produit Démo 1",
      description: "Description de test pour vérifier le carrousel.",
      images: ["/images/slide1.jpg"],
    },
    {
      slug: "demo-2",
      name: "Produit Démo 2",
      description: "Encore un produit de test.",
      images: ["/images/slide2.jpg"],
    },
    {
      slug: "demo-3",
      name: "Produit Démo 3",
      description: "Troisième produit pour tester le défilement.",
      images: ["/images/slide3.jpg"],
    },
  ];

  const demoFeaturedPartners = [
    {
      id: "p1",
      slug: "partner-demo-1",
      publicName: "Partenaire Démo 1",
      avatar: "/images/partner1.jpg",
    },
    {
      id: "p2",
      slug: "partner-demo-2",
      publicName: "Partenaire Démo 2",
      avatar: "/images/partner2.jpg",
    },
    {
      id: "p3",
      slug: "partner-demo-3",
      publicName: "Partenaire Démo 3",
      avatar: "/images/partner3.jpg",
    },
  ];

  useEffect(() => {
    fetch("/api/categories/list")
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []));

    fetch("/api/products/popular")
      .then((res) => res.json())
      .then((data) => setPopularProducts(Array.isArray(data) ? data : []));

    fetch("/api/products/latest")
      .then((res) => res.json())
      .then((data) => setLatestProducts(Array.isArray(data) ? data : []));

    fetch("/api/products/featured")
      .then((res) => res.json())
      .then((data) => setFeaturedProducts(Array.isArray(data) ? data : []));

    fetch("/api/partner/featured")
      .then((res) => res.json())
      .then((data) => setFeaturedPartners(Array.isArray(data) ? data : []));
  }, []);

  const productsToShow =
    featuredProducts.length > 0 ? featuredProducts : demoFeaturedProducts;

  const partnersToShow =
    featuredPartners.length > 0 ? featuredPartners : demoFeaturedPartners;

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);

  useEffect(() => {
    if (isPaused || isDraggingRef.current || productsToShow.length === 0) return;

    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % productsToShow.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, productsToShow.length]);

  const goToNext = () => {
    setCarouselIndex((prev) => (prev + 1) % productsToShow.length);
  };

  const goToPrev = () => {
    setCarouselIndex((prev) =>
      prev === 0 ? productsToShow.length - 1 : prev - 1
    );
  };

  const handleStart = (clientX: number) => {
    isDraggingRef.current = true;
    startXRef.current = clientX;
    currentXRef.current = clientX;
    setIsPaused(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDraggingRef.current) return;
    currentXRef.current = clientX;
  };

  const handleEnd = () => {
    if (!isDraggingRef.current) return;
    const delta = currentXRef.current - startXRef.current;
    const threshold = 50;

    if (delta > threshold) {
      goToPrev();
    } else if (delta < -threshold) {
      goToNext();
    }

    isDraggingRef.current = false;
    setIsPaused(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    handleStart(touch.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    handleMove(touch.clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleMouseLeave = () => {
    if (isDraggingRef.current) {
      handleEnd();
    }
  };

  if (status === "loading") return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0B0C] text-gray-900 dark:text-[#D1D1D6]">
      {onboardingIncomplete && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800 p-3 text-center text-sm">
          {t("profileIncomplete")}
          <a href="/account/onboarding/address" className="underline ml-1">
            {t("completeNow")}
          </a>
        </div>
      )}

      {!session ? (
        <BuyerIntro />
      ) : (
        <HomeConnected userName={session.user?.name || null} />
      )}

      <Container>
        <section className="relative mt-10 mb-16 rounded-2xl overflow-hidden bg-gradient-to-br from-[#0B0B0C] via-[#111113] to-[#1A1A1D] p-10 shadow-xl">
          <h1 className="text-3xl md:text-5xl font-semibold text-white leading-tight">
            {t("heroTitle")}
          </h1>

          <p className="mt-4 text-neutral-300 text-lg max-w-xl">
            {t("heroSubtitle")}
          </p>

          <a
            href="/search"
            className="inline-block mt-6 px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-neutral-200 transition"
          >
            {t("exploreProducts")}
          </a>
        </section>
      </Container>

      <Container>
        <section
          className="relative w-full mt-10 mb-16"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            if (!isDraggingRef.current) setIsPaused(false);
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeaveCapture={handleMouseLeave}
        >
          <div className="relative h-[300px] sm:h-[420px] md:h-[520px] rounded-2xl overflow-hidden shadow-xl bg-black cursor-grab active:cursor-grabbing">
            <a href={`/products/${productsToShow[carouselIndex].slug}`}>
              <img
                src={
                  productsToShow[carouselIndex].images?.[0] ||
                  "/placeholder.jpg"
                }
                alt={productsToShow[carouselIndex].name}
                className="w-full h-full object-cover transition-all duration-700 ease-in-out scale-[1.03]"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40" />

              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-2xl md:text-4xl font-semibold drop-shadow-lg">
                  {productsToShow[carouselIndex].name}
                </h2>
                <p className="text-sm md:text-base text-neutral-200 mt-1 max-w-md">
                  {productsToShow[carouselIndex].description?.slice(0, 80)}...
                </p>
              </div>
            </a>
          </div>

          <div className="flex justify-center mt-4 space-x-4">
            {productsToShow.map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselIndex(i)}
                className={`relative h-3 rounded-full overflow-hidden transition-all ${
                  i === carouselIndex
                    ? "w-10 bg-black dark:bg-white"
                    : "w-3 bg-gray-300 dark:bg-gray-600"
                }`}
              >
                {i === carouselIndex && (
                  <span
                    className="absolute left-0 top-0 h-full bg-white dark:bg-black"
                    style={{
                      width: "100%",
                      animation: "progressFill 4s linear forwards",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-4 overflow-hidden">
          <div className="flex space-x-6 animate-scroll pause-on-hover">
            {partnersToShow.map((p) => (
              <a
                key={p.id}
                href={`/partner/${p.slug}`}
                className="flex flex-col items-center"
              >
                <img
                  src={p.avatar || "/placeholder.jpg"}
                  alt={p.publicName}
                  className="w-20 h-20 rounded-full object-cover shadow-md border border-white/20"
                />
                <p className="text-xs mt-2 text-gray-700 dark:text-gray-300 text-center">
                  {p.publicName}
                </p>
              </a>
            ))}
          </div>
        </section>
      </Container>

      <Container>
        <SectionTitle>{t("categories")}</SectionTitle>

        <div
          className="
            grid 
            grid-cols-3 
            sm:grid-cols-4 
            md:grid-cols-6 
            lg:grid-cols-8 
            xl:grid-cols-10 
            gap-4
          "
        >
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/categories/${cat.id}`}
              className="
                flex flex-col items-center p-3 rounded-xl
                bg-white dark:bg-[#18181A]
                border border-gray-200 dark:border-white/10
                hover:shadow-lg hover:-translate-y-1 dark:hover:bg-white/5
                transition cursor-pointer
              "
            >
              <img
                src={cat.image || "/placeholder.jpg"}
                alt={cat.name}
                className="w-16 h-16 object-cover rounded-lg"
              />

              <p className="text-xs mt-2 text-gray-700 dark:text-gray-300 text-center font-medium">
                {cat.name}
              </p>
            </a>
          ))}
        </div>
      </Container>

      <Container>
        <SectionTitle>{t("popularProducts")}</SectionTitle>

        <div
          className="
          grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
          gap-6
        "
        >
          {popularProducts.map((p) => (
            <a
              key={p.id}
              href={`/products/${p.id}`}
              className="
                border border-gray-200 dark:border-white/10 
                rounded-xl p-4 shadow-sm 
                bg-white dark:bg-[#18181A] 
                hover:shadow-xl hover:-translate-y-1 dark:hover:bg-white/5 
                transition cursor-pointer
              "
            >
              <img
                src={p.images?.[0] || "/placeholder.jpg"}
                alt={p.name}
                className="w-full h-44 object-cover rounded-lg mb-3"
              />

              <p className="font-semibold text-black dark:text-white text-sm">
                {p.name}
              </p>

              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {p.description?.slice(0, 50)}...
              </p>

              <p className="text-[#1A3A5F] dark:text-[#D4AF37] font-semibold mt-3 text-sm">
                {p.prix_locaplux} €
              </p>
            </a>
          ))}
        </div>
      </Container>

      <Container>
        <SectionTitle>{t("newProducts")}</SectionTitle>

        <div
          className="
          grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
          gap-6
        "
        >
          {latestProducts.map((p) => (
            <a
              key={p.id}
              href={`/products/${p.id}`}
              className="
                border border-gray-200 dark:border-white/10 
                rounded-xl p-4 shadow-sm 
                bg-white dark:bg-[#18181A] 
                hover:shadow-xl hover:-translate-y-1 dark:hover:bg-white/5 
                transition cursor-pointer
              "
            >
              <img
                src={p.images?.[0] || "/placeholder.jpg"}
                alt={p.name}
                className="w-full h-44 object-cover rounded-lg mb-3"
              />

              <p className="font-semibold text-black dark:text-white text-sm">
                {p.name}
              </p>

              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {p.description?.slice(0, 50)}...
              </p>

              <p className="text-[#1A3A5F] dark:text-[#D4AF37] font-semibold mt-3 text-sm">
                {p.prix_locaplux} €
              </p>
            </a>
          ))}
        </div>
      </Container>

      <Container>
        <section className="py-16">
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div>
              <h3 className="text-xl font-semibold">{t("advSecurityTitle")}</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                {t("advSecurityText")}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">{t("advLocalTitle")}</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                {t("advLocalText")}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">{t("advSupportTitle")}</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                {t("advSupportText")}
              </p>
            </div>
          </div>
        </section>
      </Container>

      <section className="bg-neutral-100 dark:bg-[#18181A] py-20 mt-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold">{t("partnerTitle")}</h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400">
            {t("partnerSubtitle")}
          </p>

          <a
            href="/register/partner"
            className="mt-6 inline-block px-6 py-3 rounded-lg bg-black text-white hover:bg-neutral-800 transition"
          >
            {t("partnerCTA")}
          </a>
        </div>
      </section>

      <footer
        className="mt-20 py-10 
                         bg-gray-100 dark:bg-[#18181A] 
                         text-center text-gray-600 dark:text-gray-400"
      >
        <p>
          © {new Date().getFullYear()} Locaplux — {t("rights")}
        </p>
      </footer>

      <style jsx global>{`
        @keyframes progressFill {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .pause-on-hover:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
