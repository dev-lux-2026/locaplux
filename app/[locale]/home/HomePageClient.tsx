"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import BuyerIntro from "@/components/BuyerIntro";
import HomeConnected from "@/components/HomeConnected";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";

interface Category {
  id: string;
  name: string;
  image?: string;
}

interface Product {
  id: string;
  slug?: string;
  name: string;
  description?: string;
  images?: string[];
  prix_locaplux?: number;
}

interface Partner {
  id: string;
  slug?: string | null;
  publicName: string;
  company?: string | null;
  avatar?: string | null;
}

export default function HomePageClient(
  { onboardingIncomplete }: { onboardingIncomplete: boolean }
) {
  const { data: session, status } = useSession();
  const t = useTranslations("Home");
  const params = useParams();
  const locale = params?.locale || "fr";

  const [isPaused, setIsPaused] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredPartners, setFeaturedPartners] = useState<Partner[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const demoFeaturedProducts: Product[] = [
    {
      id: "demo-1",
      slug: "demo-1",
      name: "Produit Démo 1",
      description: "Description de test pour vérifier le carrousel.",
      images: ["/images/slide1.jpg"],
    },
    {
      id: "demo-2",
      slug: "demo-2",
      name: "Produit Démo 2",
      description: "Encore un produit de test.",
      images: ["/images/slide2.jpg"],
    },
    {
      id: "demo-3",
      slug: "demo-3",
      name: "Produit Démo 3",
      description: "Troisième produit pour tester le défilement.",
      images: ["/images/slide3.jpg"],
    },
  ];

  const demoFeaturedPartners: Partner[] = [
    {
      id: "p1",
      slug: "partner-demo-1",
      publicName: "Partenaire Démo 1",
      avatar: null,
    },
    {
      id: "p2",
      slug: "partner-demo-2",
      publicName: "Partenaire Démo 2",
      avatar: null,
    },
    {
      id: "p3",
      slug: "partner-demo-3",
      publicName: "Partenaire Démo 3",
      avatar: null,
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

    if (delta > threshold) goToPrev();
    else if (delta < -threshold) goToNext();

    isDraggingRef.current = false;
    setIsPaused(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => handleEnd();

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => handleEnd();

  const handleMouseLeave = () => {
    if (isDraggingRef.current) handleEnd();
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
        <HomeConnected userName={session.user?.name || ""} />
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
        >
          <div className="relative h-[300px] sm:h-[420px] md:h-[520px] rounded-2xl overflow-hidden shadow-xl bg-black cursor-grab active:cursor-grabbing">
            <a href={`/product/${productsToShow[carouselIndex].id}`}>
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
                    className="block h-full bg-white dark:bg-black"
                    style={{
                      width: "100%",
                      animation: isPaused ? "none" : "progressBar 4s linear",
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={goToPrev}
            aria-label="Slide précédent"
            className="hidden md:flex items-center justify-center w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition absolute top-1/2 -translate-y-1/2 left-4 z-20"
          >
            ‹
          </button>

          <button
            onClick={goToNext}
            aria-label="Slide suivant"
            className="hidden md:flex items-center justify-center w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition absolute top-1/2 -translate-y-1/2 right-4 z-20"
          >
            ›
          </button>
        </section>
      </Container>

      <Container>
        <section className="mt-4 mb-12">
          <SectionTitle>{t("featuredPartners")}</SectionTitle>

          <div className="mt-6 flex items-center space-x-6 overflow-x-auto pb-2">
            {partnersToShow.map((p) => {
              const label = p.publicName || p.company || "Partenaire Locaplux";
              const initial = label.trim().charAt(0).toUpperCase() || "P";

              return (
                <a
                  key={p.id}
                  href={`/${locale}/partner/${p.id}`}
                  className="flex flex-col items-center shrink-0 group"
                >
                  {p.avatar ? (
                    <img
                      src={p.avatar}
                      alt={label}
                      className="w-20 h-20 rounded-full object-cover shadow-md border border-white/20 group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[#1A3A5F] text-white text-xl font-semibold shadow-md border border-white/20 group-hover:scale-105 transition">
                      {initial}
                    </div>
                  )}

                  <p className="text-xs mt-2 text-gray-700 dark:text-gray-300 text-center max-w-[96px] truncate">
                    {label}
                  </p>
                </a>
              );
            })}
          </div>
        </section>
      </Container>

      <Container>
        <section className="mb-16">
          <SectionTitle>{t("categories")}</SectionTitle>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/${locale}/category/${cat.id}`}
                className="flex flex-col items-center p-4 rounded-2xl bg-white dark:bg-[#141416] border border-gray-200/70 dark:border-white/10 hover:shadow-md transition"
              >
                <img
                  src={cat.image || "/placeholder.jpg"}
                  alt={cat.name}
                  className="w-16 h-16 object-contain"
                />
                <span className="mt-3 text-sm font-medium text-center">
                  {cat.name}
                </span>
              </a>
            ))}
          </div>
        </section>
      </Container>

      <Container>
        <section className="mb-16">
          <SectionTitle>{t("popularProducts")}</SectionTitle>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularProducts.map((prod) => (
              <a
                key={prod.id}
                href={`/${locale}/product/${prod.id}`}
                className="group rounded-2xl overflow-hidden bg-white dark:bg-[#141416] border border-gray-200/70 dark:border-white/10 shadow-sm hover:shadow-lg transition"
              >
                <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-[#1C1C1F]">
                  <img
                    src={prod.images?.[0] || "/placeholder.jpg"}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm truncate">{prod.name}</h3>
                  {prod.prix_locaplux !== undefined && (
                    <p className="mt-1 text-sm font-semibold">
                      {prod.prix_locaplux} €
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>
      </Container>

      <Container>
        <section className="mb-16">
          <SectionTitle>{t("latestProducts")}</SectionTitle>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {latestProducts.map((prod) => (
              <a
                key={prod.id}
                href={`/${locale}/product/${prod.id}`}
                className="group rounded-2xl overflow-hidden bg-white dark:bg-[#141416] border border-gray-200/70 dark:border-white/10 shadow-sm hover:shadow-lg transition"
              >
                <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-[#1C1C1F]">
                  <img
                    src={prod.images?.[0] || "/placeholder.jpg"}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm truncate">{prod.name}</h3>
                  {prod.prix_locaplux !== undefined && (
                    <p className="mt-1 text-sm font-semibold">
                      {prod.prix_locaplux} €
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>
      </Container>

      <Container>
        <section className="mb-20 rounded-2xl bg-gray-100 dark:bg-[#141416] border border-gray-200/70 dark:border-white/10 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold">{t("becomePartnerTitle")}</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-xl">
              {t("becomePartnerSubtitle")}
            </p>
          </div>
          <a
            href={`/${locale}/partner/apply`}
            className="px-6 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90 transition shrink-0"
          >
            {t("becomePartnerCta")}
          </a>
        </section>
      </Container>
    </div>
  );
}