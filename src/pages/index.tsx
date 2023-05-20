import Layout from "@/app/components/layout/Layout";
import Canvas from "@/app/components/ui/Canvas";

export default function Home() {
  return (
    <Layout
      seoTitle="Circles.io"
      description="Can you draw a circle?"
    >
      <div className="w-full h-[40vh] md:h-[70vh] lg:h-[80vh] flex items-center justify-center">
        <Canvas />
      </div>
    </Layout>
  );
}
