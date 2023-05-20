import { toggleTheme } from "@/app/redux/theme/themeSlice"
import { useDispatch, useSelector } from "react-redux"
import { Switch } from "./shadcn/switch"

function Navbar() {
  const dispatch = useDispatch()
  const theme = useSelector((state: any) => state.theme)

  const toggleHandler = () => {
    theme.value === "light" ? dispatch(toggleTheme("dark")) : dispatch(toggleTheme("light"))
  }

  return (
    <div className="w-full fixed top-0 left-0 h-16 flex items-center p-6 lg:p-8 shadow-lg text-slate-950 font-semibold dark:text-slate-200 bg-slate-100 dark:bg-slate-800 shadow-xl">
      <div className="lg:w-[70%] md:w-[85%] w-full h-[100vh] mx-auto flex items-center justify-center">
        <div className="mr-auto text-lg lg:text-2xl">
          Circles.io <span>by</span> <a target="_blank" href="https://github.com/markushha"><code>markushha</code></a>
        </div>
        <div className="ml-auto">
          <Switch onClick={toggleHandler} />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
