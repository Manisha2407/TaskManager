// --- NAVBAR SCROLL EFFECT ---
//when the user scrolls down 50px from the top of the document,resize the navbar's padding and change the the backgound color
const navbar = document.querySelector('.navbar');
window.onscroll = () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');//yeh line navbar me scrolled class add krdega 
    } else {
        navbar.classList.remove('scrolled');
    }
};
// --- FADE-IN ON SCROLL EFFECT (NEW) ---
const sections = document.querySelectorAll('.fade-in-section');//yeh line sabhi elements ko select krke degi jinke andr fade-in-section class hai

const options = {
    root: null, //yeh line se viewport ko root set krte hai is se pata chalta hai ki humara element viewport me hai ya nhi
    threshold: 0.15, // yeh line se pta chalta hai ki element ka kitna hissa viewport me dikhna chahiye tabhi callback functuon call hoga
    rootMargin: "0px"//yeh line se root ke around margin set krte hai, is case me koi margin nhi hai
};
const observer = new IntersectionObserver(function(entries, observer) {//yeh callback function hai jo tab call hota hai jab koi observed element viewport mei ata hai
    entries.forEach(entry => {
        if (!entry.isIntersecting) {//yeh line check krti hai ki element viewport me hai ya nhi isIntersecting property se hame pta chalta hai ki element viewport me hai ya nhi 
            return;
        }
        entry.target.classList.add('is-visible');//yeh line us element me is-visible class add krdega jisse wo fade-in effect ke sath dikhai dega
        observer.unobserve(entry.target);//yeh line us element ko observe krna band krdega taki wo baar baar fade-in effect na dikhaye
    });
}, options);

sections.forEach(section => {
    observer.observe(section);
});