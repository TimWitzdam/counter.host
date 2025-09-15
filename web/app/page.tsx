import Image from "next/image";
import PrimaryButton from "./components/PrimaryButton";
import SecondaryButton from "./components/SecondaryButton";
import DoubleChevronDown from "@/public/icons/DoubleChevronDown.svg";

export default function Home() {
  return (
    <div>
      <section className="relative bg-black h-[93vh] text-white">
        <div className="flex items-center justify-between p-4">
          <span className="text-xl font-medium ">counter.host</span>
          <SecondaryButton>Login</SecondaryButton>
        </div>
        <div className="absolute h-full w-full top-0 left-0 flex flex-col gap-2 items-center justify-center">
          <h1 className="text-3xl font-medium text-center">
            Simple counters <br /> for developers
          </h1>
          <p className="text-xl mb-4">For free.</p>
          <PrimaryButton>Get started</PrimaryButton>
        </div>
      </section>
      <div className="-mt-11 rounded-t-4xl h-14 bg-background z-100 relative pt-6">
        <div className="mx-auto w-fit">
          <DoubleChevronDown></DoubleChevronDown>
        </div>
      </div>
      <section>
        <div className="my-16 px-4 flex flex-col gap-30">
          <div className="text-right">
            <p className="text-3xl font-medium">Need a</p>
            <p className="text-lg">view counter for your blog articles?</p>
          </div>
          <div className="">
            <p className="text-3xl font-medium">Or a</p>
            <p className="text-lg">uses counter for your tool collection?</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-medium">Maybe a</p>
            <p className="text-lg">download counter for your custom app?</p>
          </div>
        </div>
        <div className="relative text-white text-center flex flex-col gap-1 items-center justify-center py-16">
          <Image
            src={"/roundedBackground.png"}
            alt="Black rounded background for section"
            fill
            className="absolute inset-0 -z-10 object-cover object-top"
          />
          <p className="text-3xl font-medium">All of that</p>
          <p className="text-lg mb-6">
            without a full blown <br /> backend and database.
          </p>
          <PrimaryButton>Get started</PrimaryButton>
        </div>
      </section>
      <footer className="text-center lg:text-left">
        <div className="grid lg:grid-cols-3 divide-x divide-y ">
          <a className="text-2xl font-medium py-5 px-4" href="/">
            Home
          </a>
          <a className="text-2xl font-medium py-5 px-4" href="/register">
            Sign Up
          </a>
          <a className="text-2xl font-medium py-5 px-4" href="/login">
            Login
          </a>
          <a className="text-2xl font-medium py-5 px-4" href="/docs">
            API Documentation
          </a>
          <a className="text-2xl font-medium py-5 px-4" href="/support">
            Support
          </a>
          <a
            className="text-2xl font-medium py-5 px-4 border-b border-r"
            href="https://github.com/TimWitzdam/counter.host"
            target="_blank"
          >
            GitHub
          </a>
        </div>
        <p className="text-sm py-5 px-4">&copy; 2025 counter.host</p>
      </footer>
    </div>
  );
}
