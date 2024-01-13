window.addEventListener('scroll', function(){
    const top = document.getElementById('top');
    top.classList.toggle("top-visible", window.scrollY > 300);
});