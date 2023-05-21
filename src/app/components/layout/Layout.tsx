import Head from "next/head";
import Navbar from "../ui/Navbar";
import { useSelector } from "react-redux"

interface ILayout {
  children: React.ReactNode,
  seoTitle: string,
  description?: string
}

function Layout({ children, seoTitle, description }: ILayout) {
  const theme = useSelector((state: any) => state.theme)

  return (
    <div className={`${theme.value === "dark" ? "dark" : ""}`}>
      <Head>
        <title>{seoTitle}</title>
        <meta
          property="og:description"
          name="description"
          content={description}
        />
      </Head>
      {/* <nav>
        <Navbar />
      </nav> */}
      <main>
      <div className={`p-0 m-0 border-box w-full dark:bg-slate-900 bg-slate-200 dark:text-slate-100 text-slate-950`}>
        <div className="lg:w-[70%] md:w-[85%] w-full p-6 lg:p-0 md:p-0 h-[100vh] mx-auto flex items-center flex-col justify-center">
          {children}
        </div>
      </div>
      </main>
      <footer>

      </footer>
    </div>
  );
}

export default Layout;
