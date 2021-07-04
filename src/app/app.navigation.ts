var menuItems = [];
let nav = [
  {
    title: 'Inventory',
    routerLink: '/inventory',
    icon: 'fal fa-book'
  }
]
sessionStorage.setItem('navigation', JSON.stringify(nav));

menuItems = JSON.parse(sessionStorage.getItem('navigation'));

export const NavigationItems = menuItems;

