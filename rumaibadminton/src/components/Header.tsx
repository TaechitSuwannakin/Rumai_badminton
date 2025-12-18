import React from 'react';

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: 'ก๊วนแบดมินตัน', href: '/groups' },
  { name: 'About', href: '/about' },
];

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-100">
      <nav className="relative max-w-5xl mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2" onClick={() => window.scrollTo({ top :0 , behavior: 'smooth'})}>
          <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center">
            <span className="text-lg">🏸</span>
          </div>
          <span className="font-semibold text-sm sm:text-base">
            Rumai Badminton
          </span>
        </div>
        <span className="hidden sm:block absolute left-1/2 -translate-x-1/2 text-xs text-slate-500">
          เลือกไม้ด้วยสไตล์ของคุณ
        </span>

        {/* Menu Right */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href} className="text-slate-600 hover:text-emerald-600 transition duration-150"  > {item.name} </a>
          ))}
        </div>
      </nav>

    </header>
  );
}

export default Header;