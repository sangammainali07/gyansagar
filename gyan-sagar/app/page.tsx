'use client';

import Script from 'next/script';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { useState } from 'react';
import { UserButton } from '@/components/auth/user-button';

export default function LandingPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>("collapseOne");
  return (
    <>
      <link rel="stylesheet" href="assets/css/bootstrap-5.0.0-beta2.min.css" />
      <link rel="stylesheet" href="assets/css/LineIcons.2.0.css" />
      <link rel="stylesheet" href="assets/css/tiny-slider.css" />
      <link rel="stylesheet" href="assets/css/animate.css" />
      <link rel="stylesheet" href="assets/css/main.css" />

      {/* preloader start */}
      <div className="preloader" style={{ opacity: 0, display: 'none' }}>
        <div className="loader">
          <div className="spinner">
            <div className="spinner-container">
              <div className="spinner-rotator">
                <div className="spinner-left">
                  <div className="spinner-circle"></div>
                </div>
                <div className="spinner-right">
                  <div className="spinner-circle"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* preloader end */}

      {/* header start */}
      <header className="header">
        <div className="navbar-area">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-12">
                <nav className="navbar navbar-expand-lg">
                  <a className="navbar-brand" href="/">
                    <img src="/logo.png" alt="Logo" width={150} />
                  </a>
                  <button className={`navbar-toggler ${isMobileMenuOpen ? "active" : ""}`} type="button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <span className="toggler-icon"></span>
                    <span className="toggler-icon"></span>
                    <span className="toggler-icon"></span>
                  </button>

                  <div className={`navbar-collapse sub-menu-bar ${isMobileMenuOpen ? "show bg-[#F3F4DE]/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-6 mt-4 w-full relative z-50 transition-all duration-300 flex flex-col items-center justify-center gap-6" : "hidden lg:flex lg:w-full lg:flex-1 lg:justify-between lg:items-center lg:bg-transparent lg:p-0 lg:m-0 lg:shadow-none lg:border-none"}`} id="navbarSupportedContent">
                    
                    {/* CENTER LINKS */}
                    <ul id="nav" className="navbar-nav mx-auto flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">
                      <li className="nav-item !m-0 flex items-center justify-center h-full">
                        <a className="page-scroll active" href="#home" style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0' }}>Home</a>
                      </li>
                      <li className="nav-item !m-0 flex items-center justify-center h-full">
                        <a className="page-scroll" href="#feature" style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0' }}>Features</a>
                      </li>
                      <li className="nav-item !m-0 flex items-center justify-center h-full">
                        <a className="" href="/dashboard" style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0' }}>Dashboard</a>
                      </li>
                      <li className="nav-item !m-0 flex items-center justify-center h-full">
                        <a className="page-scroll" href="#faq" style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0' }}>FAQ</a>
                      </li>
                    </ul>

                    {/* RIGHT AUTH */}
                    <div className="navbar-nav flex flex-col lg:flex-row items-center justify-center gap-6 mt-6 lg:mt-0">
                      {session?.user ? (
                        <div className="flex items-center justify-center h-full">
                          <UserButton userImage={session.user.image} userName={session.user.name} />
                        </div>
                      ) : (
                        <>
                          <div className="nav-item !m-0 flex items-center justify-center h-full">
                            <Link href="/sign-in" style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0' }}>Login</Link>
                          </div>
                          <div className="flex items-center justify-center h-full">
                            <Link href="/sign-up" className="bg-[#ADB2D4] text-[#1D2A5D] rounded-full transition-all duration-300 hover:bg-[#C7D3D4] shadow-md hover:shadow-lg flex items-center justify-center font-medium" style={{ padding: '10px 24px', fontSize: '16px', lineHeight: '1' }}>Register</Link>
                          </div>
                        </>
                      )}
                    </div>

                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* header end */}

      {/* hero-section start */}
      <section id="home" className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="wow fadeInUp" data-wow-delay=".2s">
                  Gyan Sagar - The Learning Management System
                </h1>
                <p className="wow fadeInUp" data-wow-delay=".4s">
                  Empowering students and educators with modern tools for effective learning, teaching, and course management.
                </p>
                <a href="/dashboard" className="main-btn btn-hover wow fadeInUp" data-wow-delay=".6s">Get Started</a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-img wow fadeInUp relative" data-wow-delay=".5s">
                <img src="assets/img/learning.jpg" alt="Learning" className="img-1 rounded-3xl shadow-2xl border-4 border-white object-cover w-full h-auto max-h-[500px]" />
                <img src="assets/img/hero/hero-img-2.png" alt="" className="img-2 absolute -bottom-10 -left-10 w-32 hidden md:block" />
                <img src="assets/img/learning.jpg" alt="" className="img-3 opacity-20 blur-xl absolute -bottom-8 -right-8 -z-10 w-full h-full rounded-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* hero-section end */}

