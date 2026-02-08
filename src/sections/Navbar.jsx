import React, { useRef, useState, useEffect } from 'react'
import { socials } from '../constants'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Link } from 'react-scroll'

const Navbar = () => {
    const navRef = useRef(null);
    const linksRef = useRef([]);
    const contactRef = useRef(null);
    const topLineRef = useRef(null);
    const bottomLineRef = useRef(null);
    const tl=useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const iconTl = useRef(null);
    const [showBurger, setShowBurger] = useState(true);
    const lastScrollY = useRef(window.scrollY);
useGSAP(() => {
    gsap.set(navRef.current, {xPercent: 100});
    gsap.set([...linksRef.current, contactRef.current],
        {
            autoAlpha: 0,
            x: -20,
        }
    )
    tl.current = gsap.timeline({paused: true})
    .to(navRef.current,
        {
            xPercent: 0,
            duration: 1,
            ease: "power3.out"
        })
        .to(linksRef.current,
            {
                autoAlpha: 1,
                x: 0,
                stagger: 0.1,
                duration: 0.5,
                ease: "power2.out"
            },
        "<"
        ).to(contactRef.current,{
            autoAlpha: 1,
            x: 0,
            duration: 0.5,
            ease: "power2.out"
        },
        "<+0.2"
    );
    iconTl.current = gsap.timeline({paused: true})
    .to(topLineRef.current, {
        rotate: 45,
        y: 3.3,
        duration: 0.3,
        ease: "power2.out"
    })
    .to(bottomLineRef.current, {
        rotate: -45,
        y: -3.3,
        duration: 0.3,
        ease: "power2.out"
    },
  "<"
  )

},[]);

useEffect(() => {
    const handleScroll = () => {
        // Always show burger when menu is open
        if (isOpen) {
            setShowBurger(true);
            return;
        }
        const currentScrollY = window.scrollY;
        setShowBurger(currentScrollY <= lastScrollY.current);
        lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
}, [isOpen]);
const toggleMenu = () => {
    if(isOpen){
        tl.current.reverse();
        iconTl.current.reverse();
        setIsOpen(false);
    }else{
        tl.current.play();
        iconTl.current.play();
        setIsOpen(true);
        // Ensure burger is visible when opening menu
        setShowBurger(true);
    }
}
  return (
    <>
   <nav
    ref={navRef}
   className='fixed z-50 flex flex-col justify-between w-full h-full px-10 uppercase bg-black text-white/80 py-28 gap-y-10 md:w-1/2 md:left-1/2'>
    <div className='flex flex-col text-5xl gap-y-2 md:text-6xl lg:text-8xl'>
        {["home", "services", "about", "projects", "contact"].map((section, index) =>(
            <div key={index} ref={el => linksRef.current[index] = el}>
                <Link to={`${section}`} smooth offset={0} duration={2000} className='transition-all duration-300  cursor-pointer hover:text-white'>
                    {section}
                </Link>
            </div>
        ))}
    </div>
    <div ref={contactRef} className='flex flex-col flex-wrap justify-between gap-8 md:flex-row'>
        <div className='font-light'>
            <p className='tracking-wider text-white/50'>E-mail</p>
            <p className='text-xl tracking-widest lowercase text-pretty'>Luchezar.DD@protonmail.com</p>
        </div>
        <div className='font-light'>
            <p className='tracking-wider text-white/50'>Social Media</p>
          <div className='flex flex-col flex-wrap md:flex-row gap-x-2'>
        {socials.map((social, index) =>
        (
            <a key={index} href={social.href} className='text-sm leading-loose tracking-widest uppercase hover:text-white transition-colors duration-300'>
                {"{"}
                {social.name}
                {"}"}
            </a>
        ))}
        </div>
        </div>
    </div>
   </nav>
   <div className='fixed z-50 flex flex-col items-center justify-center gap-1 transition-all
   duration-300 bg-black rounded-full cursor-pointer w-14 h-14 md:h-20 top-4 right-10' onClick={toggleMenu}
   style={showBurger
    ?{clipPath:"circle(50% at 50% 50%)"}
    :{clipPath:"circle(0% at 50% 50%)"}}>
    <span ref={topLineRef} className='block w-8 h-0.5 bg-white rounded-full origin-center '></span>
    <span ref={bottomLineRef} className='block w-8 h-0.5 bg-white rounded-full origin-center '></span>

   </div>
   </>
  )
}

export default Navbar
