

const Menu = [
  {
    id: 1,
    name: "หน้าหลัก",
    link: "/#",
  },
  {
    id: 2,
    name: "เกี่ยวกับเรา",
    link: "#Footer",
  },
  {
    id: 3,
    name: "เมนู",
    link: "/#menu",
  },
  {
    id: 4,
    name: "บริการ",
    link: "#services",
  },

  {
    id: 5,
    name: "ข่าวสาร",
    link: "#news",},
];
const Navbar = () => {
  return (
    <>
      <div className="shadow-xl">
        <div className="container py-3 sm:py-0">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl  text-primary px-3">Samoeng Hospital</p>
            </div>
            <div className="flex justify-between items-center gap-4">
              <ul className="hidden sm:flex items-center gap-4">
                {Menu.map((menu) => (
                  <li key={menu.id}>
                    <a
                      href={menu.link}
                      className="inline-block py-4 px-4 hover:text-primary duration-300"
                    >
                      {menu.name}
                    </a>
                  </li>
                ))}
              </ul>
              <button className="bg-green-500 hover:bg-green-600 hover:scale-105 duration-200 text-white py-1 px-4 rounded-full">
                ติดต่อเรา
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
