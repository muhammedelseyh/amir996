document.addEventListener('DOMContentLoaded', () => {

    // ===================== 1. إعدادات عامة ومتغيرات =====================
    const isDesktop = window.matchMedia('(pointer:fine)').matches;
    const isMobile = !isDesktop;

    // ===================== 2. تهيئة الصفحة والـ Preloader =====================
    function initializePage() {
        document.body.classList.remove('loading');
        gsap.to(['#main-header', '#main-content', '.page-main', '.custom-cursor'], { opacity: 1, duration: 0.6 });
        runSiteLogic();
    }

    const preloader = document.getElementById('preloader');
    if (preloader && !sessionStorage.getItem('introShown')) {
        const preloaderName = document.querySelector('.preloader-name');
        document.body.classList.add('loading');
        
        const preloaderTl = gsap.timeline({
            onComplete: () => {
                initializePage();
                sessionStorage.setItem('introShown', 'true');
            }
        });

       preloaderTl
    .to(preloaderName, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }) // غيرنا 0.8 إلى 0.3
    .to(preloaderName, { backgroundPosition: '-200% 0', duration: 0.5, ease: 'power3.inOut' }, "-=0.1") // غيرنا 1.8 إلى 0.5 (وعدلنا التداخل قليلاً)
    .to(preloader, { opacity: 0, duration: 0.3, ease: 'power2.inOut', delay: 0.1 }) // غيرنا 0.8 إلى 0.3 و 0.5 إلى 0.1
    .set(preloader, { display: 'none' });
    } else {
        if(preloader) preloader.style.display = 'none';
        initializePage();
    }

    // ===================== 3. دالة رئيسية لتشغيل كل وظائف الموقع =====================
    function runSiteLogic() {
        gsap.registerPlugin(ScrollTrigger);

        // --- المؤشر المخصص (للكمبيوتر فقط) ---
        if (isDesktop) {
            const cursor = document.querySelector('.custom-cursor');
            if (cursor) {
                const interactiveElements = document.querySelectorAll('a, button');
                window.addEventListener('mousemove', e => gsap.to(cursor, { duration: 0.3, x: e.clientX, y: e.clientY, ease: 'power3.out' }));
                interactiveElements.forEach(el => {
                    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
                    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
                });
            }
        }
        
        // --- الجزيئات المتحركة (للكمبيوتر فقط لتحسين سرعة الموبايل) ---
        if (isDesktop) {
            if (document.getElementById('particles-js')) {
                particlesJS('particles-js', { particles: { number: { value: 80, density: { enable: true, value_area: 1000 } }, color: { value: "#c09f58" }, shape: { type: "circle" }, opacity: { value: 0.8, random: true, anim: { enable: true, speed: 0.5, opacity_min: 0.3, sync: false } }, size: { value: 3, random: true, anim: { enable: true, speed: 1, size_min: 0.5, sync: false } }, line_linked: { enable: true, distance: 180, color: "#c09f58", opacity: 0.3, width: 1 }, move: { enable: true, speed: 1.5, direction: "none", random: true, straight: false, out_mode: "out" } }, interactivity: { detect_on: "canvas", events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false } }, modes: { grab: { distance: 160, line_linked: { opacity: 0.7 } } } }, retina_detect: true });
            }
            if (document.getElementById('text-background-particles')) {
                particlesJS('text-background-particles', { particles: { number: { value: 50, density: { enable: true, value_area: 800 } }, color: { value: "#ffffff" }, shape: { type: "circle" }, opacity: { value: 0.2, random: true }, size: { value: 2, random: true }, line_linked: { enable: false }, move: { enable: true, speed: 2, direction: "bottom", random: true, straight: false, out_mode: "out" } }, interactivity: { events: { onhover: { enable: false } } }, retina_detect: true });
            }
        }
        
        // --- حركة قسم المقدمة عند التمرير ---
        if (document.getElementById('intro-scene')) {
            gsap.timeline({ scrollTrigger: { trigger: '#intro-scene', start: 'top top', end: '+=600', pin: true, scrub: 1 } })
                .fromTo('.main-headline', { opacity: 1, y: 0, scale: 1 }, { opacity: 0, y: -50, scale: 0.9, ease: 'power1.in' })
                .fromTo('#particles-js', { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.5, ease: 'power1.in' }, 0);
        }
        
        // --- حركة ظهور العناصر العامة عند التمرير ---
        gsap.utils.toArray('.animate-on-scroll').forEach((el, index) => {
            gsap.fromTo(el, { opacity: 0, y: 50, visibility: 'hidden' }, {
                scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
                opacity: 1, y: 0, visibility: 'visible', duration: 0.8, delay: (index % 3) * 0.1, ease: 'power3.out'
            });
        });

        // --- عدّادات الإنجازات (Trust Bar) ---
        const trustSection = document.getElementById('trust-bar');
        if (trustSection) {
            gsap.utils.toArray('#trust-bar .trust-num').forEach((el) => {
                const target = +el.dataset.target || 0;
                gsap.fromTo(el, { textContent: 0 }, {
                    textContent: target,
                    duration: 1.2,
                    ease: 'power2.out',
                    snap: { textContent: 1 },
                    scrollTrigger: { trigger: el, start: 'top 90%', once: true }
                });
            });
        }
        
        // --- تحريكات قسم رحلتنا مع العميل (Process) ---
        const processSection = document.getElementById('process');
        if (processSection) {
            gsap.fromTo('#process .section-title', {autoAlpha:0, y:20}, {autoAlpha:1, y:0, duration:.7, ease:'power3.out', scrollTrigger: {trigger: processSection, start:'top 85%'}});
            gsap.fromTo('#process .process-sub', {autoAlpha:0, y:14}, {autoAlpha:1, y:0, duration:.6, ease:'power3.out', scrollTrigger: {trigger: processSection, start:'top 82%'}});

            const processBar = processSection.querySelector('.process-progress');
            if(processBar) {
                ScrollTrigger.create({
                    trigger: processSection, start:'top 80%', end:'bottom 20%',
                    onUpdate: self => { processBar.style.width = `${self.progress * 100}%`; }
                });
            }

            gsap.utils.toArray('#process .step-card').forEach((card, i) => {
                const startPos = isMobile ? 'top 98%' : 'top 92%';
                gsap.fromTo(card, {autoAlpha:0, y:30}, {
                    autoAlpha:1, y:0, duration:.75, delay:i*0.05, ease:'power3.out',
                    scrollTrigger: { trigger: card, start: startPos }
                });

                if (isDesktop){
                    const qrx = gsap.quickTo(card, '--rx', {duration:.18, ease:'power2.out'});
                    const qry = gsap.quickTo(card, '--ry', {duration:.18, ease:'power2.out'});
                    const qs  = gsap.quickTo(card, '--s',  {duration:.18, ease:'power2.out'});
                    card.addEventListener('mousemove', e => {
                        const r = card.getBoundingClientRect();
                        const x = (e.clientX - r.left)/r.width - .5;
                        const y = (e.clientY - r.top)/r.height - .5;
                        qry((-x)*16 + 'deg'); qrx((y)*14 + 'deg'); qs(1.04);
                    });
                    card.addEventListener('mouseleave', () => { qry('0deg'); qrx('0deg'); qs(1); });
                }

                if(isMobile) {
                    card.addEventListener('touchstart', () => {
                        card.classList.add('is-active');
                    }, { passive: true });
                    card.addEventListener('touchend', () => {
                        card.classList.remove('is-active');
                    });
                }
            });
        }

        // --- تحريكات قسم فلسفتنا (Philosophy) ---
        const philosophySection = document.querySelector('#philosophy');
        if (philosophySection) {
            gsap.utils.toArray('#philosophy .pillar-card').forEach((card, i) => {
                gsap.fromTo(card, {autoAlpha:0, y:30}, {
                    autoAlpha:1, y:0, duration:.7, ease:'power3.out', delay: i*0.06,
                    scrollTrigger: { trigger: card, start: 'top 92%' }
                });
            });

            if (isDesktop){
                document.querySelectorAll('#philosophy .pillar-card').forEach(card => {
                    const qrx = gsap.quickTo(card, 'rotateX', {duration:.18, ease:'power2.out'});
                    const qry = gsap.quickTo(card, 'rotateY', {duration:.18, ease:'power2.out'});
                    card.style.transformPerspective = '900px';
                    card.addEventListener('mousemove', e => {
                        const r = card.getBoundingClientRect();
                        const x = (e.clientX - r.left)/r.width - .5;
                        const y = (e.clientY - r.top)/r.height - .5;
                        qry((-x)*10); qrx((y)*8);
                    });
                    card.addEventListener('mouseleave', () => { qry(0); qrx(0); });
                });
            }
        }
        
        ScrollTrigger.refresh();
    }

    // ===================== 4. وظائف قائمة التنقل (النافبار) =====================
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        const syncBodyNav = () => {
            const isVisible = mainNav.getAttribute('data-visible') === 'true';
            document.body.classList.toggle('nav-open', isVisible);
        };

        navToggle.addEventListener('click', () => {
            const isVisible = mainNav.getAttribute('data-visible') === 'true';
            mainNav.setAttribute('data-visible', !isVisible);
            navToggle.setAttribute('aria-expanded', !isVisible);
            syncBodyNav();
        });
    }

    // --- تمييز رابط الصفحة النشطة في النافبار ---
    const navLinks = document.querySelectorAll('.main-nav a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if ((currentPage === 'index.html' && (linkPage === 'index.html' || linkPage === '')) || linkPage === currentPage) {
            link.classList.add('active');
        }
    });
});