{/* client-logo-section removed */}

      {/* feature-section start */}
      <section id="feature" className="feature-section pt-140">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xxl-5 col-xl-6 col-lg-7">
              <div className="section-title text-center mb-30">
                <h1 className="mb-25 wow fadeInUp" data-wow-delay=".2s" style={{ visibility: "visible", animationDelay: "0.2s", animationName: "fadeInUp" }}>Awesome Features</h1>
                <p className="wow fadeInUp" data-wow-delay=".4s" style={{ visibility: "visible", animationDelay: "0.4s", animationName: "fadeInUp" }}>Discover the wide range of tools provided specially for efficient learning and managing courses.</p>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-8 col-sm-10">
              <div className="single-feature">
                <div className="icon color-1">
                  <i className="lni lni-pointer-up"></i>
                </div>
                <div className="content">
                  <h3>Easy To Use</h3>
                  <p>Our platform handles complexity so you can focus on pure learning.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-8 col-sm-10">
              <div className="single-feature">
                <div className="icon color-2">
                  <i className="lni lni-revenue"></i>
                </div>
                <div className="content">
                  <h3>Save Your Money</h3>
                  <p>Affordable courses with top-class instructors to accelerate your career.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-8 col-sm-10">
              <div className="single-feature">
                <div className="icon color-3">
                  <i className="lni lni-display"></i>
                </div>
                <div className="content">
                  <h3>24/7 Access to Courses</h3>
                  <p>Access your favorite courses anywhere and anytime through any device.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* feature-section end */}

      {/* faq-section start */}
      <section id="faq" className="faq-section pt-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xxl-5 col-xl-6 col-lg-7">
              <div className="section-title text-center mb-60">
                <h1 className="mb-25 wow fadeInUp" data-wow-delay=".2s">Frequently Asked Queries</h1>
                <p className="mb-25 wow fadeInUp" data-wow-delay=".2s">Find answers to commonly asked questions about our platform and courses.</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6">
              <div className="accordion faq-wrapper" id="accordionExample">
                <div className="single-faq">
                  <button className={`w-100 ${openFaq !== 'collapseOne' ? 'collapsed' : ''}`} type="button" onClick={() => setOpenFaq(openFaq === 'collapseOne' ? null : 'collapseOne')}>
                    Can I access the courses immediately?
                  </button>

                  <div className={openFaq === 'collapseOne' ? "block" : "hidden"}>
                    <div className="faq-content">
                      Yes! Once you enroll in a course, it is available to you instantly.
                    </div>
                  </div>
                </div>
                <div className="single-faq">
                  <button className={`w-100 ${openFaq !== 'collapseTwo' ? 'collapsed' : ''}`} type="button" onClick={() => setOpenFaq(openFaq === 'collapseTwo' ? null : 'collapseTwo')}>
                    How long do I have access to a course?
                  </button>
                  <div className={openFaq === 'collapseTwo' ? "block" : "hidden"}>
                    <div className="faq-content">
                      Any course you have purchased gives you lifetime access to the materials.
                    </div>
                  </div>
                </div>
                <div className="single-faq">
                  <button className={`w-100 ${openFaq !== 'collapseThree' ? 'collapsed' : ''}`} type="button" onClick={() => setOpenFaq(openFaq === 'collapseThree' ? null : 'collapseThree')}>
                    Can I become an instructor?
                  </button>
                  <div className={openFaq === 'collapseThree' ? "block" : "hidden"}>
                    <div className="faq-content">
                      Yes, you can apply to become an instructor and share your knowledge via the Teacher Dashboard!
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="faq-image">
                <img src="assets/img/faq/faq-img.svg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* faq-section end */}

      {/* footer start */}
      <footer id="footer" className="footer">
        <div className="container">
          <div className="widget-wrapper">
            <div className="row">
              <div className="col-xl-2 col-md-6">
                <div className="footer-widget">
                  <h3>About Us</h3>
                  <ul className="links">
                    <li> <a href="#home">Home</a> </li>
                    <li> <a href="#feature">Features</a> </li>
                    <li> <a href="/dashboard">Dashboard</a> </li>
                    <li> <a href="#faq">FAQ</a> </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-3 col-md-6">
                <div className="footer-widget">
                  <h3>Features</h3>
                  <ul className="links">
                    <li> <a href="#">Easy to use</a> </li>
                    <li> <a href="#">Work every device</a> </li>
                    <li> <a href="#">Always up to date</a> </li>
                    <li> <a href="#">Track your progress</a> </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-3 col-md-6">
                <div className="footer-widget">
                  <h3>Support</h3>
                  <ul className="links">
                    <li> <a href="javascript:void(0)">Privacy Policy</a> </li>
                    <li> <a href="javascript:void(0)">Terms of Service</a> </li>
                    <li> <a href="javascript:void(0)">Accessibility</a> </li>
                  </ul>
                </div>
              </div>
{/* Download App Removed */}
            </div>
          </div>

          <div className="copy-right-wrapper">
            <div className="row">
              <div className="col-md-6">
                <div className="copy-right">
                  <p>Developed with ❤️ for Students</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="socials">
                  <ul>
                    <li><a href="javascript:void(0)"> <i className="lni lni-facebook-filled"></i> </a></li>
                    <li><a href="javascript:void(0)"> <i className="lni lni-twitter-filled"></i> </a></li>
                    <li><a href="javascript:void(0)"> <i className="lni lni-instagram-filled"></i> </a></li>
                    <li><a href="javascript:void(0)"> <i className="lni lni-linkedin-original"></i> </a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* footer end */}

      {/* scroll-top */}
      <a href="#" className="scroll-top btn-hover">
        <i className="lni lni-chevron-up"></i>
      </a>

      {/* JS here */}
      <Script src="/assets/js/bootstrap-5.0.0-beta2.min.js" strategy="afterInteractive"></Script>
      <Script src="/assets/js/tiny-slider.js" strategy="afterInteractive"></Script>
      <Script 
        src="/assets/js/wow.min.js" 
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-ignore
          if (typeof WOW !== 'undefined') {
            // @ts-ignore
            new WOW().init();
          }
        }}
      ></Script>
      <Script src="/assets/js/main.js" strategy="afterInteractive"></Script>
    </>
  );
}
