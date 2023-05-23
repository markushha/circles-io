import { toggleTheme } from "@/app/redux/theme/themeSlice"
import { useDispatch, useSelector } from "react-redux"
import { Switch } from "./shadcn/switch"
import { AiFillGithub } from "react-icons/ai"

function Navbar() {
  const dispatch = useDispatch()
  const theme = useSelector((state: any) => state.theme)

  const toggleHandler = () => {
    theme.value === "light" ? dispatch(toggleTheme("dark")) : dispatch(toggleTheme("light"))
  }

  return (
    <div className="w-full fixed top-0 left-0 h-16 flex items-center p-6 lg:p-8 shadow-lg text-slate-950 font-semibold dark:text-slate-200 bg-slate-100 dark:bg-slate-800 shadow-xl">
      <div className="lg:w-[70%] md:w-[85%] w-full mx-auto flex items-center justify-between">
        <div className="text-lg lg:text-2xl">
          Circles.io
        </div>
          <a className="flex items-center text-xl lg:text-2xl" target="_blank" href="https://github.com/markushha">
            <AiFillGithub size={32} color={ theme.value === "dark" ? "white" : "black" } />
            <code className="ml-2">markushha</code>
          </a>
        <div className="">
          <Switch onClick={toggleHandler} />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
