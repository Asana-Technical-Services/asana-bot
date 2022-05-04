import React, { useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Footer from "/src/components/footer";
import useUser from "/src/lib/useUser";
import { signIn, useSession } from "next-auth/react";

const SignInPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("session!");
    console.log(session);
    if (session) {
      router.replace("/home");
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    signIn("asana", { callbackUrl: "/home" });
  };

  return (
    <main className="absolute w-full h-full">
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-900  border-0">
              <div className="rounded-t flex-auto px-4 lg:px-10 py-10">
                <form onSubmit={handleSubmit}>
                  <div className="text-center mt-6 pt-5 ">
                    <button
                      className="bg-blue-400 text-blue-900 hover:bg-blue-500 active:bg-blue-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                      type="submit"
                      style={{ transition: "all .15s ease" }}
                    >
                      Sign In With Asana
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer absolute />
    </main>
  );
};

export default SignInPage;
