const header = $('header');
const canvas = $('.base-plate');


const tl = new TimelineMax();

tl.fromTo(canvas, 1, {height: '0vh'}, {height: '100vh'}, {ease: Power2.easeInOut})
    .fromTo(header, 1.5, {y:'-800%', opacity: '0'}, {y:'0%', opacity: '1'}, {ease: Power2.easeInOut});
