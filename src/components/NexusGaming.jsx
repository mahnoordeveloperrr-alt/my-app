import React, { useEffect, useRef } from 'react';

const NexusGaming = () => {
  // Refs to store cleanup functions and dynamic elements
  const cursorElementsRef = useRef({ dot: null, ring: null });
  const animationFrameRef = useRef(null);
  const intervalsRef = useRef([]);
  const eventListenersRef = useRef([]);
  const observerRef = useRef(null);
  const serviceCardRefs = useRef([]);
  const heroCardRefs = useRef([]);
  const eventRowRefs = useRef([]);

  // CSS styles as a string
  const styles = `
    /* =========================
       GLOBAL RESET & BASE (merged)
    ========================= */
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
    }

    body {
        background: #ececec;
        overflow-x: hidden;
        color: #111;
    }

    section {
        width: 100%;
    }

    html {
        scroll-behavior: smooth;
    }

    /* =========================
       CUSTOM CURSOR STYLES
    ========================= */
    .cursor-dot {
        position: fixed;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #d7ff00;
        pointer-events: none;
        z-index: 99999;
        transform: translate(-50%, -50%);
        will-change: left, top;
        transition: width 0.25s ease, height 0.25s ease, background 0.25s ease;
        box-shadow: 0 0 10px rgba(215, 255, 0, 0.6), 0 0 24px rgba(215, 255, 0, 0.3);
    }

    .cursor-ring {
        position: fixed;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid #444;
        pointer-events: none;
        z-index: 99998;
        transform: translate(-50%, -50%);
        will-change: left, top, width, height, border-color, background;
        transition: width 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1),
            height 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1),
            border-color 0.3s ease,
            background 0.3s ease,
            box-shadow 0.3s ease;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.15);
    }

    .cursor-ring.cursor-hover {
        width: 62px;
        height: 62px;
        border-color: #d7ff00;
        background: rgba(215, 255, 0, 0.08);
        box-shadow: 0 0 20px rgba(215, 255, 0, 0.35), 0 0 40px rgba(215, 255, 0, 0.15);
    }

    .cursor-dot.cursor-hover {
        width: 12px;
        height: 12px;
        background: #fff;
        box-shadow: 0 0 14px rgba(255, 255, 255, 0.8), 0 0 30px rgba(215, 255, 0, 0.5);
    }

    body.custom-cursor-active,
    body.custom-cursor-active a,
    body.custom-cursor-active button,
    body.custom-cursor-active input,
    body.custom-cursor-active .service-card,
    body.custom-cursor-active .event-row,
    body.custom-cursor-active .card,
    body.custom-cursor-active .btn,
    body.custom-cursor-active .floating-card,
    body.custom-cursor-active .circle,
    body.custom-cursor-active .call-btn,
    body.custom-cursor-active .hero-btn,
    body.custom-cursor-active .footer-form button,
    body.custom-cursor-active .socials a,
    body.custom-cursor-active .nav-left a,
    body.custom-cursor-active .nav-right a,
    body.custom-cursor-active .logo,
    body.custom-cursor-active .event-arrow,
    body.custom-cursor-active .arrow,
    body.custom-cursor-active .hero-form button,
    body.custom-cursor-active .hero-form input {
        cursor: none !important;
    }

    /* =========================
       SCROLL REVEAL ANIMATIONS
    ========================= */
    .reveal-up {
        opacity: 0;
        transform: translateY(55px);
        transition: opacity 0.75s cubic-bezier(0.2, 0.9, 0.4, 1),
            transform 0.75s cubic-bezier(0.2, 0.9, 0.4, 1);
    }

    .reveal-up.revealed {
        opacity: 1;
        transform: translateY(0);
    }

    .reveal-fade {
        opacity: 0;
        transition: opacity 0.8s ease;
    }

    .reveal-fade.revealed {
        opacity: 1;
    }

    .reveal-scale {
        opacity: 0;
        transform: scale(0.88);
        transition: opacity 0.7s cubic-bezier(0.2, 0.9, 0.4, 1),
            transform 0.7s cubic-bezier(0.2, 0.9, 0.4, 1);
    }

    .reveal-scale.revealed {
        opacity: 1;
        transform: scale(1);
    }

    .reveal-left {
        opacity: 0;
        transform: translateX(-50px);
        transition: opacity 0.7s cubic-bezier(0.2, 0.9, 0.4, 1),
            transform 0.7s cubic-bezier(0.2, 0.9, 0.4, 1);
    }

    .reveal-left.revealed {
        opacity: 1;
        transform: translateX(0);
    }

    .reveal-right {
        opacity: 0;
        transform: translateX(50px);
        transition: opacity 0.7s cubic-bezier(0.2, 0.9, 0.4, 1),
            transform 0.7s cubic-bezier(0.2, 0.9, 0.4, 1);
    }

    .reveal-right.revealed {
        opacity: 1;
        transform: translateX(0);
    }

    .delay-1 {
        transition-delay: 0.05s;
    }
    .delay-2 {
        transition-delay: 0.12s;
    }
    .delay-3 {
        transition-delay: 0.19s;
    }
    .delay-4 {
        transition-delay: 0.26s;
    }
    .delay-5 {
        transition-delay: 0.33s;
    }
    .delay-6 {
        transition-delay: 0.40s;
    }

    /* =========================
       PARALLAX ELEMENTS
    ========================= */
    .parallax-subtle {
        will-change: transform;
    }

    /* =========================
       HERO SECTION 1 (original + enhancements)
    ========================= */
    .hero-one {
        width: 100%;
        min-height: 100vh;
        background: #f5f5f5;
        border-radius: 35px;
        padding: 18px;
        position: relative;
        overflow: hidden;
        margin-bottom: 40px;
    }

    .navbar {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        position: relative;
        z-index: 10;
    }

    .nav-left,
    .nav-right {
        display: flex;
        gap: 35px;
        align-items: center;
    }

    .nav-left a,
    .nav-right a {
        text-decoration: none;
        color: #111;
        font-size: 14px;
        font-weight: 500;
        transition: 0.3s;
    }

    .nav-left a:hover,
    .nav-right a:hover {
        color: #b6ff00;
    }

    .logo {
        background: #000;
        color: #fff;
        padding: 12px 28px;
        border-radius: 50px;
        font-size: 15px;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
    }

    .logo span {
        width: 10px;
        height: 10px;
        background: #d7ff00;
        border-radius: 50%;
        display: block;
    }

    .call-btn {
        border: 1px solid #111;
        padding: 12px 24px;
        border-radius: 40px;
        background: transparent;
        cursor: pointer;
        transition: 0.3s;
        text-decoration: none;
        color: #111;
        display: inline-block;
        font-size: 14px;
        font-weight: 500;
    }

    .call-btn:hover {
        background: #111;
        color: #fff;
    }

    .hero-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
        height: 82vh;
    }

    .left-box {
        background: #000;
        border-radius: 30px;
        padding: 50px;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .small-brand {
        color: #d7ff00;
        font-size: 14px;
        margin-bottom: 25px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .small-brand::before {
        content: "";
        width: 8px;
        height: 8px;
        background: #d7ff00;
        border-radius: 50%;
    }

    .left-box h1 {
        color: #fff;
        font-size: 60px;
        line-height: 1.1;
        font-weight: 500;
        max-width: 520px;
        margin-bottom: 35px;
    }

    .hero-form {
        display: flex;
        align-items: center;
        background: #fff;
        border-radius: 60px;
        width: fit-content;
        overflow: hidden;
    }

    .hero-form input {
        border: none;
        outline: none;
        padding: 18px 22px;
        width: 240px;
        font-size: 15px;
    }

    .hero-form button {
        border: none;
        background: #d7ff00;
        padding: 18px 28px;
        cursor: pointer;
        font-weight: bold;
        transition: 0.3s;
    }

    .hero-form button:hover {
        background: #b5db00;
    }

    .users {
        display: flex;
        align-items: center;
        margin-top: 35px;
        gap: 15px;
    }

    .avatars {
        display: flex;
    }

    .avatars img {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        border: 3px solid #000;
        margin-left: -10px;
        object-fit: cover;
    }

    .users p {
        color: #fff;
        font-size: 14px;
        max-width: 220px;
        line-height: 1.4;
    }

    .right-box {
        border-radius: 30px;
        position: relative;
        overflow: hidden;
        background: #dcdcdc;
    }
    .right-box video{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .wave-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 30% 30%, #fff 0%, #d8d8d8 45%, #cfcfcf 100%);
    }

    .wave {
        position: absolute;
        width: 130%;
        height: 130%;
        background: repeating-radial-gradient(circle at center, #efefef 0px, #d8d8d8 14px, #c9c9c9 24px);
        opacity: 0.7;
        transform: rotate(-10deg);
        animation: moveWave 18s linear infinite;
    }

    @keyframes moveWave {
        0% {
            transform: rotate(-10deg) translateY(0px);
        }
        50% {
            transform: rotate(-10deg) translateY(-20px);
        }
        100% {
            transform: rotate(-10deg) translateY(0px);
        }
    }

    .floating-card {
        position: absolute;
        background: rgba(0, 0, 0, 0.75);
        backdrop-filter: blur(10px);
        color: #fff;
        padding: 15px;
        border-radius: 18px;
        display: flex;
        align-items: center;
        gap: 12px;
        transition: 0.4s;
        cursor: pointer;
    }

    .floating-card:hover {
        transform: translateY(-8px) scale(1.03);
    }

    .floating-card img {
        width: 55px;
        height: 55px;
        border-radius: 12px;
        object-fit: cover;
    }

    .card-1 {
        top: 25px;
        left: 20px;
    }

    .card-2 {
        bottom: 20px;
        left: 25px;
    }

    .circle-icons {
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        gap: 12px;
    }

    .circle {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 18px;
        transition: 0.3s;
    }

    .circle:hover {
        background: #d7ff00;
        transform: scale(1.1);
    }

    .bottom-text {
        position: absolute;
        right: 25px;
        bottom: 25px;
        width: 240px;
        color: #333;
        font-size: 14px;
        line-height: 1.6;
    }

    /* =========================
       HERO SECTION 2 (original + enhancements)
    ========================= */
    .hero-two {
        width: 100%;
        min-height: 100vh;
        background: #f3f3f3;
        position: relative;
        overflow: hidden;
        padding: 70px 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 40px;
    }

    .blob {
        position: absolute;
        width: 250px;
        height: 350px;
        animation: float 6s ease-in-out infinite;
        will-change: transform;
    }
    .blob img {
        height: 100%;
        width: 100%;
        object-fit: cover;
    }

    .blob-left {
        left: -40px;
        top: -20px;
    }

    .blob-right {
        right: -40px;
        top: -20px;
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(15px);
        }
    }

    .content {
        text-align: center;
        max-width: 760px;
        z-index: 2;
    }

    .content h1 {
        font-size: 64px;
        line-height: 1.05;
        color: #111;
        font-weight: 500;
        margin-bottom: 20px;
    }

    .content p {
        font-size: 15px;
        line-height: 1.7;
        color: #444;
        margin-bottom: 35px;
    }

    .hero-btn {
        padding: 16px 34px;
        border-radius: 60px;
        border: 1.5px solid #111;
        background: #fff;
        cursor: pointer;
        font-size: 15px;
        transition: 0.35s;
    }

    .hero-btn:hover {
        background: #111;
        color: #fff;
        transform: translateY(-3px);
    }

    .cards {
        width: 100%;
        margin-top: 90px;
        display: flex;
        justify-content: center;
        gap: 25px;
        flex-wrap: wrap;
        z-index: 2;
    }

    .card {
        width: 260px;
        height: 170px;
        border-radius: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        transition: 0.45s;
        cursor: pointer;
    }

    .card:hover {
        transform: translateY(-10px) scale(1.03);
    }

    .card-hero1 {
        background: #e8ff63;
    }

    .card-hero1 h2 {
        font-size: 60px;
        color: #111;
        font-weight: 500;
    }

    .card-hero2 {
        background: #dcdcdc;
    }

    .card-hero3 {
        background: #000;
    }

    .card-hero4 {
        background: #d8d8d8;
    }

    .card-hero3 h3 {
        color: #fff;
    }

    .metal-bg {
        position: absolute;
        width: 180%;
        height: 180%;
        background: radial-gradient(circle at center, #fff 0%, #8c8c8c 20%, #efefef 35%, #666 55%, #fff 70%);
        animation: rotateBg 14s linear infinite;
    }

    @keyframes rotateBg {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .card h3 {
        position: relative;
        z-index: 2;
        font-size: 28px;
        text-align: center;
        width: 75%;
        line-height: 1.3;
    }

    /* ======================================
       NEW SERVICES SECTION (enhanced from code 1)
    ======================================== */
    .services {
        width: 100%;
        max-width: 1500px;
        margin: 0 auto;
        padding: 60px 20px 80px 20px;
    }

    .section-title {
        font-size: 60px;
        font-weight: 500;
        margin-bottom: 45px;
        color: #111;
        letter-spacing: -0.02em;
    }

    .services-cards {
        display: flex;
        gap: 25px;
        flex-wrap: wrap;
    }

    .service-card {
        flex: 1;
        min-width: 270px;
        height: 620px;
        border-radius: 34px;
        overflow: hidden;
        position: relative;
        padding: 22px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        cursor: pointer;
        transition: 0.45s cubic-bezier(0.2, 0.9, 0.4, 1.1);
    }

    .service-card:hover {
        transform: translateY(-12px);
    }

    .black-card {
        background: #000;
        color: #fff;
    }

    .lime-card {
        background: #dfff5a;
        color: #111;
    }

    .gray-card {
        background: #e4e4e4;
        color: #111;
    }

    .card-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        position: relative;
        z-index: 5;
    }

    .tag {
        padding: 10px 16px;
        border-radius: 40px;
        font-size: 13px;
        backdrop-filter: blur(10px);
        font-weight: 500;
    }

    .black-card .tag {
        background: #111;
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #fff;
    }

    .lime-card .tag,
    .gray-card .tag {
        background: #fff;
        color: #111;
    }

    .arrow {
        width: 58px;
        height: 58px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        transition: 0.4s;
        font-weight: 300;
    }

    .black-card .arrow {
        background: #dfff5a;
        color: #111;
    }

    .lime-card .arrow,
    .gray-card .arrow {
        border: 1px dashed #111;
        color: #111;
    }

    .service-card:hover .arrow {
        transform: rotate(45deg) scale(1.1);
    }

    .metal {
        position: absolute;
        width: 170%;
        height: 240px;
        left: -25%;
        background: radial-gradient(circle at center,
                #fff 0%,
                #777 18%,
                #fff 30%,
                #555 45%,
                #f5f5f5 60%,
                #666 78%,
                #fff 100%);
        filter: contrast(140%);
        animation: wave 8s linear infinite;
        z-index: 1;
        opacity: 0.7;
        pointer-events: none;
    }

    .black-card .metal {
        top: 120px;
    }

    .lime-card .metal {
        bottom: 170px;
    }

    .gray-card .metal {
        top: 120px;
    }

    @keyframes wave {
        0% {
            transform: translateX(0) rotate(0deg);
        }
        50% {
            transform: translateX(-40px) rotate(3deg);
        }
        100% {
            transform: translateX(0) rotate(0deg);
        }
    }

    .service-content {
        position: relative;
        z-index: 5;
    }

    .service-content h2 {
        font-size: 52px;
        margin-bottom: 12px;
        font-weight: 600;
        line-height: 1.1;
        letter-spacing: -0.02em;
    }

    .service-content p {
        font-size: 15px;
        line-height: 1.7;
        max-width: 280px;
        opacity: 0.85;
    }

    .btn {
        width: fit-content;
        padding: 15px 26px;
        border-radius: 50px;
        border: none;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: 0.35s;
        position: relative;
        z-index: 5;
    }

    .black-card .btn {
        background: #fff;
        color: #111;
    }

    .lime-card .btn,
    .gray-card .btn {
        background: #000;
        color: #fff;
    }

    .btn:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .hover-img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transform: scale(1.2);
        transition: 0.5s ease;
        z-index: 2;
        pointer-events: none;
    }

    .overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        opacity: 0;
        transition: 0.5s;
        z-index: 3;
        pointer-events: none;
    }

    /* =========================
       EVENTS SECTION (enhanced from code 1)
    ========================= */
    .events-section {
        width: 100%;
        background: #efefef;
        padding: 70px 40px 100px 40px;
        position: relative;
        overflow: hidden;
        margin-top: 20px;
    }

    .events-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 40px;
        margin-bottom: 50px;
        flex-wrap: wrap;
    }

    .events-title {
        font-size: 64px;
        font-weight: 500;
        line-height: 1.1;
        margin-bottom: 10px;
        letter-spacing: -0.02em;
        color: #111;
    }

    .events-sub {
        font-size: 14px;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 500;
    }

    .events-right-text {
        max-width: 330px;
        font-size: 15px;
        line-height: 1.7;
        color: #444;
    }

    .events-table {
        width: 100%;
        border-top: 1px solid #bdbdbd;
    }

    .event-row {
        width: 100%;
        display: grid;
        grid-template-columns: 2fr 2fr 1fr 100px;
        align-items: center;
        gap: 25px;
        padding: 32px 10px;
        border-bottom: 1px solid #bdbdbd;
        position: relative;
        cursor: pointer;
        transition: background 0.35s ease, transform 0.35s ease;
    }

    .event-row:hover {
        background: #dfff5a;
        transform: translateX(8px);
    }

    .event-name {
        font-size: 40px;
        font-weight: 500;
        letter-spacing: -0.01em;
        color: #111;
    }

    .event-desc {
        font-size: 15px;
        line-height: 1.7;
        color: #555;
        max-width: 280px;
    }

    .event-date {
        font-size: 26px;
        font-weight: 500;
        letter-spacing: -0.01em;
    }

    .event-arrow {
        width: 62px;
        height: 62px;
        border-radius: 50%;
        border: 1px solid #aaa;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        transition: 0.35s;
        background: transparent;
    }

    .event-row:hover .event-arrow {
        background: #111;
        color: #fff;
        transform: rotate(45deg) scale(1.08);
        border-color: #111;
    }

    .hover-preview {
        position: fixed;
        width: 270px;
        height: 190px;
        border-radius: 28px;
        overflow: hidden;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transform: scale(0.7) rotate(-8deg);
        transition: opacity 0.25s ease, transform 0.25s ease;
        box-shadow: 0 30px 55px rgba(0, 0, 0, 0.3);
        will-change: left, top;
    }

    .hover-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    /* =========================
       FOOTER (original)
    ========================= */
    .footer {
        width: 100%;
        background: #000;
        padding: 70px 40px 30px;
        color: #fff;
    }

    .footer-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 40px;
        flex-wrap: wrap;
    }

    .footer-badge {
        padding: 10px 22px;
        border-radius: 40px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        font-size: 13px;
        display: inline-block;
    }

    .footer-center {
        max-width: 700px;
    }

    .footer-center h2 {
        font-size: 42px;
        font-weight: 500;
        line-height: 1.3;
        margin-bottom: 30px;
    }

    .footer-form {
        display: flex;
        align-items: center;
        background: #111;
        border-radius: 60px;
        overflow: hidden;
        width: fit-content;
    }

    .footer-form input {
        border: none;
        outline: none;
        background: transparent;
        color: #fff;
        padding: 18px 24px;
        width: 320px;
        font-size: 15px;
    }

    .footer-form button {
        border: none;
        background: #dfff5a;
        color: #111;
        padding: 18px 28px;
        font-weight: bold;
        cursor: pointer;
        transition: 0.3s;
    }

    .footer-form button:hover {
        background: #fff;
    }

    .footer-line {
        width: 100%;
        height: 1px;
        background: rgba(255, 255, 255, 0.2);
        margin: 70px 0 30px;
    }

    .footer-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;
    }

    .footer-bottom p {
        font-size: 13px;
        color: #aaa;
    }

    .footer-logo {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 15px;
    }

    .footer-logo span {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #dfff5a;
    }

    .socials {
        display: flex;
        gap: 14px;
        flex-wrap: wrap;
    }

    .socials a {
        padding: 10px 18px;
        border-radius: 40px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
        text-decoration: none;
        font-size: 13px;
        transition: 0.3s;
    }

    .socials a:hover {
        background: #dfff5a;
        color: #111;
    }

    /* =========================
       RESPONSIVE
    ========================= */
    @media (max-width: 1200px) {
        .services-cards {
            justify-content: center;
        }
        .service-card {
            max-width: 420px;
            min-width: 320px;
        }
    }

    @media (max-width: 1000px) {
        .hero-grid {
            grid-template-columns: 1fr;
            height: auto;
        }
        .left-box h1 {
            font-size: 45px;
        }
        .right-box {
            min-height: 500px;
        }
        .navbar {
            flex-direction: column;
            gap: 20px;
        }
        .nav-left,
        .nav-right {
            flex-wrap: wrap;
            justify-content: center;
        }
        .event-row {
            grid-template-columns: 1fr;
            gap: 18px;
        }
        .event-name {
            font-size: 34px;
        }
        .event-date {
            font-size: 22px;
        }
        .events-title {
            font-size: 48px;
        }
    }

    @media (max-width: 768px) {
        .cursor-dot,
        .cursor-ring {
            display: none !important;
        }
        body.custom-cursor-active,
        body.custom-cursor-active * {
            cursor: auto !important;
        }
    }

    @media (max-width: 700px) {
        .section-title {
            font-size: 40px;
        }
        .service-card {
            min-width: 100%;
            height: 540px;
        }
        .service-content h2 {
            font-size: 42px;
        }
        .events-section {
            padding: 50px 20px 70px 20px;
        }
        .events-title {
            font-size: 42px;
        }
        .event-name {
            font-size: 28px;
        }
        .content h1 {
            font-size: 38px;
        }
        .left-box {
            padding: 30px;
        }
        .left-box h1 {
            font-size: 34px;
        }
        .hero-form {
            width: 100%;
            flex-direction: column;
            border-radius: 20px;
        }
        .hero-form input,
        .hero-form button {
            width: 100%;
        }
        .footer-center h2 {
            font-size: 28px;
        }
        .footer-form {
            width: 100%;
            flex-direction: column;
            border-radius: 20px;
        }
        .footer-form input,
        .footer-form button {
            width: 100%;
        }
        .hover-preview {
            width: 200px;
            height: 140px;
        }
    }
  `;

  useEffect(() => {
    // ==================== 0) TOUCH DEVICE DETECTION ====================
    const isTouchDevice = ('ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches);

    // ==================== 1) CUSTOM CURSOR ====================
    if (!isTouchDevice) {
      document.body.classList.add('custom-cursor-active');

      const cursorDot = document.createElement('div');
      cursorDot.classList.add('cursor-dot');
      document.body.appendChild(cursorDot);

      const cursorRing = document.createElement('div');
      cursorRing.classList.add('cursor-ring');
      document.body.appendChild(cursorRing);

      cursorElementsRef.current = { dot: cursorDot, ring: cursorRing };

      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let ringX = mouseX;
      let ringY = mouseY;
      const lerpFactor = 0.14;

      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
      cursorRing.style.left = mouseX + 'px';
      cursorRing.style.top = mouseY + 'px';

      const onMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
      };

      document.addEventListener('mousemove', onMouseMove);

      function animateRing() {
        ringX += (mouseX - ringX) * lerpFactor;
        ringY += (mouseY - ringY) * lerpFactor;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        animationFrameRef.current = requestAnimationFrame(animateRing);
      }
      animationFrameRef.current = requestAnimationFrame(animateRing);

      const interactiveSelector = [
        'a', 'button', 'input', '.service-card', '.event-row', '.card', '.btn',
        '.floating-card', '.circle', '.call-btn', '.hero-btn', '.hero-form button',
        '.hero-form input', '.footer-form button', '.footer-form input', '.logo',
        '.socials a', '.event-arrow', '.arrow', '.nav-left a', '.nav-right a'
      ].join(', ');

      const onMouseOver = (e) => {
        const target = e.target.closest(interactiveSelector);
        if (target) {
          cursorRing.classList.add('cursor-hover');
          cursorDot.classList.add('cursor-hover');
        } else {
          cursorRing.classList.remove('cursor-hover');
          cursorDot.classList.remove('cursor-hover');
        }
      };

      const onMouseOut = (e) => {
        if (!e.relatedTarget || e.relatedTarget === document.documentElement) {
          cursorRing.classList.remove('cursor-hover');
          cursorDot.classList.remove('cursor-hover');
        }
      };

      const onMouseLeave = () => {
        cursorDot.style.opacity = '0';
        cursorRing.style.opacity = '0';
      };

      const onMouseEnter = () => {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
      };

      document.addEventListener('mouseover', onMouseOver);
      document.addEventListener('mouseout', onMouseOut);
      document.addEventListener('mouseleave', onMouseLeave);
      document.addEventListener('mouseenter', onMouseEnter);

      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';

      // Store cleanup functions
      const cleanupCursor = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseover', onMouseOver);
        document.removeEventListener('mouseout', onMouseOut);
        document.removeEventListener('mouseleave', onMouseLeave);
        document.removeEventListener('mouseenter', onMouseEnter);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (cursorDot && cursorDot.parentNode) cursorDot.parentNode.removeChild(cursorDot);
        if (cursorRing && cursorRing.parentNode) cursorRing.parentNode.removeChild(cursorRing);
        document.body.classList.remove('custom-cursor-active');
      };
      eventListenersRef.current.push(cleanupCursor);
    }

    // ==================== 2) SCROLL REVEAL ====================
    const revealElements = document.querySelectorAll(
      '.reveal-up, .reveal-fade, .reveal-scale, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.12, rootMargin: '-25px 0px -25px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
    observerRef.current = revealObserver;

    // ==================== 3) PARALLAX ON SCROLL ====================
    const parallaxEls = document.querySelectorAll('.parallax-subtle');
    let parallaxTicking = false;

    function updateParallax() {
      const scrollY = window.pageYOffset;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.04;
        const rect = el.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        if (rect.bottom > -200 && rect.top < viewHeight + 200) {
          el.style.transform = el.style.transform.replace(/translateY\([^)]*\)/g, '') +
            ` translateY(${scrollY * speed}px)`;
        }
      });
      parallaxTicking = false;
    }

    const onScroll = () => {
      if (!parallaxTicking) {
        requestAnimationFrame(() => {
          updateParallax();
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax();

    // ==================== 4) FLOATING CARDS ANIMATION ====================
    const floatingCards = document.querySelectorAll(".floating-card");
    floatingCards.forEach((card, index) => {
      let position = 0;
      const interval = setInterval(() => {
        position = position === 0 ? 10 : 0;
        card.style.transform = `translateY(${position}px)`;
      }, 2000 + (index * 500));
      intervalsRef.current.push(interval);
    });

    // ==================== 5) 3D TILT for HERO CARDS ====================
    const heroCards = document.querySelectorAll(".card");
    heroCards.forEach(card => {
      const onMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateY = (x - rect.width / 2) / 18;
        const rotateX = -(y - rect.height / 2) / 18;
        card.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateY(-10px)`;
      };
      const onMouseLeave = () => {
        card.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
      };
      card.addEventListener("mousemove", onMouseMove);
      card.addEventListener("mouseleave", onMouseLeave);
      eventListenersRef.current.push(() => {
        card.removeEventListener("mousemove", onMouseMove);
        card.removeEventListener("mouseleave", onMouseLeave);
      });
    });

    // ==================== 6) SERVICE CARDS HOVER EFFECTS ====================
    const serviceCards = document.querySelectorAll(".service-card");
    serviceCards.forEach(card => {
      const hoverImg = card.querySelector(".hover-img");
      const overlay = card.querySelector(".overlay");
      const serviceH2 = card.querySelector(".service-content h2");

      const onMouseEnter = () => {
        if (hoverImg) { hoverImg.style.opacity = "1";
          hoverImg.style.transform = "scale(1)"; }
        if (overlay) overlay.style.opacity = "1";
        if (card.classList.contains("black-card")) {
          card.style.background = "#dfff5a";
          card.style.color = "#111";
          if (serviceH2) serviceH2.style.color = "#fff";
        } else {
          card.style.background = "#000";
          card.style.color = "#fff";
        }
      };

      const onMouseLeave = () => {
        if (hoverImg) { hoverImg.style.opacity = "0";
          hoverImg.style.transform = "scale(1.2)"; }
        if (overlay) overlay.style.opacity = "0";
        if (card.classList.contains("black-card")) { 
          card.style.background = "#000";
          card.style.color = "#fff"; 
        } else if (card.classList.contains("gray-card")) { 
          card.style.background = "#e4e4e4";
          card.style.color = "#111"; 
        } else { 
          card.style.background = "#dfff5a";
          card.style.color = "#111"; 
        }
        card.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
        if (serviceH2) serviceH2.style.color = "";
      };

      const onMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateY = (x - rect.width / 2) / 18;
        const rotateX = -(y - rect.height / 2) / 18;
        card.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateY(-10px)`;
      };

      card.addEventListener("mouseenter", onMouseEnter);
      card.addEventListener("mouseleave", onMouseLeave);
      card.addEventListener("mousemove", onMouseMove);
      eventListenersRef.current.push(() => {
        card.removeEventListener("mouseenter", onMouseEnter);
        card.removeEventListener("mouseleave", onMouseLeave);
        card.removeEventListener("mousemove", onMouseMove);
      });
    });

    // ==================== 7) EVENTS FLOATING PREVIEW ====================
    const eventRows = document.querySelectorAll(".event-row");
    const previewDiv = document.querySelector(".hover-preview");
    const previewImg = previewDiv?.querySelector("img");

    if (previewDiv && previewImg) {
      eventRows.forEach(row => {
        const onMouseEnter = () => {
          const imgUrl = row.getAttribute("data-event-img");
          if (imgUrl) {
            previewImg.src = imgUrl;
            previewDiv.style.opacity = "1";
            previewDiv.style.transform = "scale(1) rotate(0deg)";
          }
        };
        const onMouseMove = (e) => {
          let leftPos = e.clientX + 25;
          let topPos = e.clientY - 100;
          const previewRect = previewDiv.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          if (leftPos + previewRect.width > viewportWidth - 15) leftPos = e.clientX - previewRect.width - 15;
          if (topPos + previewRect.height > viewportHeight - 20) topPos = e.clientY - previewRect.height - 15;
          if (topPos < 10) topPos = 10;
          previewDiv.style.left = leftPos + "px";
          previewDiv.style.top = topPos + "px";
        };
        const onMouseLeave = () => {
          previewDiv.style.opacity = "0";
          previewDiv.style.transform = "scale(0.7) rotate(-8deg)";
        };
        row.addEventListener("mouseenter", onMouseEnter);
        row.addEventListener("mousemove", onMouseMove);
        row.addEventListener("mouseleave", onMouseLeave);
        eventListenersRef.current.push(() => {
          row.removeEventListener("mouseenter", onMouseEnter);
          row.removeEventListener("mousemove", onMouseMove);
          row.removeEventListener("mouseleave", onMouseLeave);
        });
      });

      const eventsSection = document.querySelector(".events-section");
      if (eventsSection) {
        const onEventsMouseLeave = () => {
          previewDiv.style.opacity = "0";
          previewDiv.style.transform = "scale(0.7) rotate(-8deg)";
        };
        eventsSection.addEventListener("mouseleave", onEventsMouseLeave);
        eventListenersRef.current.push(() => {
          eventsSection.removeEventListener("mouseleave", onEventsMouseLeave);
        });
      }
    }

    // ==================== 8) BUTTON ALERT ====================
    const allButtons = document.querySelectorAll(".btn");
    const alertHandler = (e) => {
      e.stopPropagation();
      alert("✨ Request submitted! Our gaming experts will contact you shortly.");
    };
    allButtons.forEach(btn => {
      btn.addEventListener("click", alertHandler);
      eventListenersRef.current.push(() => {
        btn.removeEventListener("click", alertHandler);
      });
    });

    // ==================== 9) INITIAL ABOVE-FOLD REVEAL ====================
    setTimeout(() => {
      revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('revealed');
        }
      });
    }, 150);

    console.log('🎮 Gaming Setup ready — custom cursor & scroll transitions active!');
    if (isTouchDevice) console.log('📱 Touch device — custom cursor disabled.');

    // Cleanup function
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      window.removeEventListener('scroll', onScroll);
      intervalsRef.current.forEach(interval => clearInterval(interval));
      eventListenersRef.current.forEach(cleanup => cleanup());
      if (cursorElementsRef.current.dot && cursorElementsRef.current.dot.parentNode) {
        cursorElementsRef.current.dot.parentNode.removeChild(cursorElementsRef.current.dot);
        cursorElementsRef.current.ring.parentNode.removeChild(cursorElementsRef.current.ring);
        document.body.classList.remove('custom-cursor-active');
      }
    };
  }, []);

  // Smooth scroll for anchor links
  const handleAnchorClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div>
        {/* ========== HERO SECTION 1 ========== */}
        <section className="hero-one" id="hero-one">
          <nav className="navbar">
            <div className="nav-left">
              <a href="#hero-one" onClick={(e) => handleAnchorClick(e, 'hero-one')}>Home</a>
              <a href="#services" onClick={(e) => handleAnchorClick(e, 'services')}>Builds</a>
              <a href="#services" onClick={(e) => handleAnchorClick(e, 'services')}>Services</a>
            </div>
            <a href="#hero-one" className="logo" onClick={(e) => handleAnchorClick(e, 'hero-one')}>
              <span></span>
              NEXUS GAMING
            </a>
            <div className="nav-right">
              <a href="#events-section" onClick={(e) => handleAnchorClick(e, 'events-section')}>Projects</a>
              <a href="#faq" onClick={(e) => handleAnchorClick(e, 'faq')}>FAQ</a>
              <a href="#footer-email" className="call-btn" onClick={(e) => handleAnchorClick(e, 'footer-email')}>Contact</a>
            </div>
          </nav>
          <div className="hero-grid">
            <div className="left-box">
              <div className="small-brand">Nexus Gaming</div>
              <h1>We build elite gaming rigs & boost your rank.</h1>
              <div className="hero-form">
                <input type="text" placeholder="Enter your gamertag" />
                <button>Get Started →</button>
              </div>
              <div className="users">
                <div className="avatars">
                  <img src="https://i.pravatar.cc/100?img=5" alt="Gamer avatar" />
                  <img src="https://i.pravatar.cc/100?img=8" alt="Gamer avatar" />
                  <img src="https://i.pravatar.cc/100?img=12" alt="Gamer avatar" />
                </div>
                <p>500+ gamers boosted & satisfied</p>
              </div>
            </div>
            <div className="right-box">
              <video src="/img/1.mp4" autoPlay muted loop playsInline></video>
              <div className="circle-icons">
                <div className="circle">▶</div>
                <div className="circle">⟳</div>
              </div>
              <div className="floating-card card-1">
                <img src="img/3.png" alt="Custom gaming PC" />
                <div>
                  <h4>Pro Builds</h4>
                  <small>High-end specs</small>
                </div>
              </div>
              <div className="floating-card card-2">
                <img src="img/4.png" alt="Streaming setup" />
                <div>
                  <h4>Streamer Setup</h4>
                  <small>Pro gear & lighting</small>
                </div>
              </div>
              <div className="bottom-text">We craft high-performance gaming experiences with custom PCs, coaching, and esports management.</div>
            </div>
          </div>
        </section>

        {/* ========== HERO SECTION 2 ========== */}
        <section className="hero-two">
          <div className="blob blob-left parallax-subtle" data-parallax-speed="0.06">
            <img src="/img/1.png" alt="Decorative blob" />
          </div>
          <div className="blob blob-right parallax-subtle" data-parallax-speed="-0.05">
            <img src="/img/1.png" alt="Decorative blob" />
          </div>
          <div className="content">
            <h1>Dominate The Game</h1>
            <p>Unleash your potential with our pro-level gaming solutions. From custom PC builds to expert coaching, we'll get you to the top.</p>
            <button className="hero-btn">Book a Free Consultation →</button>
          </div>
          <div className="cards">
            <div className="card card-hero1"><h2>ELITE</h2></div>
            <div className="card card-hero2"><div className="metal-bg"></div><h3>GAMING GEAR</h3></div>
            <div className="card card-hero3"><h3>PRO COACHING</h3></div>
            <div className="card card-hero4"><h3>TO VICTORY</h3></div>
          </div>
        </section>

        {/* ========== ENHANCED SERVICES SECTION ========== */}
        <section className="services" id="services">
          <h1 className="section-title reveal-left">Our Gaming Services</h1>
          <div className="services-cards">
            <div className="service-card black-card reveal-up delay-1">
              <div className="card-top"><div className="tag">Rank Boosting</div><div className="arrow">→</div></div>
              <div className="metal"></div>
              <img className="hover-img" src="img/2.png" alt="Esports competition" />
              <div className="overlay"></div>
              <div className="service-content"><h2>Game Boosting</h2><p>Professional rank boosting services to climb the leaderboards fast.</p></div>
              <button className="btn">Start Climb</button>
            </div>
            <div className="service-card lime-card reveal-up delay-2">
              <div className="card-top"><div></div><div className="arrow">↗</div></div>
              <div className="metal"></div>
              <img className="hover-img" src="img/3.png" alt="Streaming desk" />
              <div className="overlay"></div>
              <div className="service-content"><h2>Streaming</h2><p>Custom streaming PC builds, overlays, and OBS optimization for flawless broadcasts.</p></div>
              <button className="btn">Go Live</button>
            </div>
            <div className="service-card gray-card reveal-up delay-3">
              <div className="card-top"><div></div><div className="arrow">↗</div></div>
              <div className="metal"></div>
              <img className="hover-img" src="img/4.png" alt="Gaming tournament" />
              <div className="overlay"></div>
              <div className="service-content"><h2>Tournaments</h2><p>Host and manage online tournaments with brackets, prizes, and live streaming.</p></div>
              <button className="btn">Join Arena</button>
            </div>
            <div className="service-card lime-card reveal-up delay-4">
              <div className="card-top"><div></div><div className="arrow">↗</div></div>
              <div className="metal"></div>
              <img className="hover-img" src="img/5.png" alt="Gaming coaching" />
              <div className="overlay"></div>
              <div className="service-content"><h2>Coaching</h2><p>1-on-1 coaching from top players to improve aim, game sense, and strategies.</p></div>
              <button className="btn">Get Coach</button>
            </div>
          </div>
        </section>

        {/* ========== ENHANCED EVENTS SECTION ========== */}
        <section className="events-section" id="events-section">
          <div className="events-header">
            <div>
              <h1 className="events-title reveal-left">Gaming Tournaments 2024</h1>
              <p className="events-sub reveal-fade delay-1">Esports Events</p>
            </div>
            <p className="events-right-text reveal-right delay-2">Nexus Gaming organizes competitive tournaments, bootcamps, and LAN events for gamers worldwide.</p>
          </div>
          <div className="events-table">
            <div className="event-row reveal-up delay-1" data-event-img="img/2.png">
              <div className="event-name">Apex Showdown</div>
              <div className="event-desc">Intense battle royale tournament with cash prizes.</div>
              <div className="event-date">12/03/24</div>
              <div className="event-arrow">→</div>
            </div>
            <div className="event-row reveal-up delay-2" data-event-img="img/3.png">
              <div className="event-name">Pro League Finals</div>
              <div className="event-desc">The ultimate FPS championship finals live on stage.</div>
              <div className="event-date">29/05/24</div>
              <div className="event-arrow">→</div>
            </div>
            <div className="event-row reveal-up delay-3" data-event-img="img/4.png">
              <div className="event-name">Bootcamp Masterclass</div>
              <div className="event-desc">Intensive training weekend with pro players & analysts.</div>
              <div className="event-date">06/06/24</div>
              <div className="event-arrow">→</div>
            </div>
            <div className="event-row reveal-up delay-4" data-event-img="img/5.png">
              <div className="event-name">LAN Party 2024</div>
              <div className="event-desc">Massive LAN event with gear demos, tournaments & prizes.</div>
              <div className="event-date">18/08/24</div>
              <div className="event-arrow">→</div>
            </div>
          </div>
        </section>

        {/* Hidden FAQ anchor */}
        <div id="faq" style={{ position: 'absolute', visibility: 'hidden' }}></div>

        {/* Floating preview for events (dynamic) */}
        <div className="hover-preview"><img src="" alt="event preview" /></div>

        {/* ========== FOOTER ========== */}
        <footer className="footer" id="footer">
          <div className="footer-top">
            <div className="footer-left reveal-scale delay-1"><span className="footer-badge">Gaming News</span></div>
            <div className="footer-center reveal-up delay-2">
              <h2>Subscribe for exclusive gaming deals, tournament alerts & pro tips.</h2>
              <div className="footer-form">
                <input type="email" id="footer-email" placeholder="Enter your email" />
                <button>Join the Squad →</button>
              </div>
            </div>
          </div>
          <div className="footer-line"></div>
          <div className="footer-bottom reveal-fade delay-3">
            <p>©2024. All Right Reserved</p>
            <div className="footer-logo"><span></span>NEXUS GAMING</div>
            <div className="socials">
              <a href="#">Discord</a>
              <a href="#">Twitch</a>
              <a href="#">YouTube</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default NexusGaming;