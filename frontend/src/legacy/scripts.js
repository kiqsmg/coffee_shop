const links = document.querySelectorAll('.navbar-links a');
const menuList = document.querySelector('.menu-list');
const nav = document.querySelector('.navbar');

menuList.addEventListener('click', () => {
    nav.classList.toggle('active');
});
  
links.forEach(item => {
    item.addEventListener('click', () => {
      nav.classList.toggle('active');
    })
})