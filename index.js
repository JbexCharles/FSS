// Set copyright year
    document.getElementById('copyYear').textContent = new Date().getFullYear();

    // Add shadow when navbar is scrolled
    const nav = document.getElementById('mainNav');
    const hero = document.querySelector('.hero');
    function handleNavShadow(){ nav.classList.toggle('sticky-shadow', window.scrollY > 10); }
    handleNavShadow();
    window.addEventListener('scroll', handleNavShadow);

    // Smooth-scroll offset for sticky nav (adjust for nav height)
    document.querySelectorAll('a.nav-link[href^="#"]').forEach(link=>{
      link.addEventListener('click', function(e){
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(!target) return;
        const navHeight = nav.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 8;
        window.scrollTo({ top, behavior: 'smooth' });
        // close mobile menu if open
        const bsCollapse = bootstrap.Collapse.getInstance(document.getElementById('navCollapse'));
        if(bsCollapse && window.getComputedStyle(document.querySelector('.navbar-toggler')).display !== 'none'){
          bsCollapse.hide();
        }
      });
    });

    // IntersectionObserver for reveal animations
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){ entry.target.classList.add('show'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(r => observer.observe(r));

    // Simple contact form validation + simulated send
    const contactForm = document.getElementById('contactForm');
    const formAlert = document.getElementById('formAlert');

    function isValidEmail(email){
      // digit-by-digit careful regex (simple but effective)
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    contactForm.addEventListener('submit', function(e){
      e.preventDefault();

      // fields
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');

      let valid = true;

      // Name
      if(!name.value.trim()){
        name.classList.add('is-invalid'); valid = false;
      } else { name.classList.remove('is-invalid'); }

      // Email
      if(!email.value.trim() || !isValidEmail(email.value.trim())){
        email.classList.add('is-invalid'); valid = false;
      } else { email.classList.remove('is-invalid'); }

      // Message
      if(!message.value.trim()){
        message.classList.add('is-invalid'); valid = false;
      } else { message.classList.remove('is-invalid'); }

      if(!valid){
        showAlert('Please complete the required fields and try again.', 'danger');
        return;
      }

      // Simulate send (no backend). You can replace this with an API call.
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin ms-2"></i>';

      setTimeout(()=> {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane ms-2"></i>';
        contactForm.reset();
        showAlert('Thank you! Your message has been received. We will contact you shortly.', 'success');
      }, 1100);
    });

    function showAlert(message, type){
      formAlert.style.display = 'inline-block';
      formAlert.className = 'alert alert-' + type;
      formAlert.textContent = message;
      setTimeout(()=> { formAlert.style.display = 'none'; }, 6000);
    }

    // Small accessibility improvements: enable keyboard to scroll to hero CTA
    document.querySelectorAll('.btn-cta').forEach(b=>{
      b.addEventListener('keyup', (e)=> { if(e.key === 'Enter') b.click(); });
    });

    // Activate carousel pause/resume on hover for desktop
    const heroCarouselEl = document.getElementById('heroCarousel');
    const heroCarousel = bootstrap.Carousel.getOrCreateInstance(heroCarouselEl, { interval: 4500 });
    heroCarouselEl.addEventListener('mouseenter', ()=> heroCarousel.pause());
    heroCarouselEl.addEventListener('mouseleave', ()=> heroCarousel.cycle